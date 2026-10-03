/**
 * ZENITH TEMPLATE — Minimalist Siri / Gemini Live Neural Voice Assistant
 */
(function(window) {
  "use strict";

  const ZenithTemplate = {
    id: "zenith",
    name: "Zenith (Minimal Orb)",
    animId: null,

    mount(container) {
      container.innerHTML = `
        <div id="zenith-root">
          <!-- Top Bar -->
          <header class="zn-topbar">
            <div class="zn-brand">
              <span class="zn-dot"></span>
              <span>ZENITH AI</span>
            </div>
            <div id="template-switcher-slot"></div>
          </header>

          <!-- Main Stage -->
          <main class="zn-stage">
            <div class="zn-orb-wrap" id="zn-orb-wrap" title="Tap to talk">
              <canvas class="zn-canvas" id="zn-canvas"></canvas>
            </div>

            <div class="zn-status-pill" id="zn-status-pill" data-i18n="standby">STANDBY</div>

            <div class="zn-subtitle" id="zn-subtitle" data-i18n="subtitle_default">Click the mic or press Space to speak</div>
          </main>

          <!-- Floating Bottom Pill Dock -->
          <footer class="zn-dock-wrap">
            <div class="zn-dock">
              <button class="zn-btn active" id="zn-vox-btn">
                <span>⚡ Hands-Free</span>
              </button>

              <button class="zn-mic-btn" id="zn-mic-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </button>

              <button class="zn-btn" id="zn-chat-btn">
                💬 <span data-i18n="chat">Chat</span>
              </button>
            </div>
          </footer>

          <!-- Full Screen Chat Sheet -->
          <div class="zn-chat-sheet" id="zn-chat-sheet">
            <div class="zn-sheet-head">
              <span style="font-weight:600" data-i18n="transcript">Conversation History</span>
              <button class="zn-btn" id="zn-sheet-close">✕ Close</button>
            </div>
            <div class="zn-sheet-list" id="zn-sheet-list"></div>
            <div class="zn-sheet-input-row">
              <input class="zn-sheet-inp" id="zn-sheet-inp" data-i18n-ph="input_placeholder" placeholder="Type a message... (Space to talk)" autocomplete="off">
              <button class="zn-btn" id="zn-sheet-send" data-i18n="send" style="background:#3b82f6; color:#fff; padding:0 20px">Send</button>
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

    /* ---------------- Fluid Iridescent Neural Orb ---------------- */
    initCanvas() {
      const cv = document.getElementById("zn-canvas");
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
        phase += 0.03 + (st === "thinking" ? 0.05 : 0);

        const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2;
        const R = Math.min(W, H) * 0.36 * (1 + level * 0.25);
        ctx.clearRect(0, 0, W, H);

        // Fluid morphing blobs
        const numBlobs = 4;
        for (let i = 0; i < numBlobs; i++) {
          const angle = phase + (i * Math.PI * 2 / numBlobs);
          const ox = cx + Math.cos(angle * 0.8) * (R * 0.2);
          const oy = cy + Math.sin(angle * 0.6) * (R * 0.2);

          const grad = ctx.createRadialGradient(ox, oy, 0, cx, cy, R);
          if (st === "listening") {
            grad.addColorStop(0, "rgba(6, 182, 212, 0.85)");
            grad.addColorStop(0.5, "rgba(59, 130, 246, 0.5)");
            grad.addColorStop(1, "transparent");
          } else if (st === "speaking") {
            grad.addColorStop(0, "rgba(236, 72, 153, 0.85)");
            grad.addColorStop(0.5, "rgba(168, 85, 247, 0.5)");
            grad.addColorStop(1, "transparent");
          } else if (st === "thinking") {
            grad.addColorStop(0, "rgba(245, 158, 11, 0.85)");
            grad.addColorStop(0.5, "rgba(236, 72, 153, 0.5)");
            grad.addColorStop(1, "transparent");
          } else {
            grad.addColorStop(0, "rgba(99, 102, 241, 0.7)");
            grad.addColorStop(0.5, "rgba(236, 72, 153, 0.35)");
            grad.addColorStop(1, "transparent");
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(ox, oy, R * (0.8 + Math.sin(phase + i) * 0.15), 0, Math.PI * 2);
          ctx.fill();
        }

        // Inner glowing core
        ctx.beginPath();
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.5);
        coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        coreGrad.addColorStop(1, "transparent");
        ctx.fillStyle = coreGrad;
        ctx.arc(cx, cy, R * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ZenithTemplate.animId = requestAnimationFrame(render);
      };

      this.animId = requestAnimationFrame(render);
    },

    initEvents() {
      const core = window.JarvisCore;
      if (!core) return;

      const micBtn = document.getElementById("zn-mic-btn");
      const orb = document.getElementById("zn-orb-wrap");
      const voxBtn = document.getElementById("zn-vox-btn");
      const chatBtn = document.getElementById("zn-chat-btn");
      const sheet = document.getElementById("zn-chat-sheet");
      const sheetClose = document.getElementById("zn-sheet-close");
      const sheetInp = document.getElementById("zn-sheet-inp");
      const sheetSend = document.getElementById("zn-sheet-send");
      const sheetList = document.getElementById("zn-sheet-list");

      micBtn.onclick = () => core.toggleTalk();
      orb.onclick = () => core.toggleTalk();
      voxBtn.onclick = () => core.toggleHandsFree();

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
        document.getElementById("zn-status-pill").textContent = e.label;
      });

      core.on("capture_state", capturing => {
        micBtn.classList.toggle("active", capturing);
      });

      core.on("handsfree", hf => {
        voxBtn.classList.toggle("active", hf);
        const t = (k, fb) => (window.I18n ? window.I18n.t(k) : fb);
        voxBtn.querySelector("span").textContent = hf ? t("hands_free_on", "⚡ Hands-Free: ON") : t("hands_free_off", "⚡ Hands-Free: OFF");
      });

      core.on("i18n_change", () => {
        const t = (k, fb) => (window.I18n ? window.I18n.t(k) : fb);
        voxBtn.querySelector("span").textContent = core.handsFree ? t("hands_free_on", "⚡ Hands-Free: ON") : t("hands_free_off", "⚡ Hands-Free: OFF");
        chatBtn.querySelector("span").textContent = t("chat", "Chat");
        sheetInp.placeholder = t("input_placeholder", "Type a message... (Space to talk)");
        sheetSend.textContent = t("send", "Send");
        if (core.state === "standby") {
          document.getElementById("zn-subtitle").textContent = t("subtitle_default", "Click the mic or press Space to speak");
        }
      });

      core.on("partial", text => {
        if (text && text.trim()) {
          document.getElementById("zn-subtitle").textContent = text;
        }
      });

      core.on("transcript", msg => {
        document.getElementById("zn-subtitle").textContent = msg.text;
        const div = document.createElement("div");
        div.className = "zn-msg " + (msg.isUser ? "you" : "jarvis");
        div.textContent = msg.text;
        sheetList.appendChild(div);
        sheetList.scrollTop = sheetList.scrollHeight;
      });
    }
  };

  window.ZenithTemplate = ZenithTemplate;
})(window);
