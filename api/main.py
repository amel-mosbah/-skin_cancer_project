from fastapi import FastAPI, File, UploadFile
import torch
import torch.nn as nn
from torchvision.models import inception_v3
from torchvision import transforms
from PIL import Image
import io

app = FastAPI()

# ==============================
# Load Model
# ==============================
MODEL_PATH = "best_inception_v3.pth"

model = inception_v3(weights=None, aux_logits=False)
model.fc = nn.Linear(model.fc.in_features, 7)
#model.AuxLogits.fc = nn.Linear(model.AuxLogits.fc.in_features, 7)

state = torch.load(MODEL_PATH, map_location="cpu")
model.load_state_dict(state, strict=False)
model.eval()

# ==============================
# Transform
# ==============================
transform = transforms.Compose([
    transforms.Resize((299, 299)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

class_mapping = ["bkl", "nv", "df", "mel", "vasc", "bcc", "akiec"]

# ==============================
# PREDICT ROUTE
# ==============================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
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
