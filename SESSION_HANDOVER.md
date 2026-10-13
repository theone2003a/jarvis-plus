# J.A.R.V.I.S Plus — Session Handover & Context Memory

> **Purpose**: This document stores full operational, architectural, and development context so that any future session can immediately resume work without re-discovering configurations, decisions, or troubleshooting fixes.
> **Date Updated**: 2026-10-13

---

## 1. Project Identity & Repositories

- **Project Name**: **J.A.R.V.I.S Plus** (Mark VII Core / Autonomous Voice Assistant & Multilingual Holographic HUD)
- **Local Directory**: `/Users/mac/sites/jarvis_ai`
- **GitHub Repository**: [https://github.com/theone2003a/jarvis-plus](https://github.com/theone2003a/jarvis-plus)
- **GitHub Pages Showcase Website**: [https://theone2003a.github.io/jarvis-plus/](https://theone2003a.github.io/jarvis-plus/)
- **Git Remotes**:
  - `origin`: `https://github.com/eadmin2/jarvis_ai`
  - `upstream`: `https://github.com/theone2003a/jarvis-plus.git`
- **GitHub Authentication**: Uses User's Personal Access Token (PAT) configured in git remote credentials.

---

## 2. Secrets & Configuration Architecture

- **Real API Keys Location**: Real keys are strictly in **`~/.hermes/.env`** on the local Mac (never inside the repository).
- **Git Security**:
  - `.gitignore` strictly ignores `.env`, `*.env`, `server/config/server.yaml`, `server/certs/`, and `server/logs/`.
  - Only `.env.example` with dummy placeholders is tracked in git.
- **Key Environment Variables**:
  - `JARVIS_HUD_TOKEN`: Security access token for the HUD (passed in URL as `?token=...`).
  - `GROQ_API_KEY`: Groq Cloud Whisper Large-V3 STT (~350ms latency).
  - `GEMINI_API_KEY`: Google Gemini Flash for brain and multimodal TTS.
  - `API_SERVER_ENABLED=true` / `API_SERVER_KEY`: Connects to local Nous Hermes Agent on port `8642`.
  - `ELEVENLABS_API_KEY` / `SONIOX_API_KEY`: Optional paid providers for hyper-realistic human voice streaming.
  - `OLLAMA_BASE_URL`: Local offline model fallback (`http://localhost:11434/v1`).

---

## 3. Core Architecture & Runtime Ports

- **Port `8766` (HTTPS / WSS)**:
  - Enforced TLS using generated certs (`server/certs/cert.pem`).
  - Required by browsers (iOS Safari, Android Chrome, desktop Chrome) to grant microphone access over LAN.
  - Entry URL: `https://<HOST-IP>:8766/hud/?token=<TOKEN>&template=<tmpl>&lang=<lang>`
- **Port `8765` (Plain HTTP / WS)**:
  - Plain unencrypted mirror for testing, local scripts, and Chrome DevTools MCP automation.
- **Port `8642`**: Local Nous Hermes Agent API server.
- **Voice Pipeline Core** (`server/server.py`):
  - **Silero VAD**: Energy gating (~12ms CPU latency) with silence trimming.
  - **Full-Turn Barge-In**: Voice interruption halts agent tools, cancels audio streaming, and restarts turn.
  - **Thought Deduplication**: Intermediate reasoning status phrases spoken at most once per turn.
  - **Whisper Hallucination Shield**: Automatically cleans `[Music]`, `[Applause]`, and subtitle loops.
  - **Acoustic Feedback Guard**: Prevents assistant from self-triggering via laptop speakers.

---

## 4. UI & Multilingual Engine Defaults

- **Default UI Language**: English (`en`). Configured in `server/hud/i18n.js` with URL param fallback (`?lang=`) and `localStorage.getItem("jarvis_ui_lang")`.
- **Default STT Language**: Auto-Detect (`auto`). Whisper automatically classifies any spoken language (English, Persian, etc.). Configured in `server/hud/core.js`, `server/hud/i18n.js`, and `server/config/server.yaml`.
- **9 Supported UI Languages**: `en` (English), `fa` (Persian), `ar` (Arabic), `es` (Spanish), `fr` (French), `de` (German), `zh` (Chinese), `ru` (Russian), `ja` (Japanese).
- **Bidi RTL Support**: Document mirrors with `dir="rtl"` and Google's `Vazirmatn` font for Persian/Arabic, while technical hardware metrics remain strictly `dir="ltr"` and `font-mono`.

---

## 5. Holographic HUD Templates (5 Themes)

Switchable live with 1 click without page reloading:
1. **Aetheria** (`?template=aetheria`): Default holographic female AI with orbital rings, floating dock, and System Inspector. Heading: `AETHERIA // JARVIS PLUS`.
2. **IronCore** (`?template=ironcore`): Tony Stark Arc Reactor Mark VII with mechanical rings and tactical HUD. Heading: `J.A.R.V.I.S PLUS // MARK VII CORE`.
3. **Zenith** (`?template=zenith`): Apple Siri / Apple Intelligence fluid iridescent color-morphing orb.
4. **Omni** (`?template=omni`): ChatGPT Advanced Voice Mode style minimalist organic deformable audio blob.
5. **Astra** (`?template=astra`): Google Gemini Live style cosmic multi-bar frequency spectrum.
6. **Mobile View**: `100dvh` responsive view with auto-scaling centerpiece and collision-free multi-line transcript drawer on iPhone and Android.

---

## 6. Complete Documentation Library

Located in `docs/`:
- `docs/README.md`: Master documentation hub index.
- `docs/FEATURES.md`: Full product and feature encyclopedia.
- `docs/HUD_TEMPLATES.md`: Guide to the 5 holographic themes + mobile view.
- `docs/MODELS_AND_PROVIDERS.md`: Setup for Free, Air-Gapped, and Paid models.
- `docs/MULTILINGUAL_I18N.md`: 9 UI languages, RTL layout rules, and dynamic 14-language Whisper STT.
- `docs/ARCHITECTURE.md`: WebSocket protocol frames, Silero VAD state machine, and Sessions API.
- `docs/SETUP.md`: 60-second automated wizard and turnkey Docker Compose.
- `docs/TROUBLESHOOTING.md`: Resolving microphone permissions, acoustic echo, and latency.
- `docs/screenshots/`: High-resolution screenshots of all 5 HUDs (`aetheria_desktop.png`, `ironcore_desktop.png`, `zenith_desktop.png`, `omni_desktop.png`, `astra_desktop.png`, `mobile_aetheria.png`).
- `AGENTS.md` (root): Machine-readable open specification for AI coding agents.
- `docs/index.html`: Interactive GitHub Pages showcase website with live simulator and FAQ.

---

## 7. How to Resume Work in Future Sessions

1. **Check Server Status**:
   ```bash
   lsof -i :8766 -i :8765
   ```
2. **Start Server Locally**:
   ```bash
   cd server && source .venv/bin/activate && python server.py
   ```
3. **Push Updates to GitHub**:
   ```bash
   git push upstream main
   ```
4. **Access the HUD**:
   - `http://127.0.0.1:8765/hud/?token=<TOKEN>&template=aetheria&lang=en` (Plain HTTP)
   - `https://localhost:8766/hud/?token=<TOKEN>&template=aetheria&lang=en` (HTTPS with Mic Access)
