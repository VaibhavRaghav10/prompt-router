from __future__ import annotations

from typing import Any, Dict, List, Tuple

from app.models.schemas import TaskType


def _contains_any(text: str, needles: List[str]) -> bool:
    t = text.lower()
    return any(n in t for n in needles)


def classify_task(prompt: str, features: Dict[str, Any]) -> Tuple[TaskType, float, List[str]]:
    """Return (task_type, confidence, rationale).

    MVP: rule-based + heuristics; later replace with ML classifier.
    """

    rationale: List[str] = []
    p = prompt.lower()

    # Strong signals first
    if features.get("keyword_translate", 0.0) >= 1.0 or _contains_any(p, ["translate to", "translate into", "in spanish", "in french"]):
        rationale.append("Detected translation keywords.")
        return "translation", 0.85, rationale

    if features.get("keyword_summarize", 0.0) >= 1.0 or _contains_any(p, ["summarize", "tl;dr", "tldr", "give me a summary"]):
        rationale.append("Detected summarization keywords.")
        return "summarization", 0.85, rationale

    if features.get("has_code", 0.0) >= 1.0 or features.get("keyword_code", 0.0) >= 1.0 or _contains_any(
        p,
        [
            "write a function",
            "implement",
            "bug",
            "debug",
            "stack trace",
            "unit test",
            "typescript",
            "python",
            "react",
            "fastapi",
        ],
    ):
        rationale.append("Detected code-related signals (code fences or code keywords).")
        return "code_generation", 0.80, rationale

    if features.get("keyword_extract", 0.0) >= 1.0 or _contains_any(p, ["extract", "parse", "json", "schema", "structured output"]):
        rationale.append("Detected extraction/structured-output intent.")
        return "extraction", 0.75, rationale

    if features.get("keyword_math", 0.0) >= 1.0 or _contains_any(p, ["prove", "derive", "calculate", "solve", "equation"]):
        rationale.append("Detected math/reasoning keywords.")
        return "math_reasoning", 0.75, rationale

    if features.get("keyword_creative", 0.0) >= 1.0 or _contains_any(p, ["write a story", "poem", "lyrics", "creative writing", "marketing copy"]):
        rationale.append("Detected creative-writing keywords.")
        return "creative_writing", 0.70, rationale

    # Analysis vs simple QA vs conversation
    if _contains_any(p, ["compare", "analyze", "evaluate", "tradeoff", "pros and cons", "deep dive"]):
        rationale.append("Detected analysis-oriented keywords.")
        return "analysis", 0.70, rationale

    if features.get("question_density", 0.0) > 0.5 and features.get("token_count", 0) < 200:
        rationale.append("High question density with short prompt suggests simple Q&A.")
        return "simple_qa", 0.60, rationale

    if features.get("token_count", 0) < 80 and _contains_any(p, ["hi", "hello", "how are you", "what's up"]):
        rationale.append("Short conversational greeting.")
        return "conversation", 0.60, rationale

    # Default fallback
    if features.get("token_count", 0) >= 200:
        rationale.append("Longer prompt without strong intent keywords; defaulting to analysis.")
        return "analysis", 0.55, rationale

    rationale.append("No strong signals; defaulting to simple Q&A.")
    return "simple_qa", 0.50, rationale
