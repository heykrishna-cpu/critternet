// ==========================================================================
// PARTICLES.JS - 60fps Ambient Drift, Gauge Vortex & Confetti Explosions
// ==========================================================================

export class ParticleEngine {
  constructor() {
    this.ambientCanvas = document.getElementById('ambient-canvas');
    this.ambientCtx = this.ambientCanvas ? this.ambientCanvas.getContext('2d') : null;

    this.gaugeCanvas = document.getElementById('gauge-particles');
    this.gaugeCtx = this.gaugeCanvas ? this.gaugeCanvas.getContext('2d') : null;

    this.confettiCanvas = document.getElementById('confetti-canvas');
    this.confettiCtx = this.confettiCanvas ? this.confettiCanvas.getContext('2d') : null;

    this.ambientParticles = [];
    this.gaugeParticles = [];
    this.confettiPieces = [];

    this.gaugeActive = false;
    this.animating = true;

    this.init();
  }

  init() {
    this.resizeCanvases();
    window.addEventListener('resize', () => this.resizeCanvases());

    // Generate ambient background network particles
    const count = Math.min(Math.floor(window.innerWidth / 28), 50);
    this.ambientParticles = [];
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.35 + 0.15,
        color: Math.random() > 0.5 ? '#10b981' : '#06b6d4'
      });
    }

    this.loop();
  }

  resizeCanvases() {
    if (this.ambientCanvas) {
      this.ambientCanvas.width = window.innerWidth;
      this.ambientCanvas.height = window.innerHeight;
    }
    if (this.confettiCanvas) {
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    }
  }

  // Activate speedometer particles vortex (Section 1)
  setGaugeActive(active) {
    this.gaugeActive = active;
    if (active && this.gaugeCanvas) {
      // Spawn gauge ring particles
      for (let i = 0; i < 24; i++) {
        this.spawnGaugeParticle();
      }
    }
  }

  spawnGaugeParticle() {
    if (!this.gaugeCanvas) return;
    const cx = this.gaugeCanvas.width / 2;
    const cy = 200; // gauge center pivot
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 40 + 130;
    this.gaugeParticles.push({
      x: cx + Math.cos(angle) * distance,
      y: cy + Math.sin(angle) * distance,
      angle: angle,
      distance: distance,
      speed: Math.random() * 0.04 + 0.02,
      radius: Math.random() * 2.5 + 1.2,
      color: ['#06b6d4', '#10b981', '#f59e0b', '#f43f5e'][Math.floor(Math.random() * 4)],
      life: 1,
      decay: Math.random() * 0.015 + 0.008
    });
  }

  // Blast Confetti Celebration (Section 7 & 8)
  burstConfetti(type = 'rainbow', count = 120) {
    if (!this.confettiCanvas) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.4;
    const colors = type === 'gold' 
      ? ['#fbbf24', '#f59e0b', '#d97706', '#fef08a', '#ffffff'] 
      : ['#10b981', '#06b6d4', '#f43f5e', '#fbbf24', '#8b5cf6', '#3b82f6'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 16 + 8;
      this.confettiPieces.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 6,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }
  }

  loop() {
    this.updateAmbient();
    this.updateGauge();
    this.updateConfetti();

    if (this.animating) {
      requestAnimationFrame(() => this.loop());
    }
  }

  updateAmbient() {
    if (!this.ambientCtx || !this.ambientCanvas) return;
    const ctx = this.ambientCtx;
    const w = this.ambientCanvas.width;
    const h = this.ambientCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw particle network
    for (let i = 0; i < this.ambientParticles.length; i++) {
      const p = this.ambientParticles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      // Connect nearby particles with subtle lines
      for (let j = i + 1; j < this.ambientParticles.length; j++) {
        const p2 = this.ambientParticles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = '#06b6d4';
          ctx.globalAlpha = (1 - dist / 110) * 0.08;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  updateGauge() {
    if (!this.gaugeCtx || !this.gaugeCanvas) return;
    const ctx = this.gaugeCtx;
    const w = this.gaugeCanvas.width;
    const h = this.gaugeCanvas.height;
    const cx = w / 2;
    const cy = 200;

    ctx.clearRect(0, 0, w, h);

    if (this.gaugeActive) {
      if (this.gaugeParticles.length < 32 && Math.random() > 0.4) {
        this.spawnGaugeParticle();
      }
    }

    for (let i = this.gaugeParticles.length - 1; i >= 0; i--) {
      const p = this.gaugeParticles[i];
      p.angle += p.speed;
      p.x = cx + Math.cos(p.angle) * p.distance;
      p.y = cy + Math.sin(p.angle) * p.distance;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.gaugeParticles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.7;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  updateConfetti() {
    if (!this.confettiCtx || !this.confettiCanvas) return;
    const ctx = this.confettiCtx;
    const w = this.confettiCanvas.width;
    const h = this.confettiCanvas.height;

    ctx.clearRect(0, 0, w, h);
    if (this.confettiPieces.length === 0) return;

    for (let i = this.confettiPieces.length - 1; i >= 0; i--) {
      const c = this.confettiPieces[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.38; // gravity
      c.vx *= 0.985; // air drag
      c.rotation += c.rotSpeed;
      c.wobble += c.wobbleSpeed;

      if (c.y > h + 20) {
        this.confettiPieces.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.scale(Math.cos(c.wobble), 1);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = c.opacity;

      if (c.shape === 'rect') {
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
}
