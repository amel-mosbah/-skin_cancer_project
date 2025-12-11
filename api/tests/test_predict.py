import sys
import os
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

# Fix import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)


def test_root_not_found():
    response = client.get("/")
    assert response.status_code == 404


def test_docs_exist():
    response = client.get("/docs")
    assert response.status_code == 200


def test_predict_no_file():
    response = client.post("/predict", files={})
    assert response.status_code == 422


# -----------------------------
# MOCK MODEL FOR PREDICTION TEST
# -----------------------------
@patch("main.model")
def test_predict_with_image(mock_model):
    # Fake model output
    fake_output = MagicMock()
    fake_output.argmax.return_value = 0

    mock_model.return_value = fake_output

    image_path = "tests/images/sample.jpg"
    with open(image_path, "rb") as img:
        response = client.post(
            "/predict",
            files={"file": ("sample.jpg", img, "image/jpeg")}
        )

    assert response.status_code == 200

    data = response.json()

    # Check JSON keys
    assert "filename" in data
    assert "predicted_class" in data

    assert data["filename"] == "sample.jpg"
    assert isinstance(data["predicted_class"], str)

