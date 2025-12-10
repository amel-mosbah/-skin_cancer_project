FROM python:3.10-slim

WORKDIR /app

COPY requirements_api.txt .

RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 && \
    pip install --default-timeout=300 --no-cache-dir -r requirements_api.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


