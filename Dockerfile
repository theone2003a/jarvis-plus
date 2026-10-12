# J.A.R.V.I.S Plus — Autonomous Voice Assistant & Multilingual HUD
FROM python:3.11-slim

# System dependencies: FFmpeg for dynamic audio resampling, curl for healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    git \
    openssl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency specifications
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Working directory inside server
WORKDIR /app/server

# Expose ports: 8765 (WS client), 8766 (HTTPS HUD), 443 (Alt HTTPS), 9443 (Dashboard Proxy)
EXPOSE 8765 8766 443 9443

# Start J.A.R.V.I.S Plus voice server
CMD ["python", "server.py"]
