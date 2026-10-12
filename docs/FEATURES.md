# J.A.R.V.I.S Plus — Product & Feature Encyclopedia

**J.A.R.V.I.S Plus** is a production-grade, self-hosted autonomous voice assistant and holographic command center built on Nous Research's [Hermes Agent](https://github.com/NousResearch/hermes-agent).

This document details every core architectural capability, usability enhancement, and acoustic engineering solution built into the platform.

---

## 1. Real-Time Conversational Voice Engine

### ⚡ Full-Turn Speech Barge-In & Cancellation
In typical voice assistants, when the bot speaks or executes an action, human speech is ignored or queued. In J.A.R.V.I.S Plus:
- **Instant Human Priority**: You can interrupt Jarvis at any millisecond.
- **Trigger Mechanisms**:
  - Voice utterance detected above energy threshold via **Silero VAD**.
  - Spoken wake-words: *"Stop"*, *"Hey Jarvis"*, *"Cancel"*, or in Persian *"جارویس"*, *"صبر کن"*, *"بسه"*.
  - Physical hotkey: Pressing the spacebar or clicking the central orb in the HUD.
- **Deep Cancellation Chain**: When barge-in fires:
  1. WebSocket immediately ceases binary audio streaming to client speakers.
  2. The server dispatches an interruption signal to the running agent turn (`stop_run`).
  3. The agent halts runaway background terminal shell commands or web scrapes.
  4. The assistant saves the partial spoken context and prefixes the new user turn with an interruption note.

### 🧠 Semantic Thought Deduplication
Large Language Models running autonomous tools often repeat intermediate internal thinking phrases (e.g. *"Checking the calendar..."*, *"Checking the calendar now..."*).
- **The Problem**: Streaming every thought chunk to speech synthesis produces robotic, repetitive vocal loops.
- **The Solution**: J.A.R.V.I.S Plus analyzes intermediate thought sentences semantically.
  - Intermediate thoughts are spoken aloud **at most once per tool turn**.
  - Identical or near-identical status sentences are suppressed from audio synthesis, keeping speech concise and natural while still displaying full logs in the HUD.

### 🛡️ Whisper Hallucination Shield
OpenAI Whisper models are notorious for hallucinating text during periods of ambient silence or quiet background noise (e.g. generating `[Music]`, `[Applause]`, `Thank you for watching`, `Subtitles by...`).
- **Energy-Gated Pre-Filter**: Silero VAD trims audio buffers before passing them to Groq Whisper.
- **Regex Hallucination Rejection**: Any output matching known silence artifacts or YouTube subtitle boilerplates is scrubbed automatically before reaching the LLM, eliminating ghost prompts.

### 🔇 Acoustic Feedback Loop & Self-Talk Suppression
When Jarvis speaks through laptop speakers without headphones:
- An intelligent silence gating algorithm tracks whether the server is currently synthesizing or transmitting TTS chunks.
- The microphone buffer dynamically raises the VAD threshold, preventing the assistant from hearing and conversing with its own voice.

---

## 2. Holographic HUD Experience

### 🎭 5 Switchable Visual Themes (1-Click Live Swapping)
Users can toggle between 5 distinct holographic interfaces on the fly without refreshing the page or dropping active voice sessions:
1. **Aetheria (Default / Female AI)**: Cortana/F.R.I.D.A.Y-inspired holographic female profile with reactive orbital rings, sound aura, floating subtitle card, and slide-over System Inspector.
2. **IronCore (Arc Reactor Mark VII)**: Tactical Iron Man power core with segmented rotating cyan rings, acoustic power spikes, and system telemetry array.
3. **Zenith (Apple Siri Morph)**: Fluid iridescent color-morphing orb that organically ripples and pulses with voice harmonics.
4. **Omni (ChatGPT Voice Blob)**: Minimalist organic audio blob with matte black backdrop and gentle pulsing amplitude.
5. **Astra (Gemini Live Waves)**: Cosmic starlight theme featuring multi-bar reactive frequency spectrums and aurora gradients.

### 📱 Mobile-First Responsive Design (100dvh)
Designed specifically for modern mobile browsers (iOS Safari and Android Chrome):
- Strict `100dvh` CSS viewport sizing prevents UI clipping beneath mobile navigation bars.
- Centerpiece orbs automatically scale down on small screens.
- Multi-line speech transcripts render inside a collision-free scrolling drawer that never obscures bottom controls.

### 🔍 Slide-Over System Inspector
Tapping the **System / Inspector** button opens an advanced diagnostic telemetry panel:
- **Audio Waveforms**: Live real-time oscilloscope of microphone input.
- **VAD Energy & Mic Sensitivity**: Adjustable threshold sliders to calibrate noisy rooms.
- **Hardware Telemetry**: Real-time CPU usage, RAM utilization, and active model latency.
- **Session Debugger**: Inspect active conversation keys, token usage, and tool approval logs.

---

## 3. Multilingual & RTL Bi-Directional Layout

### 🌐 9 Fully Localized UI Languages
The HUD interface, tooltips, status pills, and System Inspector are completely translated into:
- English (`en` - Default)
- Persian (`fa` - فارسی)
- Arabic (`ar` - العربية)
- Spanish (`es`)
- French (`fr`)
- German (`de`)
- Chinese (`zh` - 中文)
- Russian (`ru` - Русский)
- Japanese (`ja` - 日本語)

### 📐 Native RTL Document Mirroring
When Persian or Arabic is selected:
- The entire HUD layout automatically mirrors using native `dir="rtl"`.
- Typography switches dynamically to Google's **Vazirmatn** font for crisp Persian/Arabic glyphs.
- **Telemetry Isolation**: While human text aligns right-to-left, hardware gauges, latency figures, and memory stats remain strictly `dir="ltr"` and `font-mono` to prevent numeral transposition errors.

### 🎙️ Dynamic STT Language Switcher
Users can toggle the Whisper recognition language in real time directly from the HUD:
- **Auto-Detect (`auto` - Default)**: Whisper identifies whatever language you speak automatically.
- **Dedicated Language Modes**: Choose between 14 dedicated languages (English, Persian, Arabic, Spanish, French, German, Russian, Chinese, Japanese, and more) to eliminate code-switching ambiguity in noisy environments.

---

## 4. Autonomous Agent Brain & Tool Execution

### 🧠 Persistent Long-Term Memory
Built on top of Nous Hermes Agent Sessions API (`/api/sessions/{id}/chat/stream`):
- Conversations persist by session key across server restarts and machine reboots.
- Jarvis remembers past user instructions, preferences, project paths, and system setups.

### 🛠️ Full Toolset Execution
Jarvis is a real autonomous agent, not just a chatbot:
- **Terminal Shell**: Can run bash commands, build code, manage Docker containers, and query system diagnostics.
- **File System**: Can read, write, edit, and refactor files on the host system.
- **Web Research**: Can search the internet, read live documentation, and scrape web pages.
- **Interactive Approvals**: Dangerous actions (such as terminal deletion or overwriting files) trigger interactive approval cards directly in the holographic HUD for human authorization.
