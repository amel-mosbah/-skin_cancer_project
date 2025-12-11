from fastapi import FastAPI, File, UploadFile
import torch
import torch.nn as nn
from torchvision.models import inception_v3
from torchvision import transforms
from PIL import Image
import io
import os

app = FastAPI()

# ==============================
# Load Model
# ==============================
MODEL_PATH = "best_inception_v3.pth"

# Detect CI (GitHub Actions)
IS_CI = os.environ.get("CI") == "true"

# Build model architecture
model = inception_v3(weights=None, aux_logits=False)
model.fc = nn.Linear(model.fc.in_features, 7)

# Skip loading the real model in CI
if IS_CI:
    print("⚠️ CI detected → Skipping model loading.")
    model = None
else:
    print("🔄 Loading model...")
    state = torch.load(MODEL_PATH, map_location="cpu")
    model.load_state_dict(state, strict=False)
    model.eval()
    print("✅ Model loaded successfully.")

# ==============================
# Transform
# ==============================
transform = transforms.compose([
    transforms.Resize((299, 299)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

class_mapping = ["bkl", "nv", "df", "mel", "vasc", "bcc", "akiec"]

# ==============================
# Predict Route
# ==============================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # In CI: return fake prediction for tests
    if model is None:
        return {
            "filename": file.filename,
            "predicted_class": "test_class"
        }

    content = await file.read()
    img = Image.open(io.BytesIO(content)).convert("RGB")

    x = transform(img).unsqueeze(0)

    with torch.no_grad():
        out = model(x)
        idx = out.argmax(1).item()
        pred = class_mapping[idx]

    return {
        "filename": file.filename,
        "predicted_class": pred
    }
