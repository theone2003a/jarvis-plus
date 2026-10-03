/**
 * OMNI TEMPLATE — Minimalist Voice Mode (ChatGPT Advanced Voice Style)
 */
(function(window) {
  "use strict";

  const OmniTemplate = {
    id: "omni",
    name: "Omni (ChatGPT Style)",
    animId: null,

    mount(container) {
      container.innerHTML = `
        <div id="omni-root">
          <!-- Top Bar -->
          <header class="om-topbar">
            <div class="om-brand">
              <span class="om-brand-dot"></span>
              <span>OMNI VOICE</span>
            </div>
            <div id="template-switcher-slot"></div>
          </header>

          <!-- Main Stage -->
          <main class="om-stage">
            <div class="om-orb-box" id="om-orb-box" title="Tap to talk (Space)">
              <canvas class="om-canvas" id="om-canvas"></canvas>
            </div>

            <div class="om-state-pill" id="om-state-pill">Listening</div>

            <div class="om-subtitle" id="om-subtitle">برای صحبت کلیک کنید یا کلید Space را فشار دهید</div>
          </main>

          <!-- Floating Bottom Control Dock -->
          <footer class="om-dock-wrap">
            <div class="om-dock">
              <button class="om-btn active" id="om-vox-btn" title="Toggle Hands-Free (H)">
                ⚡ <span>Hands-Free</span>
              </button>

              <button class="om-mic-btn" id="om-mic-btn" title="Voice / Push-to-Talk (Space)">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </button>

              <button class="om-btn danger" id="om-stop-btn" style="display:none" title="Interrupt Turn">
                ■ <span>Stop</span>
              </button>

              <button class="om-btn" id="om-chat-btn" title="Open Conversation">
                💬 <span>Transcript</span>
              </button>
            </div>
          </footer>

          <!-- Full Screen Chat Sheet -->
          <div class="om-chat-sheet" id="om-chat-sheet">
            <div class="om-sheet-head">
              <span style="font-weight:600">Conversation</span>
              <button class="om-btn" id="om-sheet-close">✕ Close</button>
            </div>
            <div class="om-sheet-list" id="om-sheet-list"></div>
            <div class="om-sheet-input-row">
              <input class="om-sheet-inp" id="om-sheet-inp" placeholder="Message Jarvis..." autocomplete="off">
              <button class="om-btn" id="om-sheet-send" style="background:#fff; color:#000; font-weight:600; padding:0 18px">Send</button>
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

    /* ---------------- Fluid Sound Circle Visualizer ---------------- */
    initCanvas() {
      const cv = document.getElementById("om-canvas");
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
        phase += 0.04 + (st === "thinking" ? 0.08 : 0);

        const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2;
        const R = Math.min(W, H) * 0.35;
        ctx.clearRect(0, 0, W, H);

        // Deformable sound blob with organic harmonics
        const points = 64;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const a = (i / points) * Math.PI * 2;
          let distortion = 0;

          if (st === "listening") {
            distortion = Math.sin(a * 4 + phase) * (level * 36) + Math.cos(a * 6 - phase) * (level * 18);
          } else if (st === "speaking") {
            distortion = Math.sin(a * 3 + phase * 1.5) * 14 + Math.cos(a * 5 - phase) * 8;
          } else if (st === "thinking") {
            distortion = Math.sin(a * 2 + phase * 2) * 8;
          } else {
            distortion = Math.sin(a * 2 + phase * 0.5) * 3;
          }

          const r = R + distortion;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        // Aesthetic fill & glow
        ctx.shadowColor = (st === "listening") ? "#3b82f6" : ((st === "speaking") ? "#ffffff" : "rgba(255,255,255,0.4)");
        ctx.shadowBlur = (st === "listening" || st === "speaking") ? 30 * window.devicePixelRatio : 12 * window.devicePixelRatio;
        ctx.fillStyle = (st === "listening") ? "#3b82f6" : "#ffffff";
        ctx.fill();
        ctx.shadowBlur = 0;

        OmniTemplate.animId = requestAnimationFrame(render);
      };

      this.animId = requestAnimationFrame(render);
    },

    initEvents() {
      const core = window.JarvisCore;
      if (!core) return;

      const micBtn = document.getElementById("om-mic-btn");
      const orb = document.getElementById("om-orb-box");
      const voxBtn = document.getElementById("om-vox-btn");
      const stopBtn = document.getElementById("om-stop-btn");
      const chatBtn = document.getElementById("om-chat-btn");
      const sheet = document.getElementById("om-chat-sheet");
      const sheetClose = document.getElementById("om-sheet-close");
      const sheetInp = document.getElementById("om-sheet-inp");
      const sheetSend = document.getElementById("om-sheet-send");
      const sheetList = document.getElementById("om-sheet-list");

      micBtn.onclick = () => core.toggleTalk();
      orb.onclick = () => core.toggleTalk();
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
        document.getElementById("om-state-pill").textContent = e.label.toLowerCase();
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
          document.getElementById("om-subtitle").textContent = text;
        }
      });

      core.on("transcript", msg => {
        document.getElementById("om-subtitle").textContent = msg.text;
        const div = document.createElement("div");
        div.className = "om-msg " + (msg.isUser ? "you" : "jarvis");
        div.textContent = msg.text;
        sheetList.appendChild(div);
        sheetList.scrollTop = sheetList.scrollHeight;
      });
    }
  };

  window.OmniTemplate = OmniTemplate;
})(window);
