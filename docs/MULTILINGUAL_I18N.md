# J.A.R.V.I.S Plus — Multilingual & RTL Localization Engine

J.A.R.V.I.S Plus is engineered for global accessibility, featuring full native support for **Right-to-Left (RTL)** scripts (Persian and Arabic) alongside major world Left-to-Right (LTR) languages.

---

## 1. Supported UI Languages

The HUD interface, tooltips, System Inspector telemetry, and notifications support **9 localized languages**:

| Code | Language | Native Name | Direction | Font Family |
| :---: | :--- | :--- | :---: | :--- |
| `en` | **English** *(Default)* | English | LTR | `Space Grotesk`, `Plus Jakarta Sans` |
| `fa` | **Persian** | فارسی | **RTL** | `Vazirmatn`, sans-serif |
| `ar` | **Arabic** | العربية | **RTL** | `Vazirmatn`, sans-serif |
| `es` | **Spanish** | Español | LTR | `Plus Jakarta Sans` |
| `fr` | **French** | Français | LTR | `Plus Jakarta Sans` |
| `de` | **German** | Deutsch | LTR | `Plus Jakarta Sans` |
| `zh` | **Chinese** | 简体中文 | LTR | `Plus Jakarta Sans` |
| `ru` | **Russian** | Русский | LTR | `Plus Jakarta Sans` |
| `ja` | **Japanese** | 日本語 | LTR | `Plus Jakarta Sans` |

---

## 2. Right-to-Left (RTL) Layout Architecture

Supporting bidirectional scripts in high-tech dashboards is notoriously challenging because mirror layouts often accidentally flip numbers, graphs, and hardware telemetry.

J.A.R.V.I.S Plus solves this with **Isolated Directional Formatting**:

### Document-Level Mirroring:
When switching to Persian (`fa`) or Arabic (`ar`):
```javascript
document.documentElement.lang = "fa";
document.documentElement.dir = "rtl";
```
- Navigation bars, drop-down menus, subtitle bubbles, and drawer panels naturally mirror to the right edge.
- Font rendering applies Persian-optimized letter ligatures via Google Fonts' **Vazirmatn**.

### Isolated Telemetry & Monospace LTR:
- Hardware gauges (CPU %, RAM MB, Latency ms), IP addresses, and command-line code blocks are enclosed in containers with explicit `dir="ltr"` and `font-family: 'Space Mono', monospace`.
- This ensures technical figures like `192.168.1.50` or `54.2%` are never reversed or mangled.

---

## 3. Dynamic Whisper STT Language Selector

In addition to the visual UI language, J.A.R.V.I.S Plus allows you to dynamically switch the speech-to-text recognition language on the fly via the `[ 🎙️ STT: <LANG> ▾ ]` header dropdown:

- **Auto-Detect (`auto` - Default)**: Whisper automatically classifies the language of whatever you say.
- **Dedicated Recognition**:
  - `en`: English
  - `fa`: Persian (فارسی)
  - `ar`: Arabic (العربية)
  - `es`: Spanish (Español)
  - `fr`: French (Français)
  - `de`: German (Deutsch)
  - `zh`: Chinese (中文)
  - `ru`: Russian (Русский)
  - `ja`: Japanese (日本語)
  - `it`: Italian (Italiano)
  - `tr`: Turkish (Türkçe)
  - `hi`: Hindi (हिन्दी)
  - `pt`: Portuguese (Português)

### Client-to-Server Protocol:
When a user changes STT language in the dropdown:
1. The HUD sends an immediate WebSocket control frame:
   ```json
   {"type": "set_language", "language": "fa"}
   ```
2. The server binds `conn.language = "fa"` to the active connection state.
3. Every speech turn audio buffer sent to Groq Whisper Large-V3 or Soniox includes `"language": "fa"`.
4. Preference is saved in `localStorage.getItem("jarvis_stt_lang")`.

---

## 4. How to Add a New UI Language

Translations live in [`server/hud/i18n.js`](../server/hud/i18n.js).

To add a new language (e.g. Italian `it`):
1. Open `server/hud/i18n.js`.
2. Add a new translation dictionary under `TRANSLATIONS.it`:
   ```javascript
   it: {
     name: "Italiano",
     dir: "ltr",
     standby: "IN ATTESA",
     listening: "In ascolto...",
     processing: "Elaborazione...",
     speaking: "Parlando...",
     subtitle_default: "Fai clic sul microfono o premi Spazio per parlare",
     system_title: "ISPETTORE DI SISTEMA",
     // ...
   }
   ```
3. Add the language option to the selector list in `i18n.js`.
