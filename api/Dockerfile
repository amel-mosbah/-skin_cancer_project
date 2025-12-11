FROM python:3.10

WORKDIR /app

COPY requirements_api.txt .

RUN pip install --no-cache-dir -r requirements_api.txt

# Copy the whole API folder
COPY . .

# Make sure the model is inside /app (important for Render)
COPY best_inception_v3.pth /app/best_inception_v3.pth

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# update for deploy


