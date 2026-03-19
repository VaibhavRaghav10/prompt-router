from __future__ import annotations

from typing import Any, Dict

from app.models.schemas import TaskType


_TASK_BASE = {
    "simple_qa": 0.25,
    "conversation": 0.20,
    "summarization": 0.35,
    "translation": 0.35,
    "extraction": 0.40,
    "creative_writing": 0.45,
    "code_generation": 0.55,
    "analysis": 0.60,
    "math_reasoning": 0.65,
}


def _clamp01(x: float) -> float:
    return max(0.0, min(1.0, x))


def score_complexity(task_type: TaskType, features: Dict[str, Any]) -> float:
    base = float(_TASK_BASE.get(task_type, 0.5))

    tokens = float(features.get("token_count", 0))
    structural = float(features.get("structural_complexity", 0.0))
    ner = float(features.get("ner_count", 0))
    has_code = float(features.get("has_code", 0.0))
    fk = float(features.get("fk_grade", 0.0))

    # Token contribution saturates to avoid over-penalizing long contexts
    token_score = _clamp01(tokens / 1500.0)

    # Named entities roughly signal domain specificity
    ner_score = _clamp01(ner / 20.0)

    # Readability: higher grade → somewhat more complex; cap it.
    fk_score = _clamp01(fk / 18.0)

    # Combine
    complexity = (
        0.45 * base
        + 0.25 * token_score
        + 0.15 * structural
        + 0.10 * ner_score
        + 0.05 * fk_score
        + 0.05 * has_code
    )

    return _clamp01(complexity)
