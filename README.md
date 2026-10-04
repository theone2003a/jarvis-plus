# J.A.R.V.I.S — Voice + HUD for Hermes Agent

A self-hosted, Iron-Man-style voice assistant and command center built on top of
[Hermes Agent](https://github.com/NousResearch/hermes-agent) (NousResearch's
open-source autonomous agent). Talk to a *real* agent — one with persistent
memory, terminal access, web search, file tools, and 80+ skills — through a
glowing arc-reactor HUD in any browser on your LAN, or a push-to-talk client.

**Everything runs on your own hardware.** The only cloud calls are your LLM
provider (via Hermes) and ElevenLabs for the voice. Speech-to-text is fully
local (Whisper on CPU).

## Demo

[![Watch the J.A.R.V.I.S demo](https://img.youtube.com/vi/YNI9pm3h6x8/hqdefault.jpg)](https://youtu.be/YNI9pm3h6x8)

▶ **[Watch the demo on YouTube](https://youtu.be/YNI9pm3h6x8)** — live transcription, agent tool calls, holographic media panels, and the cinematic boot, all in real time.

## What it does


Click the ring and speak. Your words transcribe **live on screen** while you
talk. The transcript goes to Hermes Agent, which actually *does things* — reads
and writes files, runs commands, searches the web, remembers you across
sessions — and the reply streams back as speech, sentence by sentence, while
the rest is still being generated. Typical round trip: 3–5 seconds.

The HUD around the ring is a real control center:

- **5 Switchable HUD Templates** — switch with 1 click from the interface:
  - **Aetheria** *(Default)*: Modern holographic female AI assistant with reactive orbital rings, floating dock, and slide-over System Inspector.
  - **IronCore**: Tactical sci-fi Iron Man Arc Reactor with rotating mechanical power rings and telemetry array.
  - **Zenith**: Siri / Apple Intelligence inspired fluid iridescent morphing color orb.
  - **Omni**: ChatGPT Advanced Voice Mode style with organic deformable white/blue audio blob.
  - **Astra**: Google Gemini Live style with shimmering multi-bar neural waveforms and Google starlight gradients.
- **Hands-Free Mode** — wake words `"Hey Jarvis"` and `"جارویس"` with continuous follow-up conversation and 2.0s silence auto-send.
- **9-Language Internationalization (i18n)** — full interface & System Inspector localization across English, Persian (فارسی), Spanish, French, German, Arabic (العربية), Chinese (中文), Russian, and Japanese with automatic RTL/LTR document layout.
- **Dynamic Whisper STT Language Mode** — on-the-fly voice recognition language switching (14 supported languages with auto-detect).
- **Persian & Multilingual TTS Stack** — Google Gemini Flash Lite TTS (`Kore`) with fail-fast fallback to Microsoft Edge-TTS (`fa-IR-FaridNeural`) and Soniox RT streaming.
- **Live agent activity** — watch tool calls happen with command previews
- **STOP button & Full Barge-In** — halt agent turns mid-execution (speech barge-in, wake-word interrupt, stop phrases, or Space/click)
- **Approval cards** — dangerous commands pause for your ALLOW/DENY
- **Embedded dashboards** — Hermes' kanban board, session browser, and chat interface in animated viewers
- **Holographic media panels** — fly-in panels from Z-depth with scanline sweeps
- **Mobile-First Responsive Overhaul** — `100dvh` layout, compact top bar, dynamic reactor scaling, collision-free multi-line transcript scrolling, and non-clipping thumb dock for 360px–430px viewports.

## Architecture

```
 Browser HUD (any LAN device)          Host machine (tested on macOS / Apple Silicon)
 ── https/wss :443 ──────────┐   ┌──────────────────────────────────────┐
   mic · speaker · panels    ├──►│ voice pipeline server (this repo)    │
                             │   │  STT: faster-whisper (local, free)   │   ┌─────────────────┐
 Push-to-talk client         │   │  TTS: ElevenLabs Flash (streaming)   ├──►│ Hermes Agent     │
 ── ws :8765 ────────────────┘   │  HUD + auth + dashboard TLS proxy    │   │  API :8642 (lo)  │
                                 └──────────────────────────────────────┘   │  memory · tools  │
                                                                             │  skills · cron   │
                                                                             └─────────────────┘
```

One brain, many faces: voice and typed chat share a single persistent Hermes
session, so each knows what you said to the other — and memory survives every
restart.

## Requirements

- A machine for the server (tested: Mac mini, Apple Silicon). Linux should
  work with minor changes (launchd → systemd).
- [Hermes Agent](https://hermes-agent.nousresearch.com/docs/) installed and
  configured with an LLM provider
- Python 3.11+
- An [ElevenLabs](https://elevenlabs.io) API key (free tier works; ~0.5
  credits/char on Flash)
- Any modern browser on the LAN

## Install

Full walkthrough in [docs/SETUP.md](docs/SETUP.md). Short version:

```bash
# 1. Enable the Hermes Agent API server
cat >> ~/.hermes/.env <<EOF
API_SERVER_ENABLED=true
API_SERVER_KEY=$(python3 -c 'import secrets;print(secrets.token_urlsafe(32))')
JARVIS_HUD_TOKEN=$(python3 -c 'import secrets;print("jarvis-"+secrets.token_hex(3))')
ELEVENLABS_API_KEY=your-key-here
EOF
hermes gateway   # or set up its LaunchAgent / service

# 2. This repo
git clone https://github.com/YOURNAME/jarvis-hermes-hud
cd jarvis-hermes-hud/server
python3 -m venv .venv
.venv/bin/pip install fastapi uvicorn requests pyyaml numpy anthropic \
    RealtimeSTT faster-whisper silero-vad websockets psutil
cp config/server.example.yaml config/server.yaml   # edit: your ElevenLabs voice_id etc.
scripts/make-certs.sh                              # self-signed TLS (browser mic needs it)
scripts/make-boot-audio.sh YourName                # one-time boot greeting synthesis

# 3. Run
.venv/bin/python server.py
# open https://YOUR_HOST/hud/ → accept cert → enter your JARVIS_HUD_TOKEN → talk
```

For auto-start on boot, see [launchd/](launchd/) (macOS) — the plists document
two non-obvious macOS traps (external-drive TCC and log paths) that cost us an
evening.

## Usage

| Action | How |
|---|---|
| Talk | Click the ring (or Space) · speak · click again to send |
| Stop the agent | red ■ STOP button or Esc |
| Barge in | click the ring while it's speaking |
| Typed chat | input bar at the bottom (same conversation as voice) |
| Cinematic boot | press `B` |
| Kanban / dashboards | VIEWS panel → animated pop-up viewers |
| Phone | open the HUD → Add to Home Screen |

## Repo layout

```
server/          FastAPI voice pipeline + HUD host (the core of this project)
server/hud/      single-file HUD (vanilla JS, no build step)
server/scripts/  start/stop/health/smoke + cert & boot-audio generators
client/          optional Windows/Linux push-to-talk Python client (wake word capable)
worker/          optional GPU sidecars: big-model STT server + stats agent for the Machines panel
hermes-plugin/   Hermes tool plugin: lets the agent summon/dismiss HUD media panels
launchd/         macOS auto-start templates with hard-won TCC + FD-limit notes
docs/            SETUP, ARCHITECTURE (protocols/endpoints), TROUBLESHOOTING
```

## Security model

- The Hermes API key never reaches the browser: the HUD talks through a
  strict allowlist proxy on the voice server.
- All HUD endpoints + dashboard proxy + browser WebSockets are gated by a
  token (cookie, entered once per device).
- Hermes' API binds to loopback only; the dashboard binds to loopback only.
- Secret-shaped strings are redacted before text leaves for cloud TTS.
- LAN-only by design — do not port-forward this to the internet.

## Credits & license

Built on [Hermes Agent](https://github.com/NousResearch/hermes-agent) by Nous
Research. HUD aesthetics inspired by
[jarvis-dashboard](https://github.com/AndrewKochulab/jarvis-dashboard).
STT by [faster-whisper](https://github.com/SYSTRAN/faster-whisper) /
[RealtimeSTT](https://github.com/KoljaB/RealtimeSTT). Voice by
[ElevenLabs](https://elevenlabs.io).

MIT — see [LICENSE](LICENSE). Use it, fork it, build your own Jarvis.
