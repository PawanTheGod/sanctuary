/* =========================================================
   SANCTUARY — CONTEXT PROVIDER ARCHITECTURE
   Abstract Base Context Provider & Browser Implementation
   Desktop-Ready: Ready for Electron / Tauri DesktopContextProvider
   ========================================================= */

/**
 * Base ContextProvider interface
 * Decouples MochiLifeEngine from the hosting environment (Browser vs Desktop OS)
 */
export class ContextProvider {
  constructor() {
    this.listeners = new Map();
    this.context = {
      activityLevel: 'LOW',         // 'HIGH' | 'LOW' | 'IDLE'
      userIdle: false,
      idleSeconds: 0,
      sessionSeconds: 0,
      timeSinceLastInteraction: 0,
      userIsTyping: false,
      voiceActive: false,
      cursorPosition: { x: 0, y: 0 },
      cursorVelocity: 0,
      isCursorNearMochi: false,
      activeTab: 'companion-space',
    };
    this.settings = {
      presenceEnabled: true,
      cursorAwarenessEnabled: true,
      activityAwarenessEnabled: true,
      proactiveEnabled: true,
      voiceEnabled: true,
      micEnabled: true,
      screenAwarenessEnabled: false, // Strict zero-recording default
    };
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const list = this.listeners.get(event).filter(cb => cb !== callback);
    this.listeners.set(event, list);
  }

  emit(event, data = {}) {
    const list = this.listeners.get(event);
    if (list) {
      list.forEach(cb => {
        try { cb(event, data, this.context); } catch (e) { console.error(e); }
      });
    }
  }

  getContext() {
    return { ...this.context };
  }

  getSettings() {
    return { ...this.settings };
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.emit('SETTINGS_CHANGED', this.settings);
  }

  destroy() {
    this.listeners.clear();
  }
}

/**
 * BrowserContextProvider
 * Aggregates DOM events, window focus, keyboard activity, and cursor proximity
 */
export class BrowserContextProvider extends ContextProvider {
  constructor(options = {}) {
    super();

    this.mochiEngine = options.mochiEngine || null;
    this.lastMouseMove = Date.now();
    this.lastTyping = 0;
    this.sessionStartTime = Date.now();
    this.lastInteractionTime = Date.now();
    this.lastCalculatedSpeed = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.dwellTimer = null;
    this.nearDwellSeconds = 0;

    // Load persisted privacy settings
    this.loadSavedSettings();

    this.initBrowserListeners();
    this.startContextPoller();
  }

  loadSavedSettings() {
    try {
      const saved = localStorage.getItem('sanctuary_privacy_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (e) {}
  }

  saveSettings() {
    try {
      localStorage.setItem('sanctuary_privacy_settings', JSON.stringify(this.settings));
    } catch (e) {}
  }

  initBrowserListeners() {
    let lastEventTime = performance.now();

    // Throttled mouse move listener
    window.addEventListener('mousemove', (e) => {
      if (!this.settings.cursorAwarenessEnabled) return;

      const now = performance.now();
      const dt = Math.max(1, now - lastEventTime);
      const dist = Math.hypot(e.clientX - this.lastX, e.clientY - this.lastY);
      
      this.context.cursorVelocity = (dist / dt) * 1000;
      this.context.cursorPosition.x = e.clientX;
      this.context.cursorPosition.y = e.clientY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.lastEventTime = now;
      this.lastMouseMove = Date.now();

      if (this.context.userIdle) {
        this.context.userIdle = false;
        this.emit('USER_RETURNED', { time: Date.now() });
      }
      this.context.activityLevel = this.context.cursorVelocity > 500 ? 'HIGH' : 'LOW';

      // Check proximity to Mochi
      this.checkMochiCursorProximity(e.clientX, e.clientY);
    }, { passive: true });

    // Keyboard typing listener (tracks focus/active work without capturing keystrokes)
    window.addEventListener('keydown', (e) => {
      if (!this.settings.activityAwarenessEnabled) return;

      this.lastTyping = Date.now();
      this.context.userIsTyping = true;
      this.context.activityLevel = 'HIGH';

      if (this.context.userIdle) {
        this.context.userIdle = false;
        this.emit('USER_RETURNED', { time: Date.now() });
      }

      this.emit('USER_ACTIVE', { source: 'keyboard' });
    }, { passive: true });

    // Window focus/blur
    window.addEventListener('blur', () => {
      this.emit('WINDOW_BLUR', {});
    });

    window.addEventListener('focus', () => {
      this.emit('WINDOW_FOCUS', {});
      if (this.context.userIdle) {
        this.context.userIdle = false;
        this.emit('USER_RETURNED', { time: Date.now() });
      }
    });
  }

  checkMochiCursorProximity(mx, my) {
    if (!this.mochiEngine) return;

    const mState = this.mochiEngine.state;
    const dist = Math.hypot(mx - mState.x, my - mState.y);
    const isNear = dist < 140;

    if (isNear && !this.context.isCursorNearMochi) {
      this.context.isCursorNearMochi = true;
      this.emit('CURSOR_NEAR_MOCHI', { distance: dist, x: mx, y: my });
    } else if (!isNear && this.context.isCursorNearMochi) {
      this.context.isCursorNearMochi = false;
      this.emit('CURSOR_LEFT_MOCHI', { distance: dist });
    }
  }

  startContextPoller() {
    // Lightweight 1Hz poller for aggregate status
    this.pollInterval = setInterval(() => {
      const now = Date.now();
      this.context.sessionSeconds = Math.floor((now - this.sessionStartTime) / 1000);
      this.context.idleSeconds = Math.floor((now - this.lastMouseMove) / 1000);
      this.context.timeSinceLastInteraction = Math.floor((now - this.lastInteractionTime) / 1000);
      this.context.userIsTyping = (now - this.lastTyping) < 2500;

      // Detect idle threshold (> 45s of no mouse/keyboard)
      if (this.context.idleSeconds > 45 && !this.context.userIdle) {
        this.context.userIdle = true;
        this.context.activityLevel = 'IDLE';
        this.emit('USER_IDLE', { idleSeconds: this.context.idleSeconds });
      }

      // Long session milestone (> 25 minutes)
      if (this.context.sessionSeconds > 0 && this.context.sessionSeconds % 1500 === 0) {
        this.emit('LONG_SESSION', { minutes: Math.floor(this.context.sessionSeconds / 60) });
      }
    }, 1000);
  }

  notifyUserInteraction(type = 'CLICK') {
    this.lastInteractionTime = Date.now();
    this.context.timeSinceLastInteraction = 0;
    this.emit('USER_PETTED_MOCHI', { type });
  }

  setVoiceActive(isActive) {
    this.context.voiceActive = isActive;
    this.emit(isActive ? 'VOICE_STARTED' : 'VOICE_ENDED', {});
  }

  destroy() {
    super.destroy();
    clearInterval(this.pollInterval);
  }
}
