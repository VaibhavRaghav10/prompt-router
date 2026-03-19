from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field


TaskType = Literal[
    "simple_qa",
    "summarization",
    "code_generation",
    "creative_writing",
    "analysis",
    "math_reasoning",
    "translation",
    "conversation",
    "extraction",
]


class Preferences(BaseModel):
    # 0..1, where 1 means "prioritize" that dimension.
    cost: float = 0.33
    quality: float = 0.34
    speed: float = 0.33


class ModelInfo(BaseModel):
    id: str = Field(..., description="Unique identifier")
    name: str
    provider: str
    input_price_per_1k: float = Field(..., ge=0)
    output_price_per_1k: float = Field(..., ge=0)
    max_context_tokens: int = Field(..., ge=1)
    speed_tier: Literal["fast", "medium", "slow"] = "medium"
    enabled: bool = True

    # Capability scores (0..1) by task type.
    capability: Dict[str, float] = Field(default_factory=dict)


class AnalyzeRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    preferences: Preferences = Field(default_factory=Preferences)

    # Optional: user-provided models list; if present, use instead of defaults.
    models: Optional[List[ModelInfo]] = None


class Recommendation(BaseModel):
    model: ModelInfo
    score: float
    estimated_input_tokens: int
    estimated_output_tokens: int
    estimated_cost_usd: float
    reasons: List[str]


class AnalyzeResponse(BaseModel):
    task_type: TaskType
    task_confidence: float
    complexity: float
    features: Dict[str, Any]
    recommendations: List[Recommendation]


class ModelsResponse(BaseModel):
    models: List[ModelInfo]
