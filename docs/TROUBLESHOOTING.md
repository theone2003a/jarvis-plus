# J.A.R.V.I.S Plus — Troubleshooting & FAQ

This guide resolves common setup issues, browser audio permission quirks, network configurations, and model performance problems.

---

## 1. Browser & Microphone Issues

### HUD loads, but microphone is blocked / grayed out
- **Root Cause**: Modern browsers (iOS Safari, Android Chrome, desktop Chrome) strictly enforce **Secure Contexts (`getUserMedia`)**. They will refuse to grant microphone permissions on unencrypted `http://` over a local network.
- **Solution**:
  1. Make sure you are using **`https://`** on port **`8766`** (e.g. `https://192.168.1.100:8766/hud/?token=...`).
  2. On first visit, click **Advanced → Proceed** to accept the self-signed certificate.
  3. On iOS Safari, tap the `aA` icon in the address bar → **Website Settings** → Set **Microphone** to **Allow**.

### Audio echo / Jarvis speaks to itself in a loop
- **Root Cause**: Laptop speakers playing into an open built-in microphone without acoustic echo cancellation.
- **Solution**:
  1. In the HUD, open the **System Inspector** and increase the **VAD Threshold** slider (e.g. from `0.45` to `0.55`).
  2. Wear headphones or reduce speaker volume slightly.
  3. Ensure `audible_fillers: false` in `server.yaml` if room reflections are extreme.

---

## 2. Model & Pipeline Latency

### Speech-to-Text (STT) feels slow (~2-3 seconds)
- **Root Cause**: You are running local Whisper on CPU instead of Groq Cloud LPU.
- **Solution**:
  1. Add a free Groq API key in `.env`: `GROQ_API_KEY=gsk_...`
  2. In `server/config/server.yaml`, ensure `stt.provider: groq`.
  3. Groq Whisper Large-V3 drops latency to **~300-350ms**.

### Whisper generates `[Music]` or strange repeated phrases
- **Root Cause**: Ambient room silence triggering Whisper hallucinations.
- **Solution**:
  - J.A.R.V.I.S Plus includes an automatic hallucination scrubber. If custom audio artifacts persist, ensure `vad.trim_silence: true` in `server.yaml`.

---

## 3. Autonomous Agent & Tool Issues

### "Agent backend offline. Running in basic mode."
- **Root Cause**: The voice pipeline cannot reach the local Nous Hermes Agent API.
- **Solution**:
  1. Verify Hermes gateway is running: `hermes gateway`.
  2. Test health endpoint directly:
     ```bash
     curl -H "Authorization: Bearer $API_SERVER_KEY" http://127.0.0.1:8642/health
     ```
  3. If Hermes is not installed, J.A.R.V.I.S Plus automatically falls back to direct LLM mode using Google Gemini Flash or Anthropic.

### 401 Unauthorized / Access Code Loop
- **Root Cause**: The URL token does not match `JARVIS_HUD_TOKEN`.
- **Solution**:
  1. Check your token in `.env`: `grep JARVIS_HUD_TOKEN .env`
  2. Clear browser cookies or localStorage for localhost.
  3. Access with the exact query parameter: `?token=<YOUR-TOKEN>`.

---

## 4. Port & Network Binding

### Port 8766 / 8765 "Address already in use"
- **Solution**:
  Find and kill the zombie process:
  ```bash
  lsof -i :8766 -i :8765
  kill -9 <PID>
  ```

### Cannot access HUD from mobile phone on the same Wi-Fi
- **Checklist**:
  1. Ensure both devices are on the exact same Wi-Fi subnet (disable cellular data temporarily).
  2. Check host firewall (on macOS: System Settings → Network → Firewall → Allow incoming connections to Python).
  3. Confirm server binds to `0.0.0.0` (all interfaces), not `127.0.0.1`.
