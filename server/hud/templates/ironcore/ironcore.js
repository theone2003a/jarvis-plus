/**
 * IRONCORE TEMPLATE — Tactical Sci-Fi Iron Man Arc Reactor Cockpit HUD
 */
(function(window) {
  "use strict";

  const IronCoreTemplate = {
    id: "ironcore",
    name: "IronCore (Tactical HUD)",
    animId: null,

    mount(container) {
      container.innerHTML = `
        <div id="ironcore-root">
          <!-- Top Bar -->
          <header class="ic-topbar">
            <div class="ic-brand">J.A.R.V.I.S // MARK VII CORE</div>
            <div class="ic-topbar-right">
              <div class="ic-clock" id="ic-clock">--:--:--</div>
              <div id="template-switcher-slot"></div>
            </div>
          </header>

          <!-- Main Grid -->
          <div class="ic-grid">
            <!-- Left Col -->
            <div class="ic-col">
              <div class="ic-panel">
                <h3><span>VOICE LINK</span><span>01</span></h3>
                <div class="ic-kv"><span>Server</span><b id="ic-ws-state">ONLINE</b></div>
                <div class="ic-kv"><span>Mic</span><b id="ic-mic-state">READY</b></div>
                <div style="margin-top:8px; display:flex; gap:6px">
                  <button class="ic-btn" id="ic-talk-btn" style="flex:1">ENGAGE VOICE</button>
                  <button class="ic-btn" id="ic-stop-btn" style="display:none; color:var(--ic-red)">STOP</button>
                </div>
                <div style="margin-top:6px">
                  <button class="ic-btn active" id="ic-vox-btn" style="width:100%">⚡ HANDS-FREE: ON</button>
                </div>
              </div>

              <div class="ic-panel">
                <h3><span>AGENT ACTIVITY</span><span>02</span></h3>
                <div id="ic-activity-list" style="font-size:12px; color:var(--ic-txt-dim); max-height:140px; overflow-y:auto">
                  <div>— All systems nominal —</div>
                </div>
              </div>

              <div class="ic-panel">
                <h3><span>TELEMETRY</span><span>03</span></h3>
                <div class="ic-kv"><span>Turns</span><b id="ic-turns">0</b></div>
                <div class="ic-kv"><span>Tokens</span><b id="ic-tokens">—</b></div>
                <div class="ic-kv"><span>Latency</span><b id="ic-latency">—</b></div>
              </div>
            </div>

            <!-- Center Col -->
            <div class="ic-center">
              <div class="ic-reactor-box" id="ic-reactor-box" title="Click reactor or press Space to talk">
                <canvas class="ic-canvas" id="ic-canvas"></canvas>
                <div class="ic-state-badge">
                  <div class="ic-st" id="ic-state-label">STANDBY</div>
                </div>
              </div>

              <div class="ic-feed" id="ic-feed"></div>

              <div class="ic-cmd-row">
                <input class="ic-input" id="ic-chat-input" placeholder="Enter tactical directive... (Space to talk)" autocomplete="off">
                <button class="ic-btn" id="ic-send-btn">TRANSMIT</button>
              </div>
            </div>

            <!-- Right Col -->
            <div class="ic-col">
              <div class="ic-panel">
                <h3><span>LOADOUT</span><span>04</span></h3>
                <div class="ic-kv"><span>STT</span><b>Groq Whisper Large V3</b></div>
                <div class="ic-kv"><span>TTS</span><b>Gemini Flash Lite (Kore)</b></div>
                <div class="ic-kv"><span>Brain</span><b>Hermes 9Router Agent</b></div>
                <div class="ic-kv"><span>Format</span><b>PCM 16k</b></div>
              </div>

              <div class="ic-panel">
                <h3><span>VIEWS</span><span>05</span></h3>
                <button class="ic-btn" style="width:100%; margin-bottom:6px" onclick="window.open('/kanban','_blank')">▸ KANBAN</button>
                <button class="ic-btn" style="width:100%; margin-bottom:6px" onclick="window.open('/','_blank')">▸ HERMES CORE</button>
                <button class="ic-btn" style="width:100%" onclick="window.open('/chat','_blank')">▸ CHAT</button>
              </div>
            </div>
          </div>
        </div>
      `;

      this.initCanvas();
      this.initEvents();
      this.initClock();
    },

    unmount() {
      if (this.animId) cancelAnimationFrame(this.animId);
    },

    initCanvas() {
      const cv = document.getElementById("ic-canvas");
      if (!cv) return;
      const ctx = cv.getContext("2d");

      const size = () => {
        const r = cv.parentElement.getBoundingClientRect();
        cv.width = r.width * window.devicePixelRatio;
        cv.height = r.height * window.devicePixelRatio;
      };
      size();
      window.addEventListener("resize", size);

      let rot = 0;
      const render = (t) => {
        const st = window.JarvisCore ? window.JarvisCore.state : "standby";
        const level = window.JarvisCore ? window.JarvisCore.level : 0;
        const color = st === "listening" ? "#19f0d8" : (st === "thinking" ? "#ffb300" : (st === "speaking" ? "#00e5ff" : "#00e5ff"));
        rot += (st === "thinking" ? 2.5 : 0.8);

        const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2;
        const base = Math.min(W, H) * 0.38;
        ctx.clearRect(0, 0, W, H);

        ctx.shadowColor = color;
        ctx.shadowBlur = 15 * window.devicePixelRatio;

        // Outer arc segments
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3 * window.devicePixelRatio;
        ctx.setLineDash([30, 15]);
        ctx.lineDashOffset = rot * 2;
        ctx.arc(cx, cy, base * (1 + level * 0.15), 0, Math.PI * 2);
        ctx.stroke();

        // Inner reverse ring
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * window.devicePixelRatio;
        ctx.setLineDash([10, 20]);
        ctx.lineDashOffset = -rot * 3;
        ctx.arc(cx, cy, base * 0.75, 0, Math.PI * 2);
        ctx.stroke();

        // Core Triangle / Circle
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.25 + level * 0.5;
        ctx.arc(cx, cy, base * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Center bright point
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.arc(cx, cy, 4 * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();

        IronCoreTemplate.animId = requestAnimationFrame(render);
      };
      this.animId = requestAnimationFrame(render);
    },

    initEvents() {
      const core = window.JarvisCore;
      if (!core) return;

      const talkBtn = document.getElementById("ic-talk-btn");
      const stopBtn = document.getElementById("ic-stop-btn");
      const voxBtn = document.getElementById("ic-vox-btn");
      const reactor = document.getElementById("ic-reactor-box");
      const chatInp = document.getElementById("ic-chat-input");
      const sendBtn = document.getElementById("ic-send-btn");
      const feed = document.getElementById("ic-feed");

      talkBtn.onclick = () => core.toggleTalk();
      reactor.onclick = () => core.toggleTalk();
      voxBtn.onclick = () => core.toggleHandsFree();
      stopBtn.onclick = () => core.stopRun();

      const send = () => {
        const val = chatInp.value.trim();
        if (!val) return;
        chatInp.value = "";
        core.sendChat(val);
      };
      sendBtn.onclick = send;
      chatInp.onkeydown = e => { if (e.key === "Enter") send(); };

      core.on("state", e => {
        document.getElementById("ic-state-label").textContent = e.label;
      });

      core.on("capture_state", capturing => {
        talkBtn.textContent = capturing ? "■ STOP & SEND" : "ENGAGE VOICE";
        stopBtn.style.display = capturing ? "block" : "none";
      });

      core.on("handsfree", hf => {
        voxBtn.classList.toggle("active", hf);
        voxBtn.textContent = hf ? "⚡ HANDS-FREE: ON" : "⚡ HANDS-FREE: OFF";
      });

      core.on("transcript", msg => {
        const div = document.createElement("div");
        div.className = "ic-msg " + (msg.isUser ? "you" : "jarvis");
        div.textContent = msg.text;
        feed.appendChild(div);
        feed.scrollTop = feed.scrollHeight;
      });

      core.on("metrics_turn", m => {
        document.getElementById("ic-turns").textContent = m.turns;
        if (m.timing?.end_of_speech_to_first_audio_seconds) {
          document.getElementById("ic-latency").textContent = m.timing.end_of_speech_to_first_audio_seconds + "s";
        }
      });
    },

    initClock() {
      setInterval(() => {
        const el = document.getElementById("ic-clock");
        if (el) el.textContent = new Date().toTimeString().slice(0, 8);
      }, 500);
    }
  };

  window.IronCoreTemplate = IronCoreTemplate;
})(window);
