# J.A.R.V.I.S Plus — System Architecture & Protocols

This document details the internal architecture, real-time audio pipeline, Silero VAD state machine, WebSocket frames, and session lifecycle of **J.A.R.V.I.S Plus**.

---

## 1. System Topology

```
┌────────────────────────────────────────────────────────┐
│             Browser / Mobile HUD Client                │
│  • 16 kHz Mono AudioWorklet Streamer (PCM s16le)       │
│  • 5 Modular Themes (Aetheria, IronCore, etc.)         │
│  • i18n & RTL layout engine                            │
└──────────────────────────┬─────────────────────────────┘
                           │ WebSocket (:8766 TLS / :8765 Plain)
┌──────────────────────────▼─────────────────────────────┐
│          J.A.R.V.I.S Plus FastAPI Voice Server         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 1. Silero VAD Energy Gate (~12ms CPU latency)    │  │
│  │ 2. Turn Detector & Barge-In Cancellation         │  │
│  │ 3. STT: Groq Whisper Large-V3 / Local Whisper    │  │
│  │ 4. Thought Deduplication & Hallucination Filter  │  │
│  │ 5. TTS: Edge-TTS / Gemini / ElevenLabs           │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────┬─────────────────────────────┘
                           │ SSE Stream (POST /api/sessions/{id}/chat/stream)
┌──────────────────────────▼─────────────────────────────┐
│                 Nous Hermes Agent (:8642)              │
│  • Persistent Long-Term Memory (Sessions API)          │
│  • Tool Execution: Bash Terminal, Web, Files, 80+ skills│
│  • Interactive Approvals & Diagnostics                 │
└────────────────────────────────────────────────────────┘
```

---

## 2. Voice Turn Flow & Lifecycle

1. **Audio Capture**:
   - The browser initializes an `AudioContext` at native 16 kHz mono to prevent resampling artifacts that degrade Whisper speech recognition.
   - Int16 PCM chunks are streamed over the WebSocket.

2. **Silero VAD Gating**:
   - Audio is buffered in real-time and evaluated against the Silero VAD neural network (`threshold: 0.45`).
   - Leading and trailing ambient silence is trimmed to minimize API payload size.

3. **Incremental Partials**:
   - Every 1.2 seconds of new speech, the server emits `partial_transcript` events to display real-time captions in the HUD.

4. **Speech-to-Text (STT)**:
   - On human pause (speech stop), the trimmed buffer is sent to Groq Whisper Large-v3 (or local Faster-Whisper).
   - Hallucination suppression strips out noise artifacts (`[Music]`, `[Applause]`).

5. **Agent Execution**:
   - The verified transcript is sent to Hermes Agent's Sessions API (`POST /api/sessions/{id}/chat/stream`).
   - Session IDs persist per conversation name (`logs/hermes_sessions.json`), maintaining long-term memory across reboots.

6. **Thought Deduplication & TTS Synthesis**:
   - Intermediate model reasoning steps are checked against historical turn thoughts.
   - Deduplicated text is stripped of markdown/think tags, redacted of secrets, and streamed sentence-by-sentence to TTS.
   - Raw 16 kHz mono PCM chunks stream back to the client while LLM generation continues.

---

## 3. WebSocket Protocol Specification

### Client → Server Frames

#### Turn Control:
```json
{
  "type": "start",
  "sample_rate": 16000,
  "format": "pcm_s16le",
  "channels": 1,
  "conversation": "jarvis-main",
  "language": "auto"
}
```
*Note: Sending `start` while the assistant is speaking immediately triggers **Full-Turn Barge-In**.*

#### Speech Stop:
```json
{"type": "stop"}
```

#### Halt Agent Run:
```json
{"type": "stop_run"}
```

#### Change STT Language:
```json
{"type": "set_language", "language": "fa"}
```

#### Interactive Tool Approval Decision:
```json
{
  "type": "approval_decision",
  "run_id": "run-xyz-123",
  "approval_id": "app-456",
  "decision": "allow"
}
```

---

### Server → Client Frames

```json
{"type": "status", "message": "Listening..."}
{"type": "partial_transcript", "text": "What is the..."}
{"type": "transcript", "text": "What is the current server status?"}
{"type": "agent_status", "state": "thinking", "tool": "terminal", "preview": "uptime"}
{"type": "run_started", "run_id": "run-xyz-123"}
{"type": "approval_request", "data": {...}, "run_id": "run-xyz-123"}
{"type": "done", "timing": {"stt_ms": 320, "llm_first_token_ms": 190, "total_ms": 1150}}
```
*Plus binary 16 kHz mono int16 PCM TTS audio frames.*

---

## 4. HTTP Endpoints

| Endpoint | Method | Purpose |
| :--- | :---: | :--- |
| `/hud/` | GET | Serves the Holographic HUD web application. |
| `/api/hermes/{path}` | GET/POST | Allowlist proxy to Hermes Agent backend (injects bearer token). |
| `/api/chat` | POST | Typed text chat turn on the shared voice session. |
| `/api/machines` | GET | Host telemetry (CPU, RAM, disk) + remote worker statuses. |
| `/health` | GET | Pipeline health check. |

---

## 5. Dual-Port Network Architecture

- **Port `8766` (HTTPS / WSS)**:
  - Enforced TLS using generated certs (`server/certs/cert.pem`).
  - Required by browsers (Safari, Chrome) to grant microphone access over LAN.
- **Port `8765` (Plain HTTP / WS)**:
  - Unencrypted local mirror for command-line scripts, Python push-to-talk clients, and automated testing tools.
