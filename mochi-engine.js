/* =========================================================
   MOCHI LIFE ENGINE — CONTINUOUS AUTONOMOUS PET SIMULATION
   Phase 3 Architecture: Body • ScreenSpace • CompanionSurface • Internal State • Senses • Conceptual Zones • Behavior Priority • Brain • Voice
   ========================================================= */

/**
 * ScreenSpace: Coordinates, responsive viewport safe margins, and boundaries
 */
export class ScreenSpace {
  static getSafeBounds(margin = 24, petWidth = 76, petHeight = 76) {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;
    return {
      minX: margin,
      maxX: Math.max(margin, w - petWidth - margin),
      minY: margin,
      maxY: Math.max(margin, h - petHeight - margin),
      width: w,
      height: h,
      margin,
      petWidth,
      petHeight
    };
  }

  static clamp(x, y, margin = 24, petWidth = 76, petHeight = 76) {
    const b = ScreenSpace.getSafeBounds(margin, petWidth, petHeight);
    return {
      x: Math.max(b.minX, Math.min(b.maxX, x)),
      y: Math.max(b.minY, Math.min(b.maxY, y))
    };
  }
}

/**
 * CompanionSurface: Abstraction for Browser Viewport vs Document Picture-in-Picture
 */
export class CompanionSurface {
  constructor(name = 'BrowserViewportSurface') {
    this.name = name;
    this.isPiP = false;
    this.pipWindow = null;
  }
}

export class MochiLifeEngine {
  constructor(options = {}) {
    // 1. Persistent Internal State (Evolving continuous variables)
    const bounds = ScreenSpace.getSafeBounds();
    this.state = this.loadState() || {
      energy: 85,          // 0 (exhausted) to 100 (full stamina)
      happiness: 80,       // 0 (down) to 100 (blissful)
      curiosity: 65,       // 0 to 100 (drives exploration & wandering)
      boredom: 20,         // 0 to 100 (increases when idle too long)
      playfulness: 50,     // 0 to 100 (drives zoomies, pouncing, chasing)
      sleepiness: 25,      // 0 to 100 (accumulates over time)
      socialNeed: 35,      // 0 to 100 (increases when user hasn't interacted)
      
      // Somatic & Spatial (Screen-Space Viewport Coordinates)
      x: bounds.maxX - 40,
      y: bounds.maxY - 40,
      targetX: bounds.maxX - 40,
      targetY: bounds.maxY - 40,
      vx: 0,
      vy: 0,
      facing: -1,          // -1 = left, 1 = right
      headTilt: 0,         // degrees
      isSleeping: false,
      isLoafing: false,
      isStretching: false,
      isWalking: false,
      isZooming: false,
      isAffectionate: false,
      isEating: false,
      isDragging: false,
      isNearCursor: false,

      // Activity Arbitration
      currentActivity: 'IDLE_LOAF',
      currentZone: 'REST_ZONE',
      activityTimer: 8,    // seconds remaining in current activity
      lastInteractionTime: Date.now(),
      lastSpokenTime: Date.now() - 35000,
    };

    // 2. Senses & Environmental Context
    this.senses = {
      mouseX: bounds.width / 2,
      mouseY: bounds.height / 2,
      mouseVelocity: 0,
      lastMouseMoveTime: Date.now(),
      mouseIdleSeconds: 0,
      cursorDistance: 9999,
      cursorDwellSeconds: 0,
      cursorInterestDecay: 0,
      userIsTyping: false,
      lastTypingTime: 0,
      ambientSoundActive: false,
      isUserIdle: false,
      sessionDurationSeconds: 0,
      proactiveEnabled: true,
      cursorAwarenessEnabled: true,
      floatingModeEnabled: true,
    };

    // 3. Surface Abstraction
    this.surface = new CompanionSurface('BrowserViewportSurface');

    // 4. Callbacks & Listeners
    this.onSpeechRequested = options.onSpeechRequested || null;
    this.onStateChanged = options.onStateChanged || null;
    this.onParticleSpawn = options.onParticleSpawn || null;

    // 5. Runtime & Heartbeat
    this.lastTickTime = performance.now();
    this.initEventListeners();
    this.initDraggableCompanion();
    this.startHeartbeat();
  }

