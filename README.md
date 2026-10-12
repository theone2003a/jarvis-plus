# J.A.R.V.I.S Plus — Autonomous Voice Assistant & Multilingual Holographic HUD

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python&logoColor=white" alt="Python 3.11+">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker&logoColor=white" alt="Docker Ready">
  <img src="https://img.shields.io/badge/Languages-9%20(RTL%20%2B%20LTR)-06b6d4.svg" alt="9 Languages with RTL">
  <img src="https://img.shields.io/badge/HUD%20Themes-5%20Switchable-a855f7.svg" alt="5 Switchable HUD Themes">
  <a href="https://theone2003s.github.io/jarvis-plus/"><img src="https://img.shields.io/badge/Website-Interactive%20Showcase-ec4899.svg" alt="Showcase Website"></a>
</p>

A self-hosted, Iron-Man-style autonomous voice assistant and command center built on top of [Hermes Agent](https://github.com/NousResearch/hermes-agent) (Nous Research's open-source autonomous agent). 

Talk to a **real autonomous agent** — one with persistent long-term memory, shell terminal execution, web search, file tools, and 80+ skills — through a futuristic glowing holographic HUD in any browser on your LAN, or a mobile client.

🌐 **Interactive Project Website & Showcase**: **[https://theone2003s.github.io/jarvis-plus/](https://theone2003s.github.io/jarvis-plus/)**

---

## 🎬 Live Demo & Video Preview

[![Watch the J.A.R.V.I.S demo](https://img.youtube.com/vi/YNI9pm3h6x8/hqdefault.jpg)](https://youtu.be/YNI9pm3h6x8)

▶ **[Watch the Demo on YouTube](https://youtu.be/YNI9pm3h6x8)** — live transcription, autonomous agent tool calling, holographic media panels, and real-time streaming speech.

---

## 🌟 Key Features

* **5 Switchable HUD Holographic Interfaces** (1-Click switch without reloading):
  * **Aetheria** *(Default)*: Modern holographic female AI assistant with reactive orbital sound rings, floating dock, and slide-over System Inspector.
  * **IronCore**: Tactical sci-fi Iron Man Arc Reactor with rotating segmented mechanical power rings and telemetry array.
  * **Zenith**: Apple Intelligence / Siri inspired fluid iridescent morphing color orb.
  * **Omni**: ChatGPT Advanced Voice Mode style with organic deformable audio blob.
  * **Astra**: Google Gemini Live style with shimmering multi-bar neural waveforms and cosmic starlight gradients.
* **Full-Turn Execution Barge-In**: Talk over Jarvis at any moment. Say *"Stop"*, *"Hey Jarvis"*, *"جارویس"*, or tap the spacebar to immediately halt runaway agent tools and redirect conversation.
* **Semantic Thought Deduplication**: Automatically suppresses repetitive internal LLM reasoning sentences during multi-step tool calls. Intermediate statuses are spoken at most once per turn.
* **9-Language Internationalization (i18n) & Native RTL Layout**: Full UI controls and System Inspector translation for English, Persian (فارسی), Arabic (العربية), Spanish, French, German, Chinese, Russian, and Japanese.
* **Dynamic Whisper STT Language Selector**: On-the-fly voice recognition language switching (14 supported languages with auto-detect).
* **Whisper Hallucination Suppression**: Automatic cleaning of silence artifacts (`[Music]`, `[Applause]`, subtitles).
* **Mobile-First Responsive Layout**: `100dvh` viewport, dynamic centerpiece scaling, and collision-free multi-line transcript scrolling on iPhone and Android screens.
* **Acoustic Feedback Loop Cancellation**: Intelligent silence gating prevents Jarvis from hearing its own voice through laptop speakers.

---

## 📊 Supported Models Matrix (Free vs. Paid)

J.A.R.V.I.S Plus is engineered to be **100% accessible out of the box with zero mandatory subscriptions**, while letting users plug in paid providers for studio-grade human realism.

| Pipeline Layer | Free / Self-Hosted Option | Cloud / Managed Option | Professional / Paid Option |
| :--- | :--- | :--- | :--- |
| **Speech-to-Text (STT)** | **Faster-Whisper (Local CPU/GPU)**<br>• $0.00, runs offline<br>• Zero telemetry | **Groq Whisper Large-V3 (Default)**<br>• Generous free tier<br>• ~350ms ultra-fast latency | **Soniox Real-Time (`stt-rt-v5`)**<br>• Pay-per-second<br>• ~180ms latency with code-switching |
| **Brain (Agent / LLM)** | **Ollama / Local vLLM**<br>• Llama 3.3, Qwen 2.5<br>• 100% private | **Google Gemini Flash (Default)**<br>• Free tier at Google AI Studio<br>• 1M context, high tool reasoning | **Nous Hermes Agent / OpenRouter**<br>• Claude 3.5 Sonnet, DeepSeek V3<br>• Frontier coding & system bash |
| **Text-to-Speech (TTS)** | **Microsoft Edge-TTS (Default)**<br>• 100% Free, zero keys required<br>• Native Persian (`FaridNeural`/`DilaraNeural`) & 40+ langs | **Gemini Flash Lite TTS**<br>• Free tier included with Gemini API<br>• Expressive narrator voice (`Kore`) | **ElevenLabs & Soniox RT**<br>• Paid subscription / credits<br>• Cinematic emotional human voice |

> 🎙️ **Need Hyper-Realistic Cinematic Speech?**  
> While J.A.R.V.I.S Plus runs out-of-the-box on 100% free Edge-TTS, users seeking Hollywood-grade human voices can easily supply their `ELEVENLABS_API_KEY` or `SONIOX_API_KEY` in `.env` to unlock real-time streaming emotional synthesis.

---

## 🚀 60-Second Quickstart

### Option 1: Turnkey Docker Compose (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/theone2003s/jarvis-plus.git
cd jarvis-plus

# 2. Run automated setup wizard (generates TLS certs & .env)
./setup.sh

# 3. Launch container
docker compose up -d
```

### Option 2: Native Python 3.11 Setup

```bash
# 1. Clone and enter directory
git clone https://github.com/theone2003s/jarvis-plus.git
cd jarvis-plus

# 2. Run setup wizard
./setup.sh

# 3. Launch server
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r ../requirements.txt
python server.py
```

### 📱 Open in Browser
Open the printed HTTPS URL on your desktop or phone browser:
👉 **`https://<YOUR-IP>:8766/hud/?token=<YOUR-TOKEN>`**

*(Note: On first visit, accept the self-signed certificate in your browser to grant microphone access).*

---

## 🏗️ Architecture

```
 Browser HUD (Mobile / Desktop on LAN)      Host Machine (macOS / Linux / Docker)
 ── https/wss :8766 ──────────────────┐   ┌──────────────────────────────────────────────┐
   mic · speaker · 5 templates        ├──►│ J.A.R.V.I.S Plus Voice Server (FastAPI)      │
                                      │   │  • VAD Gate: Silero VAD neural filter        │   ┌────────────────────┐
 Push-to-Talk Desktop Client          │   │  • STT: Groq Whisper Large-v3 / Soniox / CPU │──►│ Hermes Agent       │
 ── ws :8765 ─────────────────────────┘   │  • Echo Cancellation & Thought Deduplication │   │  API :8642 (lo)    │
                                          │  • TTS: Edge-TTS / Gemini / ElevenLabs       │   │  tools · skills    │
                                          │  • TLS Reverse Proxy & i18n Engine           │   │  memory persistence│
                                          └──────────────────────────────────────────────┘   └────────────────────┘
```

---

## 🔒 Security Model

* **Token Gated**: Browser HUD and WebSocket channels are guarded by `JARVIS_HUD_TOKEN`.
* **Zero Cloud Lock-In**: Can run completely air-gapped on local Ollama + Faster-Whisper + Edge-TTS.
* **LAN Only**: Binds to private network interfaces for personal home/office assistance.
* **API Secret Protection**: API keys never reach the browser; all requests are authenticated server-side.

---

## 📜 Credits & License

* Built on **[Hermes Agent](https://github.com/NousResearch/hermes-agent)** by Nous Research.
* Released under the **[MIT License](LICENSE)**. Open source and free for the world to use, modify, and build upon.
