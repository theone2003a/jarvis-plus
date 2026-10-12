# J.A.R.V.I.S Plus — Models & Providers Matrix (Free vs. Paid)

J.A.R.V.I.S Plus is engineered with a modular provider architecture. You can run the entire stack **100% free with zero mandatory subscriptions**, run **air-gapped offline on your own GPU/CPU**, or connect **paid enterprise APIs** for studio-grade human emotional voices and ultra-low latency.

---

## Architecture Pipeline Overview

```
Audio Input (Mic) ──► [ STT Layer ] ──► [ Brain / LLM Layer ] ──► [ TTS Layer ] ──► Audio Output
```

---

## 1. Speech-to-Text (STT) Layer

| Provider | Tier / Pricing | Latency | Multilingual Accuracy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Groq Whisper Large-V3** *(Default)* | **Free Tier** (~$0.11/hr after quota) | ~350ms | Exceptional (Persian, English + 14 langs) | Recommended out-of-the-box. Fast LPUs, reliable auto-detection. |
| **Faster-Whisper (Local CPU/GPU)** | **100% Free** ($0.00 self-hosted) | ~400ms (GPU) / ~1.2s (CPU) | High (Depends on model size: `base` to `large-v3`) | Completely private. No audio leaves your machine. |
| **Soniox Real-Time (`stt-rt-v5`)** | **Paid Cloud** (Pay-per-second) | ~180ms | Ultra-high (Code-switching optimized) | Real-time streaming tokens with word-level confidence. |

### Configuration:
In `.env`:
```bash
# Option A: Groq Cloud (Free tier)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Option B: Soniox Real-Time (Paid)
SONIOX_API_KEY=your_soniox_key_here
```

---

## 2. Brain / LLM Layer (Autonomous Reasoning)

| Provider | Model | Tier | Strengths |
| :--- | :--- | :--- | :--- |
| **Google Gemini Flash** *(Default)* | `gemini-2.5-flash` / `gemini-3.8-flash` | **Generous Free Tier** | 1M+ token context, high-speed tool reasoning, zero local GPU needed. |
| **Nous Hermes Agent** | Local API / OpenRouter | **Free / Self-Hosted** | Persistent memory, terminal bash tools, file editing, 80+ skills. |
| **Ollama / vLLM (Local)** | Llama 3.3 (70B), Qwen 2.5 (32B) | **100% Free / Air-Gapped** | Runs locally on Apple Silicon (M1/M2/M3) or NVIDIA RTX. Total privacy. |
| **OpenRouter / Anthropic** | Claude 3.5 Sonnet, DeepSeek V3 | **Pay-per-token** | Frontier coding reasoning and deep research. |

### Configuration:
In `.env`:
```bash
# Option A: Google Gemini API (Free tier)
GEMINI_API_KEY=your_gemini_api_key_here

# Option B: Hermes Agent Backend
API_SERVER_ENABLED=true
API_SERVER_KEY=your_hermes_key_here

# Option C: Local Ollama Air-Gapped
OLLAMA_BASE_URL=http://localhost:11434/v1
```

---

## 3. Text-to-Speech (TTS) Layer

| Provider | Voice Models | Pricing | Expressiveness | Language Support |
| :--- | :--- | :--- | :--- | :--- |
| **Microsoft Edge-TTS** *(Default)* | `FaridNeural`, `DilaraNeural`, `GuyNeural`, `JennyNeural` | **100% Free** (No API Key Required) | Natural, clear, fluent | 40+ languages with authentic native Persian and Arabic accents |
| **Google Gemini Flash Lite TTS** | `Kore`, `Puck`, `Fenrir`, `Aoede` | **Free Tier** (Included with Gemini Key) | Warm, dynamic narrator cadence | Multilingual WAV/PCM streaming |
| **ElevenLabs Flash v2.5** | Custom Voice Clones, Adam, Rachel, Antoni | **Paid Cloud** (~$0.15 / 10k chars) | Hollywood-grade human emotional realism | Multilingual emotional speech |
| **Soniox Low-Latency TTS** | Studio Neural Models | **Paid Cloud** (Pay-per-second) | Instant streaming, conversational | Real-time code-switching |

### Configuration:
In `.env`:
```bash
# Default: Microsoft Edge-TTS requires ZERO API keys! It works immediately.

# For ElevenLabs (Paid Studio Voices):
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# For Soniox TTS:
SONIOX_API_KEY=your_soniox_api_key_here
```

---

## Recommended Deployment Profiles

### 🚀 Profile 1: "Zero-Cost Cloud" (Recommended Default)
- **STT**: Groq Whisper Large-V3 (Free tier)
- **Brain**: Google Gemini Flash (Free tier)
- **TTS**: Microsoft Edge-TTS (100% Free, zero keys)
- **Cost**: **$0.00 / month**
- **Hardware needed**: Any low-power PC, Raspberry Pi 4/5, or Mac Mini.

### 🛡️ Profile 2: "100% Offline Air-Gapped"
- **STT**: Local Faster-Whisper on CPU/GPU
- **Brain**: Local Ollama (Qwen 2.5 14B or Llama 3.3 70B)
- **TTS**: Microsoft Edge-TTS or Local Piper/Kokoro
- **Cost**: **$0.00**
- **Hardware needed**: Modern Mac with Apple Silicon (16GB+ RAM) or PC with NVIDIA GPU (8GB+ VRAM).

### 🎬 Profile 3: "Cinematic Studio Production"
- **STT**: Soniox Real-Time (~180ms latency)
- **Brain**: Claude 3.5 Sonnet / Hermes Agent
- **TTS**: ElevenLabs Flash v2.5 streaming
- **Cost**: ~$5 - $20 / month based on usage
- **Experience**: Hollywood-style Iron Man voice assistant with instant conversational barge-in.
