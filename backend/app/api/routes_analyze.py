from fastapi import APIRouter

from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.feature_extractor import extract_features
from app.services.task_classifier import classify_task
from app.services.complexity_scorer import score_complexity
from app.services.model_registry import ModelRegistry
from app.services.recommender import recommend_models

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    features = extract_features(req.prompt)
    task_type, task_confidence, task_rationale = classify_task(req.prompt, features)
    complexity = score_complexity(task_type, features)

    registry = ModelRegistry.from_defaults()
    if req.models is not None:
        registry = ModelRegistry.from_user_models(req.models)

    recs = recommend_models(
        prompt=req.prompt,
        task_type=task_type,
        task_confidence=task_confidence,
        task_rationale=task_rationale,
        complexity=complexity,
        features=features,
        registry=registry,
        preferences=req.preferences,
    )

    return AnalyzeResponse(
        task_type=task_type,
        task_confidence=task_confidence,
        complexity=complexity,
        features=features,
        recommendations=recs,
    )