  // Load persistent creature life from local storage
  loadState() {
    try {
      const saved = localStorage.getItem('mochi_living_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        const clamped = ScreenSpace.clamp(parsed.x || 1000, parsed.y || 700);
        parsed.x = clamped.x;
        parsed.y = clamped.y;
        parsed.targetX = parsed.x;
        parsed.targetY = parsed.y;
        parsed.isDragging = false;
        return parsed;
      }
    } catch (e) {}
    return null;
  }

  saveState() {
    try {
      localStorage.setItem('mochi_living_state', JSON.stringify(this.state));
    } catch (e) {}
  }

  initEventListeners() {
    let lastMx = 0, lastMy = 0, lastMTime = performance.now();

    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastMTime);
      const dist = Math.hypot(e.clientX - lastMx, e.clientY - lastMy);
      this.senses.mouseVelocity = (dist / dt) * 1000;
      this.senses.mouseX = e.clientX;
      this.senses.mouseY = e.clientY;
      this.senses.lastMouseMoveTime = Date.now();
      lastMx = e.clientX;
      lastMy = e.clientY;
      lastMTime = now;

      // Distance to Mochi
      const dToMochi = Math.hypot(e.clientX - this.state.x, e.clientY - this.state.y);
      this.senses.cursorDistance = dToMochi;

