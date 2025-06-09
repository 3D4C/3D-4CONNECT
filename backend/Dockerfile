FROM python:3.10-slim

WORKDIR /app
COPY requirements_docker.txt .

RUN python -m venv venv && \
    venv/bin/pip install --no-cache-dir -r requirements_docker.txt

COPY . .
ENV PATH="/app/venv/bin:$PATH"

EXPOSE 8080

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
