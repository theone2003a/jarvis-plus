/**
 * AETHERIA TEMPLATE — Modern Holographic Female AI Assistant HUD
 */
(function(window) {
  "use strict";

  const AetheriaTemplate = {
    id: "aetheria",
    name: "Aetheria (Female AI)",
    animId: null,
    drawerTab: "telemetry",

    mount(container) {
      container.innerHTML = `
        <div id="aetheria-root">
          <!-- Top Bar -->
          <header class="ae-topbar">
            <div class="ae-brand">
              <span class="ae-logo-dot"></span>
              <span>AETHERIA // JARVIS</span>
            </div>
            <div class="ae-status-pill">
              <span class="ae-pulse-dot"></span>
              <span id="ae-conn-badge">LIVE : 8766</span>
            </div>
            <div class="ae-topbar-actions">
              <div class="ae-top-clock" id="ae-clock">--:--:--</div>
              <div id="template-switcher-slot"></div>
              <button class="ae-btn-icon" id="ae-inspector-btn" title="System Telemetry & Tools">
                📊 <span data-i18n="inspector">INSPECTOR</span>
              </button>
            </div>
          </header>

          <!-- Main Stage -->
          <main class="ae-stage">
            <!-- Centerpiece Reactor -->
            <div class="ae-reactor-box" id="ae-reactor-box" title="Click to talk (Space)">
              <div class="ae-avatar-aura" id="ae-avatar-aura"></div>
              <img class="ae-avatar-img" id="ae-avatar-img" src="avatar_female.png" alt="Aetheria AI">
              <canvas class="ae-canvas" id="ae-canvas"></canvas>
            </div>

            <!-- Dynamic State Badge -->
            <div class="ae-core-badge">
              <div class="ae-st-label" id="ae-state-label" data-i18n="standby">STANDBY</div>
              <div class="ae-st-hint" id="ae-state-hint" data-i18n="hint_standby_hf">SAY "HEY JARVIS" OR CLICK MIC</div>
            </div>

            <!-- Floating Subtitle Card -->
            <div class="ae-sub-card" id="ae-sub-card">
              <div class="ae-sub-text" id="ae-sub-text" data-i18n="subtitle_default">Click the mic or press Space to speak</div>
              <div class="ae-sub-meta">
                <span id="ae-sub-engine">GEMINI FLASH LITE</span>
                <div class="ae-eq-bar">
                  <span></span><span></span><span></span><span></span>
                </div>
              </div>
            </div>

            <!-- Dedicated Holographic Conversation Modal / Drawer -->
            <div class="ae-chat-modal" id="ae-chat-modal">
              <div class="ae-chat-card">
                <div class="ae-chat-head">
                  <div class="ae-chat-head-left">
                    <span class="ae-chat-dot"></span>
                    <span class="ae-chat-title" data-i18n="chat">CONVERSATION</span>
                    <span class="ae-chat-count" id="ae-chat-count">0 messages</span>
                  </div>
                  <button class="ae-chat-close" id="ae-chat-close" title="Close (Esc)">✕</button>
                </div>
                <div class="ae-feed-list" id="ae-feed-list">
                  <div class="ae-chat-empty" id="ae-chat-empty">
                    <div style="font-size:32px; margin-bottom:10px">💬</div>
                    <div style="font-size:13px; color:var(--ae-txt-dim)" data-i18n="subtitle_default">Click the mic or press Space to speak</div>
                  </div>
                </div>
                <div class="ae-chat-input-bar">
                  <input class="ae-chat-input-modal" id="ae-chat-input-modal" data-i18n-ph="input_placeholder" placeholder="Ask or speak to Jarvis... (Space to talk)" autocomplete="off">
                  <button class="ae-chat-send-modal" id="ae-chat-send-modal" data-i18n="send">SEND</button>
                </div>
              </div>
            </div>
          </main>

          <!-- Floating Bottom Action Dock -->
          <footer class="ae-dock-wrap">
            <div class="ae-dock">
              <button class="ae-dock-btn" id="ae-vox-btn" title="Toggle Hands-Free Mode (H)">
                <span>⚡ HANDS-FREE: ON</span>
              </button>
              
              <button class="ae-mic-btn" id="ae-mic-btn" title="Engage Voice (Space)">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </button>

              <button class="ae-dock-btn danger" id="ae-stop-btn" style="display:none" title="Interrupt / Stop">
                ■ <span data-i18n="stop">STOP</span>
              </button>

              <button class="ae-dock-btn" id="ae-feed-toggle-btn" title="Toggle Conversation View">
                💬 <span data-i18n="chat">CHAT</span>
              </button>
            </div>

            <!-- Sleek Integrated Chat Query Row -->
            <div class="ae-chat-row" id="ae-chat-row">
              <input class="ae-chat-input" id="ae-chat-input" data-i18n-ph="input_placeholder" placeholder="Ask or speak to Jarvis... (Space to talk)" autocomplete="off">
              <button class="ae-chat-send" id="ae-chat-send" data-i18n="send">SEND</button>
            </div>
          </footer>

          <!-- Slide-Over System Inspector Drawer -->
          <div class="ae-drawer-backdrop" id="ae-drawer-backdrop"></div>
          <aside class="ae-drawer" id="ae-drawer">
            <div class="ae-drawer-header">
              <div class="ae-drawer-title" data-i18n="inspector">SYSTEM INSPECTOR</div>
              <button class="ae-drawer-close" id="ae-drawer-close">✕</button>
            </div>
            <div class="ae-drawer-tabs">
              <button class="ae-tab-btn active" data-tab="telemetry" data-i18n="telemetry">TELEMETRY</button>
              <button class="ae-tab-btn" data-tab="activity" data-i18n="activity">ACTIVITY</button>
              <button class="ae-tab-btn" data-tab="views" data-i18n="views">VIEWS</button>
            </div>
            <div class="ae-drawer-body" id="ae-drawer-body">
              <!-- Content rendered dynamically based on active tab -->
            </div>
          </aside>
        </div>
      `;

      this.initCanvas();
      this.initEvents();
      this.initClock();
      this.renderDrawerContent();
    },

    unmount() {
      if (this.animId) cancelAnimationFrame(this.animId);
    },

    /* ---------------- Canvas & Reactor Visualizer ---------------- */
    initCanvas() {
      const cv = document.getElementById("ae-canvas");
      if (!cv) return;
      const ctx = cv.getContext("2d");
      const avImg = document.getElementById("ae-avatar-img");
      const avAura = document.getElementById("ae-avatar-aura");

      const size = () => {
        const r = cv.parentElement.getBoundingClientRect();
        cv.width = r.width * window.devicePixelRatio;
        cv.height = r.height * window.devicePixelRatio;
      };
      size();
      window.addEventListener("resize", size);

      let rot = 0;
      const STATE_STYLE = {
        standby: { speed: 0.15, color: "#a855f7", glow: 20, pulse: 0 },
        listening: { speed: 0.55, color: "#06b6d4", glow: 36, pulse: 1 },
        thinking: { speed: 1.7, color: "#f59e0b", glow: 28, pulse: 0.5 },
        tool: { speed: 2.2, color: "#ec4899", glow: 32, pulse: 0.6 },
        speaking: { speed: 0.75, color: "#c084fc", glow: 38, pulse: 0.8 },
        error: { speed: 0.05, color: "#f43f5e", glow: 22, pulse: 0 }
      };

      const drawRing = (cx, cy, r, w, color, alpha, dash, offset) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = w;
        if (dash) ctx.setLineDash(dash); else ctx.setLineDash([]);
        ctx.lineDashOffset = offset || 0;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
      };

      const render = (t) => {
        const st = window.JarvisCore ? window.JarvisCore.state : "standby";
        const level = window.JarvisCore ? window.JarvisCore.level : 0;
        const s = STATE_STYLE[st] || STATE_STYLE.standby;
        rot += s.speed;

        const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2;
        const base = Math.min(W, H) * 0.40;
        ctx.clearRect(0, 0, W, H);

        // Avatar dynamic transforms
        if (avImg) {
          if (st === "listening") {
            const sc = 1 + Math.min(level * 0.35, 0.14);
            avImg.style.transform = `scale(${sc})`;
            avImg.style.filter = `drop-shadow(0 0 ${16 + level * 45}px rgba(6,182,212,0.85)) brightness(${1 + level * 0.25})`;
            if (avAura) avAura.style.background = `radial-gradient(circle, rgba(6,182,212,0.45) 0%, rgba(147,51,234,0.2) 60%, transparent 80%)`;
          } else if (st === "speaking") {
            const sc = 1 + Math.sin(t / 160) * 0.035;
            avImg.style.transform = `scale(${sc})`;
            avImg.style.filter = "drop-shadow(0 0 26px rgba(192,132,252,0.85)) brightness(1.08)";
            if (avAura) avAura.style.background = `radial-gradient(circle, rgba(192,132,252,0.4) 0%, rgba(168,85,247,0.25) 55%, transparent 75%)`;
          } else if (st === "thinking" || st === "tool") {
            const sc = 0.98 + Math.sin(t / 250) * 0.015;
            avImg.style.transform = `scale(${sc})`;
            avImg.style.filter = "drop-shadow(0 0 20px rgba(245,158,11,0.65)) brightness(0.96)";
            if (avAura) avAura.style.background = `radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(147,51,234,0.15) 60%, transparent 80%)`;
          } else {
            avImg.style.transform = "scale(1)";
            avImg.style.filter = "drop-shadow(0 0 16px rgba(168,85,247,0.55)) brightness(1)";
            if (avAura) avAura.style.background = `radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(147,51,234,0.15) 50%, transparent 75%)`;
          }
        }

        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.glow * window.devicePixelRatio;
        const pulse = 1 + Math.sin(t / 300) * 0.012 * (1 + s.pulse * 3) + (st === "listening" ? level * 0.10 : 0);

        // Orbital rings
        drawRing(cx, cy, base * pulse * 1.08, 2 * window.devicePixelRatio, s.color, 0.85);
        drawRing(cx, cy, base * 0.96, 1.2 * window.devicePixelRatio, s.color, 0.4, [40, 16], rot * 1.8);
        drawRing(cx, cy, base * 0.82, 4 * window.devicePixelRatio, s.color, 0.22, [6, 12], -rot * 2.6);
        drawRing(cx, cy, base * 0.68, 1.2 * window.devicePixelRatio, s.color, 0.55, [70, 35], rot * 1.1);

        // Peripheral ticks
        ctx.shadowBlur = 0;
        for (let i = 0; i < 60; i++) {
          const a = (i / 60) * Math.PI * 2 + rot / 180;
          const r1 = base * 1.14, r2 = base * (i % 5 === 0 ? 1.20 : 1.17);
          ctx.beginPath();
          ctx.strokeStyle = s.color;
          ctx.globalAlpha = i % 5 === 0 ? 0.75 : 0.25;
          ctx.lineWidth = window.devicePixelRatio;
          ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
          ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Satellite nodes
        for (let j = 0; j < 3; j++) {
          const angle = rot * 0.018 + (j * Math.PI * 2 / 3);
          const nodex = cx + Math.cos(angle) * base * 1.08;
          const nodey = cy + Math.sin(angle) * base * 1.08;
          ctx.beginPath();
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 8 * window.devicePixelRatio;
          ctx.arc(nodex, nodey, 2.5 * window.devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;

        AetheriaTemplate.animId = requestAnimationFrame(render);
      };

      this.animId = requestAnimationFrame(render);
    },

    /* ---------------- Events & Core Wiring ---------------- */
    initEvents() {
      const core = window.JarvisCore;
      if (!core) return;

      const micBtn = document.getElementById("ae-mic-btn");
      const voxBtn = document.getElementById("ae-vox-btn");
      const stopBtn = document.getElementById("ae-stop-btn");
      const reactorBox = document.getElementById("ae-reactor-box");
      const chatInp = document.getElementById("ae-chat-input");
      const chatSend = document.getElementById("ae-chat-send");
      const drawerBtn = document.getElementById("ae-inspector-btn");
      const drawer = document.getElementById("ae-drawer");
      const drawerBackdrop = document.getElementById("ae-drawer-backdrop");
      const drawerClose = document.getElementById("ae-drawer-close");
      const feedList = document.getElementById("ae-feed-list");
      const feedToggle = document.getElementById("ae-feed-toggle-btn");
      const chatModal = document.getElementById("ae-chat-modal");
      const chatClose = document.getElementById("ae-chat-close");
      const chatCount = document.getElementById("ae-chat-count");
      const chatEmpty = document.getElementById("ae-chat-empty");
      const modalInp = document.getElementById("ae-chat-input-modal");
      const modalSend = document.getElementById("ae-chat-send-modal");

      // Voice Controls
      micBtn.onclick = () => core.toggleTalk();
      reactorBox.onclick = () => core.toggleTalk();
      voxBtn.onclick = () => core.toggleHandsFree();
      stopBtn.onclick = () => core.stopRun();

      // Drawer open/close
      const openDrawer = () => {
        drawer.classList.add("open");
        drawerBackdrop.classList.add("open");
      };
      const closeDrawer = () => {
        drawer.classList.remove("open");
        drawerBackdrop.classList.remove("open");
      };
      drawerBtn.onclick = openDrawer;
      drawerClose.onclick = closeDrawer;
      drawerBackdrop.onclick = closeDrawer;

      // Drawer Tabs
      document.querySelectorAll(".ae-tab-btn").forEach(btn => {
        btn.onclick = () => {
          document.querySelectorAll(".ae-tab-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          AetheriaTemplate.drawerTab = btn.dataset.tab;
          AetheriaTemplate.renderDrawerContent();
        };
      });

      // Holographic Chat Modal Open / Close
      let chatOpen = false;
      const openChat = () => {
        chatOpen = true;
        chatModal.classList.add("open");
        feedToggle.classList.add("active");
        setTimeout(() => { if (modalInp) modalInp.focus(); }, 120);
        if (feedList) feedList.scrollTop = feedList.scrollHeight;
      };
      const closeChat = () => {
        chatOpen = false;
        chatModal.classList.remove("open");
        feedToggle.classList.remove("active");
      };
      feedToggle.onclick = () => {
        if (chatOpen) closeChat();
        else openChat();
      };
      if (chatClose) chatClose.onclick = closeChat;
      if (chatModal) {
        chatModal.onclick = (e) => {
          if (e.target === chatModal) closeChat();
        };
      }
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && chatOpen) closeChat();
      });

      // Dock Chat input
      const sendFromDock = () => {
        const val = chatInp.value.trim();
        if (!val) return;
        chatInp.value = "";
        core.sendChat(val);
        openChat();
      };
      chatSend.onclick = sendFromDock;
      chatInp.onkeydown = e => {
        if (e.key === "Enter") sendFromDock();
      };

      // Modal Chat input
      if (modalSend && modalInp) {
        const sendFromModal = () => {
          const val = modalInp.value.trim();
          if (!val) return;
          modalInp.value = "";
          core.sendChat(val);
        };
        modalSend.onclick = sendFromModal;
        modalInp.onkeydown = e => {
          if (e.key === "Enter") sendFromModal();
        };
      }

      // Wire Core State
      core.on("state", e => {
        document.getElementById("ae-state-label").textContent = e.label;
        document.getElementById("ae-state-hint").textContent = e.hint;
      });

      core.on("capture_state", capturing => {
        micBtn.classList.toggle("active", capturing);
        stopBtn.style.display = capturing ? "flex" : "none";
      });

      core.on("handsfree", hf => {
        voxBtn.classList.toggle("active", hf);
        const t = (k, fb) => (window.I18n ? window.I18n.t(k) : fb);
        voxBtn.querySelector("span").textContent = hf ? t("hands_free_on", "⚡ HANDS-FREE: ON") : t("hands_free_off", "⚡ HANDS-FREE: OFF");
      });

      core.on("i18n_change", () => {
        const t = (k, fb) => (window.I18n ? window.I18n.t(k) : fb);
        voxBtn.querySelector("span").textContent = core.handsFree ? t("hands_free_on", "⚡ HANDS-FREE: ON") : t("hands_free_off", "⚡ HANDS-FREE: OFF");
        chatInp.placeholder = t("input_placeholder", "Ask or speak to Jarvis... (Space to talk)");
        chatSend.textContent = t("send", "SEND");
        if (modalInp) modalInp.placeholder = t("input_placeholder", "Ask or speak to Jarvis... (Space to talk)");
        if (modalSend) modalSend.textContent = t("send", "SEND");
        drawerBtn.querySelector("span").textContent = t("inspector", "INSPECTOR");
        feedToggle.querySelector("span").textContent = t("chat", "CHAT");
        stopBtn.querySelector("span").textContent = t("stop", "STOP");
      });

      // Partial live subtitle
      core.on("partial", text => {
        if (text && text.trim()) {
          document.getElementById("ae-sub-text").textContent = text;
          document.getElementById("ae-sub-engine").textContent = "GROQ WHISPER-V3 (FA)";
        }
      });

      // Final transcript / messages
      let totalMessages = 0;
      core.on("transcript", msg => {
        document.getElementById("ae-sub-text").textContent = msg.text;
        document.getElementById("ae-sub-engine").textContent = msg.isUser ? "USER SPEECH" : "GEMINI FLASH LITE (KORE)";

        totalMessages++;
        if (chatCount) chatCount.textContent = `${totalMessages} message${totalMessages > 1 ? "s" : ""}`;
        if (chatEmpty) chatEmpty.style.display = "none";

        // Append to chat list
        const div = document.createElement("div");
        div.className = "ae-msg " + (msg.isUser ? "you" : "jarvis");
        div.textContent = msg.text;
        feedList.appendChild(div);
        feedList.scrollTop = feedList.scrollHeight;
      });

      // Telemetry update
      core.on("metrics_turn", () => {
        AetheriaTemplate.renderDrawerContent();
      });
      core.on("usage", () => {
        AetheriaTemplate.renderDrawerContent();
      });
    },

    /* ---------------- Drawer Content ---------------- */
    renderDrawerContent() {
      const body = document.getElementById("ae-drawer-body");
      if (!body) return;
      const core = window.JarvisCore;

      if (this.drawerTab === "telemetry") {
        body.innerHTML = `
          <div class="ae-metric-card">
            <h4>Neural Pipeline</h4>
            <div class="ae-kv"><span>STT Provider</span><b>Groq Whisper Large V3 (fa)</b></div>
            <div class="ae-kv"><span>TTS Model</span><b>Gemini Flash Lite (Kore)</b></div>
            <div class="ae-kv"><span>Brain</span><b>Hermes 9Router Agent</b></div>
            <div class="ae-kv"><span>Sample Rate</span><b>16 kHz PCM S16LE</b></div>
          </div>
          <div class="ae-metric-card">
            <h4>Usage & Metrics</h4>
            <div class="ae-kv"><span>Total Turns</span><b id="ae-d-turns">${core ? core.turns : 0}</b></div>
            <div class="ae-kv"><span>Tokens Today</span><b id="ae-d-tok">—</b></div>
            <div class="ae-kv"><span>TTS Chars</span><b id="ae-d-tts">—</b></div>
            <div class="ae-kv"><span>Socket Link</span><b style="color:var(--ae-cyan)">ONLINE</b></div>
          </div>
        `;
      } else if (this.drawerTab === "activity") {
        body.innerHTML = `
          <div class="ae-metric-card">
            <h4>Agent Execution Log</h4>
            <div id="ae-activity-list" style="font-size:12px; color:var(--ae-txt-dim)">
              <div>— No recent background tool execution —</div>
            </div>
          </div>
        `;
      } else if (this.drawerTab === "views") {
        body.innerHTML = `
          <div class="ae-metric-card">
            <h4>Workspace Frames</h4>
            <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px">
              <button class="ae-dock-btn" style="width:100%; justify-content:center" onclick="window.open('/kanban','_blank')">▸ OPEN KANBAN</button>
              <button class="ae-dock-btn" style="width:100%; justify-content:center" onclick="window.open('/','_blank')">▸ HERMES DASHBOARD</button>
              <button class="ae-dock-btn" style="width:100%; justify-content:center" onclick="window.open('/chat','_blank')">▸ CHAT INTERFACE</button>
            </div>
          </div>
        `;
      }
    },

    /* ---------------- Clock ---------------- */
    initClock() {
      setInterval(() => {
        const el = document.getElementById("ae-clock");
        if (el) el.textContent = new Date().toTimeString().slice(0, 8);
      }, 500);
    }
  };

  window.AetheriaTemplate = AetheriaTemplate;
})(window);
