/**
 * ASTRA TEMPLATE — Neural Waveform Live Assistant (Gemini Live Style)
 */
(function(window) {
  "use strict";

  const AstraTemplate = {
    id: "astra",
    name: "Astra (Gemini Style)",
    animId: null,

    mount(container) {
      container.innerHTML = `
        <div id="astra-root">
          <!-- Top Bar -->
          <header class="as-topbar">
            <div class="as-brand">
              <span class="as-sparkle">✦</span>
              <span>ASTRA LIVE</span>
            </div>
            <div id="template-switcher-slot"></div>
          </header>

          <!-- Main Stage -->
          <main class="as-stage">
            <div class="as-waveform-box" id="as-waveform-box" title="Tap to talk (Space)">
              <canvas class="as-canvas" id="as-canvas"></canvas>
            </div>

            <div class="as-state-pill" id="as-state-pill">Listening live...</div>

            <div class="as-subtitle" id="as-subtitle">برای صحبت روی امواج صوتی بزنید یا کلید Space را فشار دهید</div>
          </main>

          <!-- Floating Bottom Control Dock -->
          <footer class="as-dock-wrap">
            <div class="as-dock">
              <button class="as-btn active" id="as-vox-btn" title="Toggle Hands-Free (H)">
                ⚡ <span>Hands-Free</span>
              </button>

              <button class="as-mic-btn" id="as-mic-btn" title="Voice / Push-to-Talk (Space)">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </button>

              <button class="as-btn danger" id="as-stop-btn" style="display:none" title="Interrupt Turn">
                ■ <span>Stop</span>
              </button>

              <button class="as-btn" id="as-chat-btn" title="Open Conversation">
                💬 <span>Transcript</span>
              </button>
            </div>
          </footer>

          <!-- Full Screen Chat Sheet -->
          <div class="as-chat-sheet" id="as-chat-sheet">
            <div class="as-sheet-head">
              <span style="font-weight:600">Conversation History</span>
              <button class="as-btn" id="as-sheet-close">✕ Close</button>
            </div>
            <div class="as-sheet-list" id="as-sheet-list"></div>
            <div class="as-sheet-input-row">
              <input class="as-sheet-inp" id="as-sheet-inp" placeholder="Ask Astra..." autocomplete="off">
              <button class="as-btn" id="as-sheet-send" style="background:#4285f4; color:#fff; font-weight:600; padding:0 18px">Send</button>
            </div>
          </div>
        </div>
      `;

      this.initCanvas();
      this.initEvents();
    },

    unmount() {
      if (this.animId) cancelAnimationFrame(this.animId);
    },

    /* ---------------- Fluid Neural Waveform Visualizer ---------------- */
    initCanvas() {
      const cv = document.getElementById("as-canvas");
      if (!cv) return;
      const ctx = cv.getContext("2d");

      const size = () => {
        const r = cv.parentElement.getBoundingClientRect();
        cv.width = r.width * window.devicePixelRatio;
        cv.height = r.height * window.devicePixelRatio;
      };
      size();
      window.addEventListener("resize", size);

      let phase = 0;
      const render = (t) => {
        const st = window.JarvisCore ? window.JarvisCore.state : "standby";
        const level = window.JarvisCore ? window.JarvisCore.level : 0;
        phase += 0.05 + (st === "thinking" ? 0.08 : 0);

        const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2;
        ctx.clearRect(0, 0, W, H);

        // Multi-bar Gemini Live neural waveform
        const numBars = 5;
        const barWidth = 14 * window.devicePixelRatio;
        const spacing = 10 * window.devicePixelRatio;
        const totalWidth = numBars * barWidth + (numBars - 1) * spacing;
        const startX = cx - totalWidth / 2;

        for (let i = 0; i < numBars; i++) {
          const x = startX + i * (barWidth + spacing);
          const offset = i * 0.7;
          
          let h = 24 * window.devicePixelRatio;
          if (st === "listening") {
            const dynamic = Math.sin(phase * 1.8 + offset) * 0.5 + 0.5;
            h = (28 + dynamic * 80 + level * 140) * window.devicePixelRatio;
          } else if (st === "speaking") {
            const dynamic = Math.sin(phase * 2.2 + offset) * 0.5 + 0.5;
            h = (32 + dynamic * 95) * window.devicePixelRatio;
          } else if (st === "thinking") {
            const dynamic = Math.sin(phase * 3 + offset) * 0.5 + 0.5;
            h = (20 + dynamic * 50) * window.devicePixelRatio;
          } else {
            const dynamic = Math.sin(phase + offset) * 0.5 + 0.5;
            h = (18 + dynamic * 22) * window.devicePixelRatio;
          }

          // Shimmering Google gradient
          const grad = ctx.createLinearGradient(x, cy - h / 2, x, cy + h / 2);
          if (i === 0) {
            grad.addColorStop(0, "#4285f4"); grad.addColorStop(1, "#34a853");
          } else if (i === 1) {
            grad.addColorStop(0, "#9b51e0"); grad.addColorStop(1, "#4285f4");
          } else if (i === 2) {
            grad.addColorStop(0, "#00e5ff"); grad.addColorStop(1, "#a855f7");
          } else if (i === 3) {
            grad.addColorStop(0, "#ea4335"); grad.addColorStop(1, "#fbbc05");
          } else {
            grad.addColorStop(0, "#4285f4"); grad.addColorStop(1, "#00e5ff");
          }

          ctx.fillStyle = grad;
          ctx.shadowColor = (i % 2 === 0) ? "#4285f4" : "#a855f7";
          ctx.shadowBlur = (st === "listening" || st === "speaking") ? 20 * window.devicePixelRatio : 8 * window.devicePixelRatio;

          // Draw rounded pill bar
          const radius = barWidth / 2;
          ctx.beginPath();
          ctx.roundRect(x, cy - h / 2, barWidth, h, radius);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        AstraTemplate.animId = requestAnimationFrame(render);
      };

      this.animId = requestAnimationFrame(render);
    },

    initEvents() {
      const core = window.JarvisCore;
      if (!core) return;

      const micBtn = document.getElementById("as-mic-btn");
      const box = document.getElementById("as-waveform-box");
      const voxBtn = document.getElementById("as-vox-btn");
      const stopBtn = document.getElementById("as-stop-btn");
      const chatBtn = document.getElementById("as-chat-btn");
      const sheet = document.getElementById("as-chat-sheet");
      const sheetClose = document.getElementById("as-sheet-close");
      const sheetInp = document.getElementById("as-sheet-inp");
      const sheetSend = document.getElementById("as-sheet-send");
      const sheetList = document.getElementById("as-sheet-list");

      micBtn.onclick = () => core.toggleTalk();
      box.onclick = () => core.toggleTalk();
      voxBtn.onclick = () => core.toggleHandsFree();
      stopBtn.onclick = () => core.stopRun();

      chatBtn.onclick = () => sheet.classList.add("open");
      sheetClose.onclick = () => sheet.classList.remove("open");

      const send = () => {
        const val = sheetInp.value.trim();
        if (!val) return;
        sheetInp.value = "";
        core.sendChat(val);
      };
      sheetSend.onclick = send;
      sheetInp.onkeydown = e => { if (e.key === "Enter") send(); };

      core.on("state", e => {
        document.getElementById("as-state-pill").textContent = e.label;
      });

      core.on("capture_state", capturing => {
        micBtn.classList.toggle("active", capturing);
        stopBtn.style.display = capturing ? "flex" : "none";
      });

      core.on("handsfree", hf => {
        voxBtn.classList.toggle("active", hf);
        voxBtn.querySelector("span").textContent = hf ? "Hands-Free" : "Push-to-Talk";
      });

      core.on("partial", text => {
        if (text && text.trim()) {
          document.getElementById("as-subtitle").textContent = text;
        }
      });

      core.on("transcript", msg => {
        document.getElementById("as-subtitle").textContent = msg.text;
        const div = document.createElement("div");
        div.className = "as-msg " + (msg.isUser ? "you" : "jarvis");
        div.textContent = msg.text;
        sheetList.appendChild(div);
        sheetList.scrollTop = sheetList.scrollHeight;
      });
    }
  };

  window.AstraTemplate = AstraTemplate;
})(window);
