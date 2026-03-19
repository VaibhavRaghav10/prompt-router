from fastapi.testclient import TestClient

from app.main import create_app


def test_models_list_and_crud():
    app = create_app()
    client = TestClient(app)

    r = client.get("/api/models")
    assert r.status_code == 200
    models = r.json()["models"]
    assert len(models) >= 1

    new_model = {
        "id": "test-model",
        "name": "Test Model",
        "provider": "test",
        "input_price_per_1k": 0.1,
        "output_price_per_1k": 0.2,
        "max_context_tokens": 8192,
        "speed_tier": "fast",
        "enabled": True,
        "capability": {"simple_qa": 0.5},
    }

    r = client.post("/api/models", json=new_model)
    assert r.status_code == 200
    assert any(m["id"] == "test-model" for m in r.json()["models"])

    updated = dict(new_model)
    updated["name"] = "Test Model 2"
    r = client.put("/api/models/test-model", json=updated)
    assert r.status_code == 200
    assert any(m["id"] == "test-model" and m["name"] == "Test Model 2" for m in r.json()["models"])

    r = client.delete("/api/models/test-model")
    assert r.status_code == 200
    assert not any(m["id"] == "test-model" for m in r.json()["models"])
