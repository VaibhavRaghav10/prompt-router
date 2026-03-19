from __future__ import annotations

from dataclasses import dataclass

from app.core.default_models import get_default_models
from app.models.schemas import ModelInfo


@dataclass
class ModelRegistry:
    _models: dict[str, ModelInfo]

    @classmethod
    def from_defaults(cls) -> "ModelRegistry":
        models = {m.id: m for m in get_default_models()}
        return cls(_models=models)

    @classmethod
    def from_user_models(cls, models: list[ModelInfo]) -> "ModelRegistry":
        return cls(_models={m.id: m for m in models})

    def list_models(self) -> list[ModelInfo]:
        return list(self._models.values())

    def enabled_models(self) -> list[ModelInfo]:
        return [m for m in self._models.values() if m.enabled]

    def upsert_model(self, model: ModelInfo) -> None:
        self._models[model.id] = model

    def delete_model(self, model_id: str) -> None:
        self._models.pop(model_id, None)
