# J.A.R.V.I.S Plus — Installation & Deployment Guide

This guide walks you through setting up **J.A.R.V.I.S Plus** on your local machine, server, or Docker cluster.

---

## Prerequisites
- **Operating System**: macOS (Apple Silicon or Intel), Linux (Ubuntu 20.04+, Debian, Arch), or Windows with WSL2.
- **Python**: Version 3.10, 3.11, or 3.12 (Python 3.11 recommended).
- **Docker**: Optional (recommended for turnkey containerized launch).
- **Microphone**: Any built-in or USB microphone.

---

## Option 1: Turnkey Docker Compose (Recommended)

Docker Compose bundles all Python dependencies, FastAPI services, and TLS certificate tooling into a single container.

### Step 1: Clone Repository
```bash
git clone https://github.com/theone2003a/jarvis-plus.git
cd jarvis-plus
```

### Step 2: Run Setup Wizard
```bash
./setup.sh
```
*The wizard automatically:*
1. Generates local self-signed TLS certificates in `server/certs/` for microphone permissions.
2. Creates your `.env` configuration file with a secure random access token.
3. Initializes `server/config/server.yaml`.

### Step 3: Configure API Keys
Edit `.env` with your preferred free or paid keys:
```bash
# Optional but recommended for fastest STT:
GROQ_API_KEY=gsk_your_groq_api_key_here

# Optional Google Gemini for free Brain:
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: Microsoft Edge-TTS works automatically with zero API keys!)*

### Step 4: Launch Container
```bash
docker compose up -d
```

---

## Option 2: Native Python 3.11 Setup

If you prefer running directly on your host operating system (recommended for direct hardware access on macOS M-series chips):

### Step 1: Run Setup Wizard
```bash
git clone https://github.com/theone2003a/jarvis-plus.git
cd jarvis-plus
./setup.sh
```

### Step 2: Install Virtual Environment & Dependencies
```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r ../requirements.txt
```

### Step 3: Launch Voice Server
```bash
python server.py
```

---

## Connecting to Hermes Agent (The Autonomous Brain)

To unlock autonomous tools (terminal execution, web research, file editing, 80+ skills):

1. Install Nous Hermes Agent:
   Follow the [official Hermes Agent installation guide](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart).
2. Enable the API server in your Hermes configuration (`~/.hermes/.env`):
   ```bash
   API_SERVER_ENABLED=true
   API_SERVER_KEY=your_long_random_secret_token
   ```
3. Start the gateway:
   ```bash
   hermes gateway
   ```
4. Update `jarvis-plus/.env`:
   ```bash
   API_SERVER_ENABLED=true
   API_SERVER_KEY=your_long_random_secret_token
   ```

---

## Accessing the Holographic HUD

Once running, the server prints your local and LAN URLs:

* **Local Machine**:  
  👉 **`https://localhost:8766/hud/?token=<YOUR-TOKEN>`**
* **Phone / LAN Tablet**:  
  👉 **`https://<YOUR-LAN-IP>:8766/hud/?token=<YOUR-TOKEN>`**

> ⚠️ **First-Time Browser Note**: Because the TLS certificate is self-signed, modern browsers will display a security alert. Click **Advanced → Proceed to localhost** to allow microphone access.
