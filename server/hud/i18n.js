/**
 * J.A.R.V.I.S HUD — Internationalization (i18n) & STT Language Manager
 * Supports English, Persian (فارسی), Spanish, French, German, Arabic, Chinese, Russian, Japanese.
 */
(function(window) {
  "use strict";

  const TRANSLATIONS = {
    en: {
      dir: "ltr",
      name: "English",
      standby: "STANDBY",
      listening: "LISTENING",
      thinking: "PROCESSING",
      speaking: "SPEAKING",
      working: "WORKING",
      error: "ERROR",
      wake_detected: "WAKE DETECTED!",
      follow_up: "FOLLOW-UP",
      hint_standby_hf: 'SAY "HEY JARVIS" OR CLICK MIC',
      hint_standby_ptt: 'CLICK MIC OR PRESS SPACE TO TALK',
      hint_speaking_pause: 'SPEAKING... (PAUSE TO SEND)',
      hint_follow_up: 'LISTENING · REPLY NOW OR PAUSE 6s TO SLEEP',
      hint_speaking_jarvis: 'J.A.R.V.I.S IS SPEAKING...',
      subtitle_default: 'Click the mic or press Space to speak',
      engage_voice: "ENGAGE VOICE",
      stop_send: "■ STOP & SEND",
      hands_free_on: "⚡ HANDS-FREE: ON",
      hands_free_off: "⚡ HANDS-FREE: OFF",
      stop: "STOP",
      chat: "CHAT",
      transcript: "TRANSCRIPT",
      inspector: "INSPECTOR",
      send: "SEND",
      input_placeholder: "Ask or speak to Jarvis... (Space to talk)",
      voice_connected: "VOICE SERVER CONNECTED",
      voice_offline: "VOICE SERVER OFFLINE",
      telemetry: "TELEMETRY",
      activity: "ACTIVITY",
      views: "VIEWS",
      models: "LOADOUT",
      template: "Template",
      language: "Language",
      stt_mode: "Whisper STT"
    },
    fa: {
      dir: "rtl",
      name: "فارسی (Persian)",
      standby: "آماده‌باش",
      listening: "در حال شنیدن",
      thinking: "در حال پردازش",
      speaking: "در حال پاسخ",
      working: "اجرای ابزار",
      error: "خطا",
      wake_detected: "شناسایی شد!",
      follow_up: "ادامه گفتگو",
      hint_standby_hf: 'بگویید «جارویس» یا روی میکروفون بزنید',
      hint_standby_ptt: 'روی میکروفون بزنید یا کلید Space را فشار دهید',
      hint_speaking_pause: 'صحبت کنید... (مکث کوتاه برای ارسال)',
      hint_follow_up: 'در حال شنیدن · پاسخ دهید یا ۶ ثانیه سکوت کنید',
      hint_speaking_jarvis: 'جارویس در حال صحبت است...',
      subtitle_default: 'برای گفتگو کلیک کنید یا کلید Space را فشار دهید',
      engage_voice: "شروع گفتگو",
      stop_send: "■ توقف و ارسال",
      hands_free_on: "⚡ هندزفری: روشن",
      hands_free_off: "⚡ هندزفری: خاموش",
      stop: "توقف",
      chat: "گفتگو",
      transcript: "متن پیام‌ها",
      inspector: "سیستم",
      send: "ارسال",
      input_placeholder: 'از جارویس بپرسید... (Space برای گفتگو)',
      voice_connected: "سرور صوتی متصل شد",
      voice_offline: "سرور صوتی قطع است",
      telemetry: "اطلاعات سیستم",
      activity: "فعالیت‌ها",
      views: "نماها",
      models: "مدل‌ها",
      template: "قالب",
      language: "زبان",
      stt_mode: "زبان ویسپر"
    },
    es: {
      dir: "ltr",
      name: "Español (Spanish)",
      standby: "EN ESPERA",
      listening: "ESCUCHANDO",
      thinking: "PROCESANDO",
      speaking: "HABLANDO",
      working: "TRABAJANDO",
      error: "ERROR",
      wake_detected: "¡ACTIVADO!",
      follow_up: "SEGUIMIENTO",
      hint_standby_hf: 'DI "HEY JARVIS" O TOCA EL MICRÓFONO',
      hint_standby_ptt: 'TOCA EL MICRÓFONO O PULSA ESPACIO',
      hint_speaking_pause: 'HABLANDO... (PAUSA PARA ENVIAR)',
      hint_follow_up: 'ESCUCHANDO · RESPONDA AHORA O PAUSE 6s',
      hint_speaking_jarvis: 'J.A.R.V.I.S ESTÁ HABLANDO...',
      subtitle_default: 'Toca el micrófono o presiona Espacio para hablar',
      engage_voice: "INICIAR VOZ",
      stop_send: "■ DETENER Y ENVIAR",
      hands_free_on: "⚡ MANOS LIBRES: SÍ",
      hands_free_off: "⚡ MANOS LIBRES: NO",
      stop: "DETENER",
      chat: "CHAT",
      transcript: "TRANSCRIPCIÓN",
      inspector: "SISTEMA",
      send: "ENVIAR",
      input_placeholder: "Pregunta a Jarvis... (Espacio para hablar)",
      voice_connected: "SERVIDOR DE VOZ CONECTADO",
      voice_offline: "SERVIDOR DE VOZ DESCONECTADO",
      telemetry: "TELEMETRÍA",
      activity: "ACTIVIDAD",
      views: "VISTAS",
      models: "MODELOS",
      template: "Plantilla",
      language: "Idioma",
      stt_mode: "Modo Whisper"
    },
    fr: {
      dir: "ltr",
      name: "Français (French)",
      standby: "EN ATTENTE",
      listening: "ÉCOUTE EN COURS",
      thinking: "TRAITEMENT",
      speaking: "EN TRAIN DE PARLER",
      working: "ACTION EN COURS",
      error: "ERREUR",
      wake_detected: "DÉTECTÉ !",
      follow_up: "SUIVI",
      hint_standby_hf: 'DITES "HEY JARVIS" OU CLIQUEZ SUR LE MIC',
      hint_standby_ptt: 'CLIQUEZ SUR LE MIC OU ESPACE POUR PARLER',
      hint_speaking_pause: 'PARLEZ... (PAUSE POUR ENVOYER)',
      hint_follow_up: 'ÉCOUTE EN COURS · RÉPONDEZ OU PAUSE 6s',
      hint_speaking_jarvis: 'J.A.R.V.I.S PARLE...',
      subtitle_default: 'Cliquez sur le micro ou appuyez sur Espace pour parler',
      engage_voice: "ACTIVER LA VOIX",
      stop_send: "■ ARRÊTER ET ENVOYER",
      hands_free_on: "⚡ MAINS LIBRES: OUI",
      hands_free_off: "⚡ MAINS LIBRES: NON",
      stop: "ARRÊT",
      chat: "CHAT",
      transcript: "TRANSCRIPTION",
      inspector: "INSPECTEUR",
      send: "ENVOYER",
      input_placeholder: "Demandez à Jarvis... (Espace pour parler)",
      voice_connected: "SERVEUR VOCAL CONNECTÉ",
      voice_offline: "SERVEUR VOCAL HORS LIGNE",
      telemetry: "TÉLÉMÉTRIE",
      activity: "ACTIVITÉ",
      views: "VUES",
      models: "MODÈLES",
      template: "Modèle",
      language: "Langue",
      stt_mode: "Mode Whisper"
    },
    de: {
      dir: "ltr",
      name: "Deutsch (German)",
      standby: "BEREIT",
      listening: "HÖRT ZU",
      thinking: "VERARBEITUNG",
      speaking: "SPRICHT",
      working: "ARBEITET",
      error: "FEHLER",
      wake_detected: "AKTIVIERT!",
      follow_up: "FOLGEDIALOG",
      hint_standby_hf: '"HEY JARVIS" SAGEN ODER MIKROFON KLICKEN',
      hint_standby_ptt: 'MIKROFON KLICKEN ODER LEERTASTE DRÜCKEN',
      hint_speaking_pause: 'SPRECHEN... (PAUSE ZUM SENDEN)',
      hint_follow_up: 'ZUHÖREN · JETZT ANTWORTEN ODER 6s WARTEN',
      hint_speaking_jarvis: 'J.A.R.V.I.S SPRICHT...',
      subtitle_default: 'Klicken Sie auf das Mikrofon oder drücken Sie die Leertaste',
      engage_voice: "SPRACHE STARTEN",
      stop_send: "■ STOPP & SENDEN",
      hands_free_on: "⚡ FREISPRECHEN: AN",
      hands_free_off: "⚡ FREISPRECHEN: AUS",
      stop: "STOPP",
      chat: "CHAT",
      transcript: "TRANSKRIPT",
      inspector: "INSPEKTOR",
      send: "SENDEN",
      input_placeholder: "Frage an Jarvis... (Leertaste zum Sprechen)",
      voice_connected: "SPRACHSERVER VERBUNDEN",
      voice_offline: "SPRACHSERVER GETRENNT",
      telemetry: "TELEMETRIE",
      activity: "AKTIVITÄT",
      views: "ANSICHTEN",
      models: "MODELLE",
      template: "Vorlage",
      language: "Sprache",
      stt_mode: "Whisper-Modus"
    },
    ar: {
      dir: "rtl",
      name: "العربية (Arabic)",
      standby: "في الانتظار",
      listening: "يستمع الآن",
      thinking: "جاري المعالجة",
      speaking: "يتحدث الآن",
      working: "تنفيذ الأداة",
      error: "خطأ",
      wake_detected: "تم التفعيل!",
      follow_up: "متابعة الحوار",
      hint_standby_hf: 'قل "HEY JARVIS" أو انقر على الميكروفون',
      hint_standby_ptt: 'انقر على الميكروفون أو اضغط مسافة',
      hint_speaking_pause: 'تحدث الآن... (توقف قصير للإرسال)',
      hint_follow_up: 'أستمع إليك · أجب الآن أو توقف 6 ثوانٍ للإنهاء',
      hint_speaking_jarvis: 'جارفيس يتحدث الآن...',
      subtitle_default: 'انقر على الميكروفون أو اضغط مسافة للتحدث',
      engage_voice: "بدء الصوت",
      stop_send: "■ إيقاف وإرسال",
      hands_free_on: "⚡ التحدث الحر: مفعّل",
      hands_free_off: "⚡ التحدث الحر: معطّل",
      stop: "إيقاف",
      chat: "المحادثة",
      transcript: "سجل النص",
      inspector: "لوحة النظام",
      send: "إرسال",
      input_placeholder: "اسأل جارفيس... (مسافة للتحدث)",
      voice_connected: "تم الاتصال بالخادم الصوتی",
      voice_offline: "الخادم الصوتي غير متصل",
      telemetry: "البيانات",
      activity: "النشاط",
      views: "العروض",
      models: "النماذج",
      template: "القالب",
      language: "اللغة",
      stt_mode: "لغة ويسبر"
    },
    zh: {
      dir: "ltr",
      name: "中文 (Chinese)",
      standby: "待命",
      listening: "正在聆听",
      thinking: "正在思考",
      speaking: "正在回答",
      working: "正在处理",
      error: "错误",
      wake_detected: "已唤醒！",
      follow_up: "连续对话",
      hint_standby_hf: '说 "HEY JARVIS" 或点击麦克风',
      hint_standby_ptt: '点击麦克风或按空格键讲话',
      hint_speaking_pause: '正在讲话...（停顿自动发送）',
      hint_follow_up: '正在倾听 · 请直接说话或静音6秒进入休眠',
      hint_speaking_jarvis: 'J.A.R.V.I.S 正在说话...',
      subtitle_default: '点击麦克风或按空格键开始说话',
      engage_voice: "开启语音",
      stop_send: "■ 停止并发送",
      hands_free_on: "⚡ 免提模式: 开启",
      hands_free_off: "⚡ 免提模式: 关闭",
      stop: "停止",
      chat: "聊天",
      transcript: "对话记录",
      inspector: "系统监控",
      send: "发送",
      input_placeholder: "向 Jarvis 提问...（空格键说话）",
      voice_connected: "语音服务器已连接",
      voice_offline: "语音服务器离线",
      telemetry: "遥测数据",
      activity: "运行活动",
      views: "视图",
      models: "模型",
      template: "界面模板",
      language: "界面语言",
      stt_mode: "Whisper 识别"
    },
    ru: {
      dir: "ltr",
      name: "Русский (Russian)",
      standby: "ГОТОВ",
      listening: "СЛУШАЕТ",
      thinking: "ОБРАБОТКА",
      speaking: "ОТВЕЧАЕТ",
      working: "ВЫПОЛНЕНИЕ",
      error: "ОШИБКА",
      wake_detected: "АКТИВИРОВАН!",
      follow_up: "ПРОДОЛЖЕНИЕ",
      hint_standby_hf: 'СКАЖИТЕ "HEY JARVIS" ИЛИ НАЖМИТЕ МИКРОФОН',
      hint_standby_ptt: 'НАЖМИТЕ МИКРОФОН ИЛИ ПРОБЕЛ ДЛЯ РАЗГОВОРА',
      hint_speaking_pause: 'ГОВОРИТЕ... (ПАУЗА ДЛЯ ОТПРАВКИ)',
      hint_follow_up: 'СЛУШАЮ · ОТВЕТЬТЕ ИЛИ ПОДОЖДИТЕ 6с',
      hint_speaking_jarvis: 'J.A.R.V.I.S ГОВОРИТ...',
      subtitle_default: 'Нажмите на микрофон или пробел, чтобы говорить',
      engage_voice: "ГОЛОС",
      stop_send: "■ СТОП И ОТПРАВКА",
      hands_free_on: "⚡ БЕЗ РУК: ВКЛ",
      hands_free_off: "⚡ БЕЗ РУК: ВЫКЛ",
      stop: "СТОП",
      chat: "ЧАТ",
      transcript: "ТЕКСТ",
      inspector: "ИНСПЕКТОР",
      send: "ОТПРАВИТЬ",
      input_placeholder: "Спросите Jarvis... (Пробел для разговора)",
      voice_connected: "ГОЛОСОВОЙ СЕРВЕР ПОДКЛЮЧЕН",
      voice_offline: "ГОЛОСОВОЙ СЕРВЕР НЕ В СЕТИ",
      telemetry: "ТЕЛЕМЕТРИЯ",
      activity: "АКТИВНОСТЬ",
      views: "ОКНА",
      models: "МОДЕЛИ",
      template: "Шаблон",
      language: "Язык интерфейса",
      stt_mode: "Язык Whisper"
    },
    ja: {
      dir: "ltr",
      name: "日本語 (Japanese)",
      standby: "待機中",
      listening: "聞き取り中",
      thinking: "処理中",
      speaking: "応答中",
      working: "ツール実行中",
      error: "エラー",
      wake_detected: "ウェイクワード検出！",
      follow_up: "会話継続",
      hint_standby_hf: '「HEY JARVIS」と言うかマイクをクリック',
      hint_standby_ptt: 'マイクをクリックまたはスペースキーで発話',
      hint_speaking_pause: 'お話しください...（無音で自動送信）',
      hint_follow_up: '聞き取り中 · 返答するか6秒間無音でスリープ',
      hint_speaking_jarvis: 'J.A.R.V.I.S が話しています...',
      subtitle_default: 'マイクをクリックするかスペースキーを押して話しかけてください',
      engage_voice: "音声開始",
      stop_send: "■ 停止して送信",
      hands_free_on: "⚡ ハンズフリー: ON",
      hands_free_off: "⚡ ハンズフリー: OFF",
      stop: "停止",
      chat: "チャット",
      transcript: "文字起こし",
      inspector: "システム詳細",
      send: "送信",
      input_placeholder: "Jarvis に質問...（スペースキーで発話）",
      voice_connected: "音声サーバー接続完了",
      voice_offline: "音声サーバーオフライン",
      telemetry: "テレメトリ",
      activity: "アクティビティ",
      views: "ビュー",
      models: "モデル構成",
      template: "テンプレート",
      language: "言語",
      stt_mode: "Whisper 言語"
    }
  };

  const WHISPER_LANGUAGES = [
    { id: "auto", name: "Auto-Detect (خودکار)" },
    { id: "fa", name: "Persian (فارسی)" },
    { id: "en", name: "English" },
    { id: "es", name: "Spanish (Español)" },
    { id: "fr", name: "French (Français)" },
    { id: "de", name: "German (Deutsch)" },
    { id: "ar", name: "Arabic (العربية)" },
    { id: "zh", name: "Chinese (中文)" },
    { id: "ru", name: "Russian (Русский)" },
    { id: "ja", name: "Japanese (日本語)" },
    { id: "it", name: "Italian (Italiano)" },
    { id: "tr", name: "Turkish (Türkçe)" },
    { id: "hi", name: "Hindi (हिन्दी)" },
    { id: "pt", name: "Portuguese (Português)" }
  ];

  let currentLang = localStorage.getItem("jarvis_ui_lang") || "en";
  let currentSttLang = localStorage.getItem("jarvis_stt_lang") || "fa";

  const I18n = {
    TRANSLATIONS,
    WHISPER_LANGUAGES,

    get lang() {
      return currentLang;
    },

    get sttLang() {
      return currentSttLang;
    },

    t(key) {
      const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
      return dict[key] !== undefined ? dict[key] : (TRANSLATIONS.en[key] || key);
    },

    applyTranslations(root = document) {
      if (!root) return;
      root.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const val = this.t(key);
        if (val) el.textContent = val;
      });
      root.querySelectorAll("[data-i18n-ph]").forEach(el => {
        const key = el.getAttribute("data-i18n-ph");
        const val = this.t(key);
        if (val) el.placeholder = val;
      });
      root.querySelectorAll("[data-i18n-title]").forEach(el => {
        const key = el.getAttribute("data-i18n-title");
        const val = this.t(key);
        if (val) el.title = val;
      });
    },

    setLanguage(langCode) {
      if (!TRANSLATIONS[langCode]) return;
      currentLang = langCode;
      localStorage.setItem("jarvis_ui_lang", langCode);
      const dict = TRANSLATIONS[langCode];
      document.documentElement.lang = langCode;
      document.documentElement.dir = dict.dir || "ltr";

      this.applyTranslations(document);

      if (window.JarvisCore) {
        window.JarvisCore.emit("i18n_change", langCode);
        if (window.JarvisCore.state) {
          window.JarvisCore.setState(window.JarvisCore.state);
        }
      }
    },

    setSttLanguage(sttCode) {
      currentSttLang = sttCode;
      localStorage.setItem("jarvis_stt_lang", sttCode);
      if (window.JarvisCore) {
        if (typeof window.JarvisCore.setSttLanguage === "function") {
          window.JarvisCore.setSttLanguage(sttCode);
        } else {
          window.JarvisCore.sttLanguage = sttCode;
          window.JarvisCore.emit("stt_lang_change", sttCode);
        }
      }
    },

    init() {
      const savedLang = localStorage.getItem("jarvis_ui_lang");
      if (savedLang && TRANSLATIONS[savedLang]) {
        currentLang = savedLang;
      }
      const savedStt = localStorage.getItem("jarvis_stt_lang");
      if (savedStt) {
        currentSttLang = savedStt;
      }
      document.documentElement.lang = currentLang;
      document.documentElement.dir = TRANSLATIONS[currentLang]?.dir || "ltr";

      if (window.JarvisCore) {
        window.JarvisCore.sttLanguage = currentSttLang;
      }
      this.applyTranslations(document);
    }
  };

  window.I18n = I18n;
})(window);