      if (dToMochi < 140 && this.senses.cursorAwarenessEnabled) {
        this.senses.cursorDwellSeconds += 0.05;
        this.senses.cursorInterestDecay = 8; // Reset interest decay
        if (!this.state.isSleeping && !this.state.isDragging) {
          // Face cursor
          this.state.facing = e.clientX > this.state.x ? 1 : -1;
          this.state.headTilt = (e.clientY < this.state.y ? -10 : 8) * (this.state.facing);
        }
      }
    }, { passive: true });

    window.addEventListener('keydown', () => {
      this.senses.userIsTyping = true;
      this.senses.lastTypingTime = Date.now();
    }, { passive: true });

    window.addEventListener('resize', () => {
      const clamped = ScreenSpace.clamp(this.state.x, this.state.y);
      this.state.x = clamped.x;
      this.state.y = clamped.y;
      this.state.targetX = clamped.x;
      this.state.targetY = clamped.y;
    });
  }

  // =========================================================
  // DRAGGABLE FLOATING COMPANION LAYER
  // =========================================================
  initDraggableCompanion() {
    let isMouseDown = false;
    let startX = 0, startY = 0;
    let initialX = 0, initialY = 0;

    const onPointerDown = (e) => {
      const target = e.target.closest('#floating-pet-ball');
      if (!target) return;
      isMouseDown = true;
      this.state.isDragging = true;
      this.state.isWalking = false;
      this.state.isZooming = false;
      this.state.isSleeping = false;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      startX = clientX;
      startY = clientY;
      initialX = this.state.x;
      initialY = this.state.y;
      this.state.headTilt = 15;
    };

    const onPointerMove = (e) => {
      if (!isMouseDown || !this.state.isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const dx = clientX - startX;
      const dy = clientY - startY;

      const clamped = ScreenSpace.clamp(initialX + dx, initialY + dy);
      this.state.x = clamped.x;
      this.state.y = clamped.y;
      this.state.targetX = clamped.x;
      this.state.targetY = clamped.y;
    };

    const onPointerUp = () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      this.state.isDragging = false;
      this.state.lastInteractionTime = Date.now();
      this.state.happiness = Math.min(100, this.state.happiness + 8);
      this.state.headTilt = 0;

      // Soft settle into current location
      this.transitionToActivity('IDLE_LOAF', 6);
      if (this.onParticleSpawn) this.onParticleSpawn('🐾', 2);
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });
  }

  // =========================================================
  // CONCEPTUAL PET ZONES (SCREEN-SPACE MAPPING)
  // =========================================================
  getConceptualZoneCoordinates(zoneType) {
    const b = ScreenSpace.getSafeBounds(32, 76, 76);

    switch (zoneType) {
      case 'REST_ZONE':
        // Bottom right quiet corner or quiet safe margin
        return {
          x: b.maxX - 30,
          y: b.maxY - 30
        };
      case 'PLAY_ZONE':
        // Open middle quadrants during zoomies
        return {
          x: b.minX + Math.random() * (b.maxX - b.minX),
          y: b.minY + Math.random() * (b.maxY - b.minY) * 0.7
        };
      case 'ATTENTION_ZONE':
        // Near active cursor or user focus point (with comfortable offset)
        if (this.senses.cursorAwarenessEnabled && this.senses.mouseX > 0) {
          const offset = Math.random() > 0.5 ? 95 : -95;
          return ScreenSpace.clamp(this.senses.mouseX + offset, this.senses.mouseY + 35, 32, 76, 76);
        }
        return { x: b.width * 0.5, y: b.maxY - 80 };
      case 'EDGE_ZONE':
        // Along bottom or side screen edges like classic desktop pets (Neko)
        const edgeChoice = Math.random();
        if (edgeChoice < 0.6) {
          // Bottom edge
          return {
            x: b.minX + Math.random() * (b.maxX - b.minX),
            y: b.maxY - 10
          };
        } else if (edgeChoice < 0.8) {
          // Right edge
          return {
            x: b.maxX - 10,
            y: b.minY + Math.random() * (b.maxY - b.minY)
          };
        } else {
          // Left edge
          return {
            x: b.minX + 10,
            y: b.minY + Math.random() * (b.maxY - b.minY)
          };
        }
      case 'CENTER_ZONE':
      default:
        return {
          x: b.width * 0.5 + (Math.random() * 140 - 70),
          y: b.height * 0.55 + (Math.random() * 100 - 50)
        };
    }
  }

  // =========================================================
  // EVENT PIPELINE: CONSUME CONTEXT EVENTS
  // =========================================================
  handleContextEvent(event, data = {}) {
    const s = this.state;
    const now = Date.now();

    switch (event) {
      case 'USER_ACTIVE':
        s.boredom = Math.max(0, s.boredom - 5);
        if (s.isSleeping && Math.random() < 0.25) {
          // Softly wake up
          this.transitionToActivity('IDLE_LOAF', 6);
        }
        break;

      case 'USER_IDLE':
        this.senses.isUserIdle = true;
        s.sleepiness = Math.min(100, s.sleepiness + 15);
        s.curiosity = Math.max(10, s.curiosity - 10);
        if (!s.isSleeping && Math.random() < 0.6) {
          this.transitionToActivity('IDLE_LOAF', 15);
        }
        break;

      case 'USER_RETURNED':
        this.senses.isUserIdle = false;
        if (s.isSleeping) {
          // Wake up with a cute stretch
          this.transitionToActivity('STRETCHING', 4);
          if (this.onParticleSpawn) this.onParticleSpawn('✨', 3);
        } else {
          s.headTilt = 10;
          s.curiosity = Math.min(100, s.curiosity + 15);
        }
        break;

      case 'CURSOR_NEAR_MOCHI':
        if (this.senses.cursorAwarenessEnabled && !s.isSleeping && !s.isDragging) {
          s.curiosity = Math.min(100, s.curiosity + 12);
          s.socialNeed = Math.max(0, s.socialNeed - 10);
          this.state.isNearCursor = true;
          if (s.currentActivity === 'IDLE_LOAF' && Math.random() < 0.4) {
            this.transitionToActivity('WATCHING_CURSOR', 5);
          }
        }
        break;

      case 'CURSOR_LEFT_MOCHI':
        this.state.isNearCursor = false;
        break;

      case 'USER_PETTED_MOCHI':
        this.userPetCreature();
        break;

      case 'LONG_SESSION':
        if (this.canInitiateProactiveSpeech() && this.onSpeechRequested) {
          this.onSpeechRequested('LONG_SESSION_STRETCH');
          s.lastSpokenTime = now;
        }
        break;

      case 'SETTINGS_CHANGED':
        if (data) {
          this.senses.proactiveEnabled = data.proactiveEnabled ?? true;
          this.senses.cursorAwarenessEnabled = data.cursorAwarenessEnabled ?? true;
        }
        break;
    }
  }

  // =========================================================
  // INTERRUPTION INTELLIGENCE RULES
  // =========================================================
  canInitiateProactiveSpeech() {
    const s = this.state;
    const now = Date.now();

    // 1. Check user proactive preference
    if (!this.senses.proactiveEnabled) return false;

    // 2. Do NOT interrupt active keyboard typing
    if (this.senses.userIsTyping) return false;

    // 3. Cooldown since last spoken (minimum 40s)
    if (now - s.lastSpokenTime < 40000) return false;

    // 4. Do not speak while sleeping or dragging
    if (s.isSleeping || s.isDragging) return false;

    // 5. Must have high social need or meaningful context
    if (s.socialNeed > 70 || this.senses.isUserIdle) {
      return true;
    }

    return false;
  }

  // =========================================================
  // CONTINUOUS HEARTBEAT LOOP (Runs at 20Hz / 50ms)
  // =========================================================
  startHeartbeat() {
    setInterval(() => {
      const now = performance.now();
      const dt = (now - this.lastTickTime) / 1000;
      this.lastTickTime = now;

      this.updateInternalState(dt);
      this.evaluateSensoryEnvironment(dt);
      this.arbitrateBehavior(dt);
      this.stepPhysicsAndMovement(dt);
      this.renderBodyState();
    }, 50);

    // Occasional state save to disk
    setInterval(() => this.saveState(), 5000);
  }

  // =========================================================
  // 1. INTERNAL STATE DRIFT
  // =========================================================
  updateInternalState(dt) {
    const s = this.state;
    const now = Date.now();
    const timeSinceInteraction = (now - s.lastInteractionTime) / 1000;

    if (s.isSleeping) {
      s.energy = Math.min(100, s.energy + 2.5 * dt);
      s.sleepiness = Math.max(0, s.sleepiness - 3.5 * dt);
      s.boredom = Math.max(0, s.boredom - 1.0 * dt);
    } else {
      s.energy = Math.max(5, s.energy - 0.4 * dt);
      s.sleepiness = Math.min(100, s.sleepiness + 0.35 * dt);
      s.boredom = Math.min(100, s.boredom + 0.45 * dt);

      if (timeSinceInteraction > 40) {
        s.socialNeed = Math.min(100, s.socialNeed + 0.5 * dt);
      }
    }

    if (s.energy > 60 && !s.isSleeping) {
      s.playfulness = Math.min(100, s.playfulness + 0.35 * dt);
      s.curiosity = Math.min(100, s.curiosity + 0.3 * dt);
    }

    // Sleepiness threshold triggers nap in REST_ZONE
    if (s.sleepiness > 85 && s.currentActivity !== 'NAPPING' && s.currentActivity !== 'CONVERSING' && !s.isDragging) {
      this.transitionToActivity('NAPPING', Math.random() * 20 + 25);
    }
  }

  // =========================================================
  // 2. SENSORY ENVIRONMENT EVALUATION
  // =========================================================
  evaluateSensoryEnvironment(dt) {
    const now = Date.now();
    this.senses.mouseIdleSeconds = (now - this.senses.lastMouseMoveTime) / 1000;
    this.senses.userIsTyping = (now - this.senses.lastTypingTime) < 2500;

    if (this.senses.cursorInterestDecay > 0) {
      this.senses.cursorInterestDecay -= dt;
    }
  }

  // =========================================================
  // 3. BEHAVIOR ARBITRATION & PRIORITY HIERARCHY
  // =========================================================
  arbitrateBehavior(dt) {
    const s = this.state;
    if (s.isDragging) return;

    s.activityTimer -= dt;

    if (s.currentActivity === 'CONVERSING' || s.currentActivity === 'BEING_PET') {
      return;
    }

    if (s.activityTimer <= 0) {
      this.chooseNextEmergentBehavior();
    }
  }

  chooseNextEmergentBehavior() {
    const s = this.state;

    // 1. Fatigue / Exhaustion -> REST_ZONE Nap
    if (s.sleepiness > 70 || s.energy < 15) {
      this.transitionToActivity('NAPPING', Math.random() * 25 + 20);
      return;
    }

    // 2. High Social Need -> ATTENTION_ZONE Check-in
    if (s.socialNeed > 65 && Math.random() < 0.65) {
      this.transitionToActivity('SEEKING_ATTENTION', Math.random() * 8 + 6);
      return;
    }

    // 3. High Playfulness -> PLAY_ZONE Zoomies
    if (s.playfulness > 60 && s.energy > 40 && Math.random() < 0.5) {
      this.transitionToActivity('ZOOMIES', Math.random() * 6 + 4);
      return;
    }

    // 4. High Curiosity -> WANDERING across Zones
    if (s.curiosity > 50 && Math.random() < 0.6) {
      this.transitionToActivity('WANDERING', Math.random() * 7 + 4);
      return;
    }

    // 5. Default Organic Activities (Embracing the Quiet Presence)
    const organicBehaviors = [
      { act: 'IDLE_LOAF', dur: Math.random() * 12 + 8, zone: 'EDGE_ZONE' },
      { act: 'STRETCHING', dur: Math.random() * 4 + 3, zone: 'REST_ZONE' },
      { act: 'WATCHING_CURSOR', dur: Math.random() * 8 + 5, zone: 'ATTENTION_ZONE' },
      { act: 'LOOKING_AROUND', dur: Math.random() * 6 + 4, zone: 'CENTER_ZONE' },
      { act: 'GROOMING_PAWS', dur: Math.random() * 5 + 4, zone: 'EDGE_ZONE' }
    ];

    const pick = organicBehaviors[Math.floor(Math.random() * organicBehaviors.length)];
    this.transitionToActivity(pick.act, pick.dur, pick.zone);
  }

  transitionToActivity(actName, duration, targetZone = null) {
    const s = this.state;
    s.currentActivity = actName;
    s.activityTimer = duration;

    // Somatic states
    s.isSleeping = (actName === 'NAPPING');
    s.isLoafing = (actName === 'IDLE_LOAF');
    s.isStretching = (actName === 'STRETCHING');
    s.isZooming = (actName === 'ZOOMIES');
    s.isWalking = (actName === 'WANDERING' || actName === 'SEEKING_ATTENTION' || actName === 'ZOOMIES');

    // Determine conceptual target zone
    let zone = targetZone;
    if (!zone) {
      if (actName === 'NAPPING') zone = 'REST_ZONE';
      else if (actName === 'SEEKING_ATTENTION') zone = 'ATTENTION_ZONE';
      else if (actName === 'ZOOMIES') zone = 'PLAY_ZONE';
      else if (actName === 'WANDERING') zone = 'EDGE_ZONE';
      else zone = 'REST_ZONE';
    }
    s.currentZone = zone;

    const coords = this.getConceptualZoneCoordinates(zone);
    s.targetX = coords.x;
    s.targetY = coords.y;

    if (actName === 'SEEKING_ATTENTION') {
      s.headTilt = 12;
      if (this.canInitiateProactiveSpeech() && this.onSpeechRequested) {
        this.onSpeechRequested('ATTENTION_CHECKIN');
        s.lastSpokenTime = Date.now();
      }
    } else if (actName === 'ZOOMIES') {
      s.boredom = Math.max(0, s.boredom - 40);
      s.playfulness = Math.max(10, s.playfulness - 30);
      if (this.onParticleSpawn) this.onParticleSpawn('⚡', 6);
    } else if (actName === 'STRETCHING') {
      s.headTilt = -8;
      if (this.onParticleSpawn) this.onParticleSpawn('🐾', 2);
    } else if (actName === 'NAPPING') {
      if (this.onParticleSpawn) this.onParticleSpawn('💤', 4);
    }

    if (this.onStateChanged) {
      this.onStateChanged(this.state);
    }
  }

  // =========================================================
  // 4. PHYSICS & SPATIAL MOVEMENT
  // =========================================================
  stepPhysicsAndMovement(dt) {
    const s = this.state;
    if (s.isDragging) return;

    if (s.isWalking || s.isZooming) {
      const dx = s.targetX - s.x;
      const dy = s.targetY - s.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 8) {
        const speed = s.isZooming ? 320 : 95; // Pixels per second
        const moveDist = Math.min(dist, speed * dt);
        s.x += (dx / dist) * moveDist;
        s.y += (dy / dist) * moveDist;
        s.facing = dx > 0 ? 1 : -1;
      } else {
        s.isWalking = false;
        s.isZooming = false;
      }
    }

    const clamped = ScreenSpace.clamp(s.x, s.y, 24, 76, 76);
    s.x = clamped.x;
    s.y = clamped.y;
  }

  // =========================================================
  // 5. USER SENSORY INTERACTIONS
  // =========================================================
  userPetCreature() {
    const s = this.state;
    s.lastInteractionTime = Date.now();
    s.happiness = Math.min(100, s.happiness + 20);
    s.socialNeed = Math.max(0, s.socialNeed - 35);
    s.boredom = Math.max(0, s.boredom - 25);
    s.sleepiness = Math.max(0, s.sleepiness - 15);
    s.isAffectionate = true;

    this.transitionToActivity('BEING_PET', 3.5);
    if (this.onParticleSpawn) this.onParticleSpawn('❤️', 5);
  }

  userFeedTreat() {
    const s = this.state;
    s.lastInteractionTime = Date.now();
    s.energy = Math.min(100, s.energy + 30);
    s.happiness = Math.min(100, s.happiness + 25);
    s.boredom = Math.max(0, s.boredom - 20);
    
    this.transitionToActivity('EATING_TREAT', 4.0);
    if (this.onParticleSpawn) this.onParticleSpawn('🐟', 4);
  }

  userInitiateDialogue() {
    const s = this.state;
    s.lastInteractionTime = Date.now();
    s.socialNeed = Math.max(0, s.socialNeed - 40);
    this.transitionToActivity('CONVERSING', 12.0);
  }

  // =========================================================
  // 6. RENDER BODY & ON-SCREEN SPRITE
  // =========================================================
  renderBodyState() {
    const s = this.state;
    const widget = document.getElementById('floating-pet-ball');
    if (!widget) return;

    widget.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;

    const core = document.getElementById('widget-ball-core');
    if (core) {
      core.style.transform = `scaleX(${s.facing}) rotate(${s.headTilt}deg)`;
    }

    const eyes = widget.querySelectorAll('.w-eye');
    eyes.forEach(e => {
      e.classList.toggle('closed', s.isSleeping);
    });

    const tooltip = document.getElementById('widget-speech-tooltip');
    if (tooltip && !s.isDragging) {
      const map = {
        'NAPPING': '💤 Mochi is sleeping peacefully',
        'SEEKING_ATTENTION': '🐾 Mochi stepped closer to say hello',
        'ZOOMIES': '⚡ Zoomies! Mochi is having fun',
        'WANDERING': '🌿 Mochi is exploring the desk',
        'STRETCHING': '🐱 Mochi does a big cat stretch',
        'WATCHING_CURSOR': '👁️ Mochi is watching your cursor',
        'IDLE_LOAF': '🍞 Mochi is loafing cozy beside you',
        'BEING_PET': '💕 Purrrrr... Mochi loves your scratches',
        'EATING_TREAT': '🐟 Nom nom! Yummy salmon',
        'CONVERSING': '🎙️ Mochi is listening with warm ears'
      };
      tooltip.querySelector('span').textContent = map[s.currentActivity] || '🐾 Mochi is with you';
    }
  }
}
