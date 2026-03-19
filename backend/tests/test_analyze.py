import pytest
from fastapi.testclient import TestClient

from app.main import create_app
from app.services.feature_extractor import extract_features


def test_extract_features_basic():
    f = extract_features("Summarize this text in 3 bullet points.\n\nHello world")
    assert f["token_count"] > 0
    assert f["sentence_count"] >= 1
    assert 0.0 <= f["type_token_ratio"] <= 1.0


def test_analyze_endpoint_smoke():
    app = create_app()
    client = TestClient(app)

    resp = client.post(
        "/api/analyze",
        json={
            "prompt": "Write a Python function to reverse a linked list.",
            "preferences": {"cost": 0.4, "quality": 0.4, "speed": 0.2},
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "task_type" in data
    assert "recommendations" in data
    assert len(data["recommendations"]) >= 1
