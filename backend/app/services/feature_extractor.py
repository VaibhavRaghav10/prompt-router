from __future__ import annotations

import math
import re
from functools import lru_cache
from typing import Any, Dict

import tiktoken
import textstat

try:
    import spacy
except Exception:  # pragma: no cover
    spacy = None


_WORD_RE = re.compile(r"[A-Za-z0-9_]+")
_CODE_FENCE_RE = re.compile(r"```[\s\S]*?```", re.MULTILINE)
_NUMBERED_LIST_RE = re.compile(r"^\s*\d+\.", re.MULTILINE)
_BULLET_LIST_RE = re.compile(r"^\s*[-*+]\s+", re.MULTILINE)
_QUESTION_RE = re.compile(r"\?")


@lru_cache(maxsize=1)
def _get_encoder():
    return tiktoken.get_encoding("cl100k_base")


@lru_cache(maxsize=1)
def _get_spacy_nlp():
    if spacy is None:
        return None
    try:
        return spacy.load("en_core_web_sm")
    except Exception:
        return None


def estimate_tokens(text: str) -> int:
    enc = _get_encoder()
    return len(enc.encode(text))


def _split_sentences(text: str) -> list[str]:
    # Lightweight sentence splitting (keeps dependencies minimal).
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p for p in parts if p]


def extract_features(prompt: str) -> Dict[str, Any]:
    prompt = prompt.strip()

    tokens = estimate_tokens(prompt)
    sentences = _split_sentences(prompt)
    sentence_count = len(sentences)
    avg_sentence_len = (sum(len(s) for s in sentences) / sentence_count) if sentence_count else 0.0

    words = _WORD_RE.findall(prompt)
    word_count = len(words)
    unique_words = len(set(w.lower() for w in words))
    type_token_ratio = (unique_words / word_count) if word_count else 0.0

    code_fences = len(_CODE_FENCE_RE.findall(prompt))
    has_code = 1.0 if code_fences > 0 else 0.0

    questions = prompt.count("?")
    question_density = (questions / sentence_count) if sentence_count else 0.0

    numbered_steps = len(_NUMBERED_LIST_RE.findall(prompt))
    bullet_steps = len(_BULLET_LIST_RE.findall(prompt))
    structural_complexity = float(min(1.0, (numbered_steps + bullet_steps) / 10.0))

    # Keyword signals
    lower = prompt.lower()
    keyword_summarize = 1.0 if any(k in lower for k in ["summarize", "tl;dr", "tldr", "condense"]) else 0.0
    keyword_translate = 1.0 if any(k in lower for k in ["translate", "into french", "into spanish"]) else 0.0
    keyword_code = 1.0 if any(k in lower for k in ["write code", "bug", "debug", "refactor", "unit test"]) else 0.0
    keyword_extract = 1.0 if any(k in lower for k in ["extract", "json", "csv", "schema", "structured"]) else 0.0
    keyword_math = 1.0 if any(k in lower for k in ["prove", "derive", "calculate", "integral", "equation", "theorem"]) else 0.0
    keyword_creative = 1.0 if any(k in lower for k in ["story", "poem", "lyrics", "creative", "marketing copy"]) else 0.0

    # Readability: textstat can raise on empty-ish inputs; guard it.
    try:
        fk_grade = float(textstat.flesch_kincaid_grade(prompt)) if prompt else 0.0
    except Exception:
        fk_grade = 0.0

    # Named entities via spaCy (optional).
    ner_count = 0
    nlp = _get_spacy_nlp()
    if nlp is not None and prompt:
        try:
            doc = nlp(prompt[:5000])  # cap to keep latency bounded
            ner_count = len(doc.ents)
        except Exception:
            ner_count = 0

    # Domain-ish indicator: jargon-ish words (very rough proxy)
    long_word_ratio = (sum(1 for w in words if len(w) >= 10) / word_count) if word_count else 0.0

    return {
        "token_count": tokens,
        "sentence_count": sentence_count,
        "avg_sentence_len": avg_sentence_len,
        "word_count": word_count,
        "unique_words": unique_words,
        "type_token_ratio": type_token_ratio,
        "code_fences": code_fences,
        "has_code": has_code,
        "question_count": questions,
        "question_density": question_density,
        "numbered_steps": numbered_steps,
        "bullet_steps": bullet_steps,
        "structural_complexity": structural_complexity,
        "keyword_summarize": keyword_summarize,
        "keyword_translate": keyword_translate,
        "keyword_code": keyword_code,
        "keyword_extract": keyword_extract,
        "keyword_math": keyword_math,
        "keyword_creative": keyword_creative,
        "fk_grade": fk_grade,
        "ner_count": ner_count,
        "long_word_ratio": long_word_ratio,
        # A light non-linear transform helpful for downstream scoring
        "log_token_count": math.log1p(tokens),
    }
