from __future__ import annotations

from typing import Any, Dict, List

from app.models.schemas import ModelInfo, Preferences, Recommendation, TaskType
from app.services.feature_extractor import estimate_tokens
from app.services.model_registry import ModelRegistry


def _normalize_weights(prefs: Preferences) -> tuple[float, float, float]:
    w_cost = max(0.0, float(prefs.cost))
    w_quality = max(0.0, float(prefs.quality))
    w_speed = max(0.0, float(prefs.speed))
    s = w_cost + w_quality + w_speed
    if s <= 0:
        return 1 / 3, 1 / 3, 1 / 3
    return w_cost / s, w_quality / s, w_speed / s


_SPEED_BONUS = {
    "fast": 1.0,
    "medium": 0.6,
    "slow": 0.2,
}


def _estimate_output_tokens(task_type: TaskType, input_tokens: int) -> int:
    # Rough heuristic: output tends to be proportional but bounded.
    if task_type in ("summarization", "extraction"):
        return max(150, min(800, input_tokens // 4))
    if task_type in ("translation",):
        return max(150, min(1200, int(input_tokens * 0.6)))
    if task_type in ("code_generation", "analysis", "math_reasoning"):
        return max(250, min(1500, int(input_tokens * 0.8)))
    return max(100, min(600, int(input_tokens * 0.4)))


def recommend_models(
    *,
    prompt: str,
    task_type: TaskType,
    task_confidence: float,
    task_rationale: List[str],
    complexity: float,
    features: Dict[str, Any],
    registry: ModelRegistry,
    preferences: Preferences,
) -> List[Recommendation]:
    w_cost, w_quality, w_speed = _normalize_weights(preferences)

    input_tokens = int(features.get("token_count") or estimate_tokens(prompt))
    output_tokens = _estimate_output_tokens(task_type, input_tokens)

    enabled = registry.enabled_models()

    # Filter by context window with a safety margin.
    need_ctx = input_tokens + output_tokens + 256
    candidates: List[ModelInfo] = [m for m in enabled if m.max_context_tokens >= need_ctx]

    recs: List[Recommendation] = []
    for m in candidates:
        cap = float(m.capability.get(task_type, 0.5))

        # Complexity makes capability matter more.
        quality = cap * (0.6 + 0.4 * float(complexity))

        # Estimate cost
        cost = (input_tokens / 1000.0) * m.input_price_per_1k + (output_tokens / 1000.0) * m.output_price_per_1k

        # Convert cost to a 0..1 score where cheaper is better (log-ish).
        cost_score = 1.0 / (1.0 + cost)

        speed = float(_SPEED_BONUS.get(m.speed_tier, 0.6))

        score = w_quality * quality + w_cost * cost_score + w_speed * speed

        reasons: List[str] = []
        reasons.extend(task_rationale[:2])
        reasons.append(f"Task type: {task_type} (confidence {task_confidence:.2f}).")
        reasons.append(f"Complexity score: {complexity:.2f}.")
        reasons.append(f"Estimated cost: ${cost:.4f}.")
        if m.max_context_tokens < 20000:
            reasons.append("Smaller context window; best for shorter prompts.")
        if cap >= 0.9:
            reasons.append("High capability score for this task.")
        if m.input_price_per_1k <= 0.5:
            reasons.append("Low input token pricing.")

        recs.append(
            Recommendation(
                model=m,
                score=float(score),
                estimated_input_tokens=input_tokens,
                estimated_output_tokens=output_tokens,
                estimated_cost_usd=float(cost),
                reasons=reasons,
            )
        )

    recs.sort(key=lambda r: r.score, reverse=True)
    return recs[:3]
