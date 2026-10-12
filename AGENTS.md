# AGENTS.md — J.A.R.V.I.S Plus Machine Instructions

> **Audience**: Autonomous AI agents, code assistants (Claude Code, Cursor, Windsurf, OpenHands, Aider, GitHub Copilot).  
> **Repository**: [theone2003a/jarvis-plus](https://github.com/theone2003a/jarvis-plus)  
> **Project**: J.A.R.V.I.S Plus (Autonomous Multilingual Voice Assistant & Holographic HUD)

---

## 1. System Architecture & Topology

J.A.R.V.I.S Plus connects human voice input via browser/mobile WebSockets to a local autonomous agent backend (Nous Hermes Agent or direct LLMs):

```
┌───────────────────────────────────────┐
│ Browser / Mobile HUD (:8766 HTTPS/WSS)│
│ • 5 Switchable Templates (HUD)        │
│ • AudioWorklet PCM Streamer (16kHz)   │
│ • Bidirectional RTL/LTR i18n Engine   │
└──────────────────┬────────────────────┘
                   │ WSS (Encrypted LAN)
┌──────────────────▼─────────────────────────────────────────────────┐
│ J.A.R.V.I.S Plus Server (FastAPI + WebSocket Pipeline :8766/:8765) │
│ • Silero VAD (Neural speech start/stop gate)                       │
│ • STT: Groq Whisper Large-v3 / Soniox / Local Faster-Whisper       │
│ • Turn Engine: Echo Cancellation, Thought Deduplication, Barge-In  │
│ • TTS: Edge-TTS (Free) / Gemini Flash Lite / ElevenLabs / Soniox   │
└──────────────────┬─────────────────────────────────────────────────┘
                   │ REST + SSE (/api/sessions/{id}/chat/stream)
┌──────────────────▼─────────────────────────────────────────────────┐
│ Nous Hermes Agent (:8642)                                          │
│ • Long-term memory, file tools, terminal shell, 80+ skills         │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Layout & Critical Paths

- `server/server.py`: Primary FastAPI voice pipeline server, WebSocket dispatcher, VAD gating, and TTS streamer.
- `server/hud/`: Frontend web application served directly by `server.py` at `/hud/`.
  - `server/hud/index.html`: Entry point HUD shell.
  - `server/hud/i18n.js`: 9-language translation catalog and RTL layout manager.
  - `server/hud/templates/`: 5 modular HUD view engines (`aetheria`, `ironcore`, `zenith`, `omni`, `astra`).
- `server/config/`: Configuration files (`server.yaml`, `server.example.yaml`).
- `setup.sh`: 60-second automated wizard generating TLS certs and `.env`.
- `docker-compose.yml` & `Dockerfile`: Containerized orchestration.
- `docs/`: GitHub Pages showcase website (`docs/index.html`) and visual assets (`docs/screenshots/`).

---

## 3. Environment & Configuration Keys

Never hardcode credentials or secrets. The application reads from `.env` in the repository root:

| Key | Required | Default / Description |
| :--- | :--- | :--- |
| `JARVIS_HUD_TOKEN` | **Yes** | Security token guarding browser HUD (`?token=<token>`). |
| `GROQ_API_KEY` | Recommended | Groq Cloud STT (free tier Whisper Large-v3). |
| `GEMINI_API_KEY` | Recommended | Google Gemini Flash LLM & multimodal voice. |
| `API_SERVER_ENABLED` | Optional | Set `true` if connected to a local Nous Hermes Agent. |
| `API_SERVER_KEY` | Optional | API token for Hermes Agent backend. |
| `ELEVENLABS_API_KEY` | Optional | Studio-grade human emotional voice synthesis. |
| `SONIOX_API_KEY` | Optional | Ultra-low-latency streaming STT/TTS. |
| `OLLAMA_BASE_URL` | Optional | `http://localhost:11434/v1` for 100% offline self-hosting. |

---

## 4. Setup, Run & Verification Commands

### Automated Setup
```bash
./setup.sh
```

### Run Native Python Server
```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r ../requirements.txt
python server.py
```

### Run via Docker
```bash
docker compose up -d --build
```

### Verification & Healthcheck
```bash
# Verify Voice Server HTTP endpoint (bypassing TLS warning if self-signed)
curl -k -sI https://127.0.0.1:8766/hud/?token=$(grep JARVIS_HUD_TOKEN .env | cut -d '=' -f2)

# Verify Plain HTTP local mirror (port 8765)
curl -sI http://127.0.0.1:8765/hud/
```

---

## 5. Coding Conventions & Guardrails for AI Agents

1. **Acoustic & VAD Safety**:
   - In `server/server.py`, never remove speech gating or Silero VAD energy thresholds.
   - Maintain intermediate thought deduplication (`_is_thought_duplicate` / `suppress_repetitive_thoughts`). Do not allow raw multi-step reasoning thoughts to stream simultaneously to TTS.
2. **Frontend UI Integrity**:
   - Every UI text element must include a `data-i18n="<key>"` attribute or pass through `i18n.t()`.
   - Never force `dir="ltr"` globally across `<body>`. The application relies on `dir="rtl"` for Persian (`fa`) and Arabic (`ar`). Hardware gauges and telemetry numbers must keep class `font-mono` and `dir="ltr"`.
3. **Template Independence**:
   - Each HUD template in `server/hud/templates/<name>/` must implement `mount(container)` and `destroy()` lifecycle hooks.
   - Do not leak `requestAnimationFrame` IDs across template switches.
4. **Git & Commit Standards**:
   - Write clear conventional commits: `feat(...)`, `fix(...)`, `docs(...)`, `refactor(...)`.
   - Never commit `.env` or files inside `server/certs/`. Keep `.gitignore` intact.
