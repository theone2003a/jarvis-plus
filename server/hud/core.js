/**
 * J.A.R.V.I.S Voice & Agent Core Engine
 * Handles Web Audio 16kHz PCM streaming, Groq Whisper STT, Gemini Flash Lite TTS playback,
 * Hands-Free wake-word detection, VAD, approvals, telemetry polling, and event dispatch.
 */
(function(window) {
  "use strict";

  const CONV = "jarvis-main";
  const listeners = {};

  const JarvisCore = {
    CONV,
    state: "standby",        // standby | listening | thinking | tool | speaking | error
    level: 0,
    handsFree: true,
    capturing: false,
    wsReady: false,
    turns: 0,
    currentRun: null,
    serverTurnActive: false,
    speechDetectedInTurn: false,
    speechStartTime: 0,
    consecutiveSilenceMs: 0,
    turnStartTime: 0,
    wakeActive: false,
    audioCtx: null,

    on(event, fn) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(fn);
      return () => {
        listeners[event] = listeners[event].filter(f => f !== fn);
      };
    },

    emit(event, ...args) {
      if (listeners[event]) {
        listeners[event].forEach(fn => {
          try { fn(...args); } catch (err) { console.error(`Event ${event} error:`, err); }
        });
      }
    },

    setState(st, label, hint) {
      this.state = st;
      const t = (k, fb) => (window.I18n ? window.I18n.t(k) : fb);
      let resolvedLabel = label;
      if (!resolvedLabel) {
        resolvedLabel = t(st, st.toUpperCase());
      } else if (window.I18n) {
        if (st === "standby" && (label === "STANDBY")) resolvedLabel = t("standby", "STANDBY");
        else if (st === "listening" && (label === "LISTENING")) resolvedLabel = t("listening", "LISTENING");
        else if (label === "FOLLOW-UP") resolvedLabel = t("follow_up", "FOLLOW-UP");
        else if (st === "thinking" && (label === "PROCESSING")) resolvedLabel = t("thinking", "PROCESSING");
        else if (st === "speaking" && (label === "SPEAKING")) resolvedLabel = t("speaking", "SPEAKING");
        else if (st === "tool" && (label === "WORKING")) resolvedLabel = t("working", "WORKING");
        else if (label === "WAKE DETECTED!") resolvedLabel = t("wake_detected", "WAKE DETECTED!");
      }

      let defaultHint = (this.handsFree) 
        ? t("hint_standby_hf", 'SAY "HEY JARVIS" OR CLICK MIC') 
        : t("hint_standby_ptt", 'CLICK MIC OR SPACE TO TALK');

      let resolvedHint = hint !== undefined ? hint : defaultHint;
      if (resolvedHint === "J.A.R.V.I.S IS SPEAKING...") {
        resolvedHint = t("hint_speaking_jarvis", resolvedHint);
      } else if (typeof resolvedHint === "string" && (resolvedHint.includes("FOLLOW-UP") || resolvedHint.includes("6s"))) {
        resolvedHint = t("hint_follow_up", resolvedHint);
      } else if (typeof resolvedHint === "string" && resolvedHint.includes("PAUSE")) {
        resolvedHint = t("hint_speaking_pause", resolvedHint);
      }

      this.emit("state", { state: st, label: resolvedLabel, hint: resolvedHint });
    },

    sttLanguage: localStorage.getItem("jarvis_stt_lang") || "fa",

    setSttLanguage(code) {
      this.sttLanguage = code;
      localStorage.setItem("jarvis_stt_lang", code);
      if (this.wsReady && ws) {
        try { ws.send(JSON.stringify({ type: "set_language", language: code })); } catch(e) {}
      }
      this.emit("stt_lang_change", code);
    }
  };

  /* ============================== Audio Output ========================== */
  let playhead = 0, activeSources = [], leftoverByte = null, audioArrived = false;

  function ensureCtx() {
    if (!JarvisCore.audioCtx) {
      try { JarvisCore.audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 }); }
      catch { JarvisCore.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    }
    if (JarvisCore.audioCtx.state === "suspended") JarvisCore.audioCtx.resume();
    return JarvisCore.audioCtx;
  }
  JarvisCore.ensureCtx = ensureCtx;

  function playChunk(buf) {
    const ctx = ensureCtx();
    let bytes = new Uint8Array(buf);
    if (leftoverByte !== null) {
      const m = new Uint8Array(bytes.length + 1);
      m[0] = leftoverByte;
      m.set(bytes, 1);
      bytes = m;
      leftoverByte = null;
    }
    if (bytes.length % 2 === 1) {
      leftoverByte = bytes[bytes.length - 1];
      bytes = bytes.subarray(0, bytes.length - 1);
    }
    if (!bytes.length) return;

    const i16 = new Int16Array(bytes.buffer, bytes.byteOffset, bytes.length / 2);
    const f32 = new Float32Array(i16.length);
    for (let i = 0; i < i16.length; i++) f32[i] = i16[i] / 32768;

    const ab = ctx.createBuffer(1, f32.length, 16000);
    ab.copyToChannel(f32, 0);

    const src = ctx.createBufferSource();
    src.buffer = ab;
    src.connect(ctx.destination);

    const t = Math.max(ctx.currentTime + 0.06, playhead);
    src.start(t);
    playhead = t + ab.duration;
    activeSources.push(src);

    src.onended = () => {
      activeSources = activeSources.filter(x => x !== src);
      if (!JarvisCore.serverTurnActive && activeSources.length === 0) {
        onPlaybackEnded();
      }
    };
    audioArrived = true;
  }

  function onPlaybackEnded() {
    if (JarvisCore.capturing) return;
    if (JarvisCore.handsFree) {
      if (JarvisCore.isFarewellTurn) {
        JarvisCore.isFarewellTurn = false;
        JarvisCore.setState("standby", "STANDBY");
        setTimeout(() => {
          if (JarvisCore.handsFree && !JarvisCore.capturing && JarvisCore.state === "standby") {
            startWakeListening();
          }
        }, 600);
        return;
      }
      // Continued Conversation (Follow-Up Mode):
      // Wait 350ms for physical speaker reverberation in the room to clear,
      // then seamlessly re-open the mic in follow-up mode for 6 seconds without needing wake word!
      setTimeout(() => {
        if (JarvisCore.handsFree && !JarvisCore.capturing && !JarvisCore.serverTurnActive) {
          JarvisCore.startTalk(true);
        }
      }, 350);
    } else {
      JarvisCore.setState("standby", "STANDBY");
    }
  }

  function stopPlayback() {
    activeSources.forEach(s => { try { s.stop(); } catch (e) {} });
    activeSources = [];
    playhead = 0;
  }
  JarvisCore.stopPlayback = stopPlayback;

  /* ============================== Chimes ================================ */
  function playChime(type = "wake") {
    try {
      const ctx = ensureCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === "wake") {
        JarvisCore.chimeActiveUntil = Date.now() + 380;
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "send") {
        JarvisCore.chimeActiveUntil = Date.now() + 250;
        osc.type = "sine";
        osc.frequency.setValueAtTime(880.00, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.09);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === "followup") {
        JarvisCore.chimeActiveUntil = Date.now() + 280;
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.10);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {}
  }
  JarvisCore.playChime = playChime;

  /* ============================== WebSocket ============================= */
  let ws = null;
  function wsUrl() {
    return (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/ws";
  }

  function connectWs() {
    ws = new WebSocket(wsUrl());
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
      JarvisCore.wsReady = true;
      JarvisCore.emit("ws_state", true);
      JarvisCore.emit("log", { type: "sys", text: "VOICE SERVER CONNECTED" });
      if (JarvisCore.sttLanguage) {
        try { ws.send(JSON.stringify({ type: "set_language", language: JarvisCore.sttLanguage })); } catch (e) {}
      }
    };
    ws.onclose = () => {
      JarvisCore.wsReady = false;
      JarvisCore.emit("ws_state", false);
      JarvisCore.setState("standby", "STANDBY");
      setTimeout(connectWs, 3000);
    };
    ws.onerror = () => {};
    ws.onmessage = ev => {
      if (ev.data instanceof ArrayBuffer) {
        playChunk(ev.data);
        return;
      }
      let e;
      try { e = JSON.parse(ev.data); } catch { return; }

      if (e.type === "summon_panel") {
        JarvisCore.emit("summon_panel", e);
      } else if (e.type === "dismiss_panels") {
        JarvisCore.emit("dismiss_panels");
      } else if (e.type === "partial_transcript") {
        if (e.text && e.text.trim()) {
          JarvisCore.speechDetectedInTurn = true;
          if (!JarvisCore.speechStartTime) JarvisCore.speechStartTime = Date.now();
          JarvisCore.consecutiveSilenceMs = 0;
          JarvisCore.lastPartialTranscript = e.text.trim();
        }
        JarvisCore.emit("partial", e.text);
      } else if (e.type === "transcript") {
        JarvisCore.emit("transcript", { text: e.text, isUser: true });
        if (e.text && /^(?:ممنون|مرسی|سپاسگزارم|خداحافظ|خدافظ|خسته نباشید|دستت درد نکنه|خداحافظی|bye|goodbye|thank you|thanks|quit|exit|stop)[\s\.\!؟]*$/i.test(e.text.trim())) {
          JarvisCore.isFarewellTurn = true;
        } else {
          JarvisCore.isFarewellTurn = false;
        }
      } else if (e.type === "run_started") {
        JarvisCore.currentRun = e.run_id;
        JarvisCore.emit("run_started", e.run_id);
      } else if (e.type === "approval_request") {
        JarvisCore.emit("approval_request", e);
      } else if (e.type === "agent_status") {
        if (e.state === "thinking") {
          JarvisCore.setState("thinking", "PROCESSING");
        } else if (e.state === "tool_use") {
          JarvisCore.setState("tool", "WORKING");
          JarvisCore.emit("activity", { text: "", tool: e.tool || "tool", preview: e.preview });
        } else if (e.state === "speaking") {
          JarvisCore.setState("speaking", "SPEAKING", "J.A.R.V.I.S IS SPEAKING...");
        } else if (e.state === "stopped") {
          JarvisCore.setState("standby", "STANDBY");
          stopPlayback();
          JarvisCore.emit("log", { type: "sys", text: "run stopped" });
        }
      } else if (e.type === "error") {
        JarvisCore.emit("partial", "");
        JarvisCore.emit("log", { type: "sys", text: "error: " + e.message });
        JarvisCore.setState("standby", "STANDBY");
        JarvisCore.serverTurnActive = false;
        if (JarvisCore.handsFree && !JarvisCore.capturing) startWakeListening();
      } else if (e.type === "status") {
        if (e.message && (e.message.includes("cancelled") || e.message.includes("Run halted"))) {
          JarvisCore.emit("partial", "");
          JarvisCore.serverTurnActive = false;
          if (!JarvisCore.capturing && JarvisCore.state !== "speaking") JarvisCore.setState("standby", "STANDBY");
        }
      } else if (e.type === "done") {
        JarvisCore.currentRun = null;
        JarvisCore.serverTurnActive = false;
        const tm = e.timing || {};
        JarvisCore.turns++;
        JarvisCore.emit("metrics_turn", {
          turns: JarvisCore.turns,
          timing: tm,
          stt_model: tm.stt_model,
          tts_model: tm.tts_model,
          llm_provider: tm.llm_provider,
          response_text: tm.response_text
        });
        if (tm.response_text) {
          JarvisCore.emit("transcript", { text: tm.response_text, isUser: false });
        }
        if (activeSources.length === 0) {
          onPlaybackEnded();
        }
      }
    };
  }

  /* ============================== Wake Word & Hands-Free ============= */
  let recognition = null;
  let wakeRestartTimer = null;
  let wakeLastFiredAt = 0;

  function initWakeEngine() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn("SpeechRecognition API not available in this browser");
      return false;
    }
    if (recognition) return true;
    try {
      recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      recognition.onresult = event => {
        if (!JarvisCore.handsFree || JarvisCore.capturing) return;
        if (Date.now() - wakeLastFiredAt < 2000) return;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          for (let j = 0; j < res.length; ++j) {
            const phrase = (res[j].transcript || "").toLowerCase().trim();
            if (
              phrase.includes("jarvis") ||
              phrase.includes("جارویس") ||
              phrase.includes("هی جارویس") ||
              phrase.includes("hey jarvis") ||
              phrase.includes("hi jarvis")
            ) {
              console.log("Wake word triggered:", phrase);
              wakeLastFiredAt = Date.now();
              stopWakeListening();
              playChime("wake");
              JarvisCore.setState("listening", "WAKE DETECTED!", "START TALKING NOW...");
              setTimeout(() => {
                if (!JarvisCore.capturing) JarvisCore.startTalk();
              }, 320);
              return;
            }
          }
        }
      };

      recognition.onerror = event => {
        if (event.error === "no-speech") return;
        console.warn("Wake speech error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          JarvisCore.handsFree = false;
          JarvisCore.emit("handsfree", false);
          JarvisCore.emit("log", { type: "sys", text: "Microphone permission required for Hands-Free mode" });
        }
      };

      recognition.onend = () => {
        JarvisCore.wakeActive = false;
        if (JarvisCore.handsFree && !JarvisCore.capturing && JarvisCore.state !== "speaking") {
          const msSinceWake = Date.now() - wakeLastFiredAt;
          const restartDelay = msSinceWake < 2000 ? (2000 - msSinceWake) : 400;
          clearTimeout(wakeRestartTimer);
          wakeRestartTimer = setTimeout(() => {
            startWakeListening();
          }, restartDelay);
        }
      };
      return true;
    } catch (err) {
      console.warn("Wake init error:", err);
      return false;
    }
  }

  function startWakeListening() {
    if (!JarvisCore.handsFree || JarvisCore.capturing || JarvisCore.state === "speaking") return;
    if (!recognition && !initWakeEngine()) return;
    if (!JarvisCore.wakeActive) {
      try {
        recognition.start();
        JarvisCore.wakeActive = true;
        JarvisCore.emit("wake_status", true);
      } catch (e) {
        JarvisCore.wakeActive = false;
      }
    }
  }

  function stopWakeListening() {
    clearTimeout(wakeRestartTimer);
    JarvisCore.wakeActive = false;
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }
    JarvisCore.emit("wake_status", false);
  }

  JarvisCore.toggleHandsFree = function() {
    this.handsFree = !this.handsFree;
    this.emit("handsfree", this.handsFree);
    if (this.capturing) {
      this.stopTalk("abort");
    }
    this.emit("partial", "");
    if (this.handsFree) {
      ensureCtx();
      this.emit("log", { type: "sys", text: 'Hands-Free mode ON. Say "Hey Jarvis" or "جارویس" to talk.' });
      startWakeListening();
      if (this.state === "standby") this.setState("standby", "STANDBY");
    } else {
      stopWakeListening();
      this.emit("log", { type: "sys", text: "Hands-Free mode OFF (Push-to-Talk active)." });
      if (this.state === "standby") this.setState("standby", "STANDBY");
    }
  };

  /* ============================== Microphone & VAD ==================== */
  const workletCode = `
class PCM16K extends AudioWorkletProcessor{
  constructor(){super();this.frac=0;this.acc=0;this.n=0;this.out=[];}
  process(inputs){
    const ch=inputs[0][0]; if(!ch)return true;
    if(sampleRate===16000){
      for(let i=0;i<ch.length;i++){
        const v=Math.max(-1,Math.min(1,ch[i])); this.out.push(v*32767|0);
      }
    }else{
      for(let i=0;i<ch.length;i++){
        this.acc+=ch[i]; this.n++; this.frac+=16000;
        if(this.frac>=sampleRate){ this.frac-=sampleRate;
          const v=Math.max(-1,Math.min(1,this.acc/this.n));
          this.out.push(v*32767|0); this.acc=0; this.n=0; }
      }
    }
    if(this.out.length>=1280){
      const a=new Int16Array(this.out.splice(0,1280));
      this.port.postMessage(a.buffer,[a.buffer]);
    }
    return true;
  }
}
registerProcessor("pcm16k",PCM16K);`;

  let workletReady = false, mediaStream = null, srcNode = null, workletNode = null;

  async function initMic() {
    const ctx = ensureCtx();
    if (!workletReady) {
      const url = URL.createObjectURL(new Blob([workletCode], { type: "application/javascript" }));
      await ctx.audioWorklet.addModule(url);
      workletReady = true;
    }
    if (!mediaStream) {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, sampleRate: 16000, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      srcNode = ctx.createMediaStreamSource(mediaStream);
      workletNode = new AudioWorkletNode(ctx, "pcm16k");
      workletNode.port.onmessage = e => {
        if (JarvisCore.capturing && JarvisCore.wsReady) ws.send(e.data);

        // Level computation
        const a = new Int16Array(e.data);
        let s = 0;
        for (let i = 0; i < a.length; i += 8) s += Math.abs(a[i]);
        JarvisCore.level = Math.min(1, (s / (a.length / 8)) / 9000);
        JarvisCore.emit("level", JarvisCore.level);

        // VAD
        if (JarvisCore.capturing && activeSources.length === 0) {
          const now = Date.now();
          if (!JarvisCore.speechDetectedInTurn) {
            const isChimeActive = now < (JarvisCore.chimeActiveUntil || 0);
            if (!isChimeActive && JarvisCore.level > 0.062) {
              JarvisCore.consecutiveVoiceMs = (JarvisCore.consecutiveVoiceMs || 0) + 80;
              if (JarvisCore.consecutiveVoiceMs >= 200) {
                JarvisCore.speechDetectedInTurn = true;
                JarvisCore.speechStartTime = now - 200;
                JarvisCore.consecutiveSilenceMs = 0;
                if (JarvisCore.handsFree) JarvisCore.setState("listening", "LISTENING", "SPEAKING... (PAUSE TO SEND)");
              }
            } else {
              JarvisCore.consecutiveVoiceMs = 0;
            }
          } else {
            if (JarvisCore.level < 0.038) {
              JarvisCore.consecutiveSilenceMs += 80;
              // Dynamic silence threshold:
              // 650ms for normal sentences (fast, crisp turn completion).
              // Extended to 1100ms if user paused mid-sentence on conjunctions / fillers ("و", "یا", "که", "چون", "and", "or", etc.).
              const txt = JarvisCore.lastPartialTranscript || "";
              const isMidSentence = /(?:^|\s)(?:و|یا|که|چون|چونکه|اما|ولی|اگر|مثلاً|یعنی|and|or|because|but|so|if|like|um|uh)[\s,،]*$/i.test(txt);
              const dynamicThreshold = isMidSentence ? 1100 : 650;
              if (JarvisCore.consecutiveSilenceMs >= dynamicThreshold && (now - JarvisCore.speechStartTime) >= 450) {
                console.log(`Silence detected (${dynamicThreshold}ms, midSentence=${isMidSentence}) -> auto-submitting turn`);
                playChime("send");
                JarvisCore.stopTalk("silence");
              }
            } else {
              JarvisCore.consecutiveSilenceMs = 0;
            }
          }
          if (now - JarvisCore.turnStartTime > 28000) {
            JarvisCore.stopTalk("timeout");
          }
        }
      };
      srcNode.connect(workletNode);
    }
    JarvisCore.emit("mic_state", true);
  }

  JarvisCore.startTalk = async function(isFollowUp = false) {
    if (!this.wsReady) {
      this.emit("log", { type: "sys", text: "voice server offline" });
      return;
    }
    stopWakeListening();
    try { await initMic(); } catch (err) {
      this.emit("log", { type: "sys", text: "mic blocked: " + err.message });
      return;
    }
    stopPlayback(); // barge-in
    audioArrived = false;
    this.speechDetectedInTurn = false;
    this.speechStartTime = 0;
    this.consecutiveSilenceMs = 0;
    this.consecutiveVoiceMs = 0;
    this.lastPartialTranscript = "";
    this.turnStartTime = Date.now();

    ws.send(JSON.stringify({
      type: "start",
      sample_rate: 16000,
      format: "pcm_s16le",
      channels: 1,
      conversation: CONV,
      language: this.sttLanguage || "fa"
    }));
    this.capturing = true;
    this.serverTurnActive = true;
    this.emit("capture_state", true);

    if (isFollowUp) {
      playChime("followup");
      this.setState("listening", "FOLLOW-UP", "LISTENING · REPLY NOW OR PAUSE 6s TO SLEEP");
    } else {
      this.setState("listening", "LISTENING", this.handsFree ? "SPEAK NOW · PAUSE TO SEND" : "CLICK AGAIN OR SPACE TO SEND");
    }

    if (this.handsFree) {
      const maxWaitMs = isFollowUp ? 6500 : 8000;
      setTimeout(() => {
        if (this.capturing && !this.speechDetectedInTurn) {
          console.log(`Hands-free: no speech in ${maxWaitMs / 1000}s, ending follow-up`);
          this.stopTalk("timeout-no-speech");
        }
      }, maxWaitMs);
    }
  };

  JarvisCore.stopTalk = async function(reason = "manual") {
    if (!this.capturing) return;
    this.capturing = false;
    this.level = 0;
    this.emit("level", 0);
    this.emit("capture_state", false);

    if (reason === "abort" || (this.handsFree && reason !== "manual" && !this.speechDetectedInTurn)) {
      this.serverTurnActive = false;
      this.emit("partial", "");
      if (this.wsReady) ws.send(JSON.stringify({ type: "cancel" }));
      console.log(`Turn cancelled (${reason})`);
      this.setState("standby", "STANDBY");
      setTimeout(() => { if (this.handsFree && !this.capturing) startWakeListening(); }, 500);
      return;
    }
    this.serverTurnActive = true;
    if (this.wsReady) ws.send(JSON.stringify({ type: "stop" }));
    this.setState("thinking", "PROCESSING");
  };

  JarvisCore.toggleTalk = function() {
    if (this.capturing) {
      this.stopTalk("manual");
    } else {
      this.startTalk();
    }
  };

  JarvisCore.stopRun = function() {
    stopPlayback();
    this.emit("partial", "");
    if (this.capturing) this.stopTalk("abort");
    if (this.wsReady) ws.send(JSON.stringify({ type: "stop_run" }));
    this.serverTurnActive = false;
    this.setState("standby", "STANDBY");
    if (this.handsFree && !this.capturing) startWakeListening();
  };

  JarvisCore.sendChat = async function(text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return;
    this.emit("transcript", { text: trimmed, isUser: true });
    this.setState("thinking", "PROCESSING");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed, conversation: CONV })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || r.status);
      (j.tools || []).forEach(t => this.emit("activity", { text: "", tool: t.name, preview: t.preview }));
      this.emit("transcript", { text: j.text || "(no reply)", isUser: false });
    } catch (err) {
      this.emit("log", { type: "sys", text: "chat error: " + err.message });
    }
    if (this.state !== "listening") this.setState("standby", "STANDBY");
  };

  JarvisCore.respondApproval = function(runId, approvalId, decision) {
    if (this.wsReady) {
      ws.send(JSON.stringify({
        type: "approval_decision",
        run_id: runId || this.currentRun,
        approval_id: approvalId,
        decision
      }));
    }
  };

  /* ============================== Telemetry Refresh ==================== */
  const fmtK = n => n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "k" : String(n || 0);

  async function refreshTelemetry() {
    // Health & detailed stats
    try {
      const r = await fetch("/api/hermes/health/detailed");
      if (r.ok) {
        const h = await r.json();
        JarvisCore.emit("hermes_health", h);
      }
    } catch {}

    // Usage & tokens
    try {
      const r = await fetch("/api/usage");
      if (r.ok) {
        const u = await r.json();
        const t = u.llm?.today || {};
        JarvisCore.emit("usage", {
          tokens: `${fmtK(t.llm_in || 0)} in / ${fmtK(t.llm_out || 0)} out`,
          turns: t.turns || 0,
          cost: u.llm?.today_cost != null ? "$" + u.llm.today_cost.toFixed(2) : null,
          ttsChars: fmtK(t.tts_chars || 0)
        });
      }
    } catch {}

    // Machines
    try {
      const r = await fetch("/api/machines");
      if (r.ok) {
        const m = await r.json();
        JarvisCore.emit("machines", m.machines || []);
      }
    } catch {}

    // Skills
    try {
      const r = await fetch("/api/hermes/v1/skills");
      if (r.ok) {
        const s = await r.json();
        const list = Array.isArray(s) ? s : (s.data || s.skills || []);
        JarvisCore.emit("skills", list);
      }
    } catch {}

    // Jobs
    try {
      const r = await fetch("/api/hermes/api/jobs");
      if (r.ok) {
        const j = await r.json();
        const list = Array.isArray(j) ? j : (j.jobs || j.data || []);
        JarvisCore.emit("jobs", list);
      }
    } catch {}
  }

  /* ============================== Auth Check =========================== */
  JarvisCore.checkAuth = async function() {
    try {
      const r = await fetch("/api/usage");
      if (r.status === 401) return false;
    } catch {}
    return true;
  };

  /* ============================== Initialize =========================== */
  JarvisCore.init = function() {
    connectWs();
    refreshTelemetry();
    setInterval(refreshTelemetry, 25000);

    // Global Keybindings
    window.addEventListener("keydown", e => {
      const isTyping = document.activeElement && (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.isContentEditable
      );
      if (isTyping) return;
      if (e.code === "Space") {
        e.preventDefault();
        JarvisCore.toggleTalk();
      }
      if (e.code === "KeyH" || e.key === "h" || e.key === "H") {
        e.preventDefault();
        JarvisCore.toggleHandsFree();
      }
      if (e.key === "Escape") {
        JarvisCore.stopRun();
      }
    });

    // Auto-unlock audio context on first interaction
    const unlock = () => {
      ensureCtx();
      if (JarvisCore.handsFree && !JarvisCore.capturing && JarvisCore.state !== "speaking") {
        startWakeListening();
      }
    };
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });

    if (this.handsFree) {
      startWakeListening();
    }
  };

  window.JarvisCore = JarvisCore;
})(window);
