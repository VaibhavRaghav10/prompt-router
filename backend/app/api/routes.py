from fastapi import APIRouter

from app.api.routes_analyze import router as analyze_router
from app.api.routes_models import router as models_router

router = APIRouter()

router.include_router(analyze_router, prefix="/api", tags=["analyze"])
router.include_router(models_router, prefix="/api", tags=["models"])
