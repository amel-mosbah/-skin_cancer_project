import sys
import os
from fastapi.testclient import TestClient

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

#test upload image
def test_predict_with_image():
    # 
    image_path = "tests/images/sample.jpg"

    # 
    with open(image_path, "rb") as img:
        response = client.post(
            "/predict",
            files={"file": ("sample.jpg", img, "image/jpeg")}
        )

    # 
    assert response.status_code == 200

    data = response.json()

    # 
    assert "filename" in data
    assert "predicted_class" in data
    assert data["filename"] == "sample.jpg"
    assert type(data["predicted_class"]) is str
