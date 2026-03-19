from fastapi import APIRouter

from app.models.schemas import ModelInfo, ModelsResponse
from app.services.model_registry import ModelRegistry

router = APIRouter()

# MVP note: in-memory registry. Later you can persist to a DB.
_registry = ModelRegistry.from_defaults()


@router.get("/models", response_model=ModelsResponse)
async def list_models() -> ModelsResponse:
    return ModelsResponse(models=_registry.list_models())


@router.post("/models", response_model=ModelsResponse)
async def add_model(model: ModelInfo) -> ModelsResponse:
    _registry.upsert_model(model)
    return ModelsResponse(models=_registry.list_models())


@router.put("/models/{model_id}", response_model=ModelsResponse)
async def update_model(model_id: str, model: ModelInfo) -> ModelsResponse:
    # Ensure path id wins
    model.id = model_id
    _registry.upsert_model(model)
    return ModelsResponse(models=_registry.list_models())


@router.delete("/models/{model_id}", response_model=ModelsResponse)
async def delete_model(model_id: str) -> ModelsResponse:
    _registry.delete_model(model_id)
    return ModelsResponse(models=_registry.list_models())


@router.get("/models/defaults", response_model=ModelsResponse)
async def reset_to_defaults() -> ModelsResponse:
    global _registry
    _registry = ModelRegistry.from_defaults()
    return ModelsResponse(models=_registry.list_models())
