// ==========================================================================
// AUDIOSYNTH.JS - Zero-Dependency Web Audio API Cartoon Sound Synthesizer
// ==========================================================================

class CartoonAudioSynth {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // ── Utility: create a white-noise buffer ───────────────────────────────────
  _makeNoise(durationSec) {
    const sr = this.ctx.sampleRate;
    const buf = this.ctx.createBuffer(1, Math.ceil(sr * durationSec), sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ── 1. Tactile button click ────────────────────────────────────────────────
  playClick() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + 0.05);
  }

  // ── 2. Subtle hover micro-tick ────────────────────────────────────────────
  playHover() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + 0.04);
  }

  // ── 3. Countdown beep (3… 2… 1…) ─────────────────────────────────────────
  playCountdown(freq = 440) {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + 0.15);
  }

  // ── 4. Comic whirring needle tick ─────────────────────────────────────────
  playNeedleTick(pitch = 300) {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(pitch, now);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + 0.04);
  }

  // ── 5. Cinematic whoosh (dramatic overlay entrance) ───────────────────────
  playWhoosh() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Filtered noise sweep
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._makeNoise(0.55);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(120, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.45);
    filter.Q.value = 1.8;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    noise.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
    noise.start(now); noise.stop(now + 0.55);

    // Low rumble underpinning
    const rumble = this.ctx.createOscillator();
    const rg = this.ctx.createGain();
    rumble.type = 'sine';
    rumble.frequency.setValueAtTime(55, now);
    rumble.frequency.linearRampToValueAtTime(28, now + 0.4);
    rg.gain.setValueAtTime(0.28, now);
    rg.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    rumble.connect(rg); rg.connect(this.ctx.destination);
    rumble.start(now); rumble.stop(now + 0.4);
  }

  // ── 6. Comic slip / drop ──────────────────────────────────────────────────
  playSlip() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.35);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + 0.35);
  }

  // ── 7. Digital Wi-Fi packet glitch (buffering drop) ──────────────────────
  playBufferGlitch() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Three rapid stutter blips
    [0, 0.07, 0.13].forEach((offset, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      const freq = 220 * Math.pow(2, i * 0.5);
      osc.frequency.setValueAtTime(freq, now + offset);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + offset + 0.05);
      gain.gain.setValueAtTime(0.14, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now + offset); osc.stop(now + offset + 0.07);
    });

    // Noise crackle
    const crackle = this.ctx.createBufferSource();
    crackle.buffer = this._makeNoise(0.12);
    const cf = this.ctx.createBiquadFilter();
    cf.type = 'highpass'; cf.frequency.value = 2000;
    const cg = this.ctx.createGain();
    cg.gain.setValueAtTime(0.18, now + 0.05);
    cg.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    crackle.connect(cf); cf.connect(cg); cg.connect(this.ctx.destination);
    crackle.start(now + 0.05); crackle.stop(now + 0.2);
  }

  // ── 8. Dramatic BOOM! bass drop ───────────────────────────────────────────
  playBoom() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.6);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + 0.6);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this._makeNoise(0.1);
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass'; noiseFilter.frequency.value = 400;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(this.ctx.destination);
    noise.start(now);
  }

  // ── 9. Sparkling chime for unit card reveals ──────────────────────────────
  playChime() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    // Two-tone bell shimmer
    [[1047, 0], [1319, 0.06], [1568, 0.11]].forEach(([freq, delay]) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      gain.gain.setValueAtTime(0.12, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.45);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now + delay); osc.stop(now + delay + 0.5);
    });
  }

  // ── 10. Rising arpeggio for personality / mood reveal ─────────────────────
  playResultReveal() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.26]; // C E G C E
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.075);
      gain.gain.setValueAtTime(0.14, now + i * 0.075);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.075 + 0.3);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now + i * 0.075); osc.stop(now + i * 0.075 + 0.35);
    });
  }

  // ── 11. Victory fanfare for final confetti ────────────────────────────────
  playFanfare() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const notes = [261.63, 329.63, 392.00, 523.25];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.09;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(startTime); osc.stop(startTime + 0.25);
    });
  }

  // ── 12. Rich achievement unlock chord ────────────────────────────────────
  playUnlockChord() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    // Major 7th chord: C4 E4 G4 B4, staggered + shimmer
    const chord = [261.63, 329.63, 392.00, 493.88, 523.25];
    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i < 4 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      gain.gain.setValueAtTime(0.15, now + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now + i * 0.04); osc.stop(now + 1.3);
    });

    // Gold shimmer sparkle on top
    [2093, 2637].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.1 + i * 0.07);
      gain.gain.setValueAtTime(0.08, now + 0.1 + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55 + i * 0.07);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now + 0.1 + i * 0.07); osc.stop(now + 0.6 + i * 0.07);
    });
  }

  // ── 13. Trophy drawer slide-in sweep ─────────────────────────────────────
  playDrawerOpen() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const noise = this.ctx.createBufferSource();
    noise.buffer = this._makeNoise(0.35);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3000, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.3);
    filter.Q.value = 2;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    noise.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
    noise.start(now); noise.stop(now + 0.38);

    // Warm thump
    const thump = this.ctx.createOscillator();
    const tg = this.ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(120, now);
    thump.frequency.exponentialRampToValueAtTime(60, now + 0.18);
    tg.gain.setValueAtTime(0.22, now);
    tg.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    thump.connect(tg); tg.connect(this.ctx.destination);
    thump.start(now); thump.stop(now + 0.22);
  }

  // ── 14. Animal-specific voice sounds ──────────────────────────────────────
  playAnimalVoice(animalId) {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    switch (animalId) {
      case 'snail': {
        // Slow, slimy glide down
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(320, now);
        o.frequency.linearRampToValueAtTime(180, now + 0.6);
        g.gain.setValueAtTime(0.16, now);
        g.gain.linearRampToValueAtTime(0.05, now + 0.5);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(now); o.stop(now + 0.75);
        break;
      }
      case 'sloth': {
        // Deep, lazy yawn descend
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(130, now);
        o.frequency.linearRampToValueAtTime(90, now + 0.9);
        g.gain.setValueAtTime(0.2, now);
        g.gain.linearRampToValueAtTime(0.0, now + 0.95);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(now); o.stop(now + 1.0);
        break;
      }
      case 'turtle': {
        // Short, steady plod beep
        [0, 0.18].forEach(d => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(220, now + d);
          g.gain.setValueAtTime(0.14, now + d);
          g.gain.exponentialRampToValueAtTime(0.001, now + d + 0.14);
          o.connect(g); g.connect(this.ctx.destination);
          o.start(now + d); o.stop(now + d + 0.18);
        });
        break;
      }
      case 'hedgehog': {
        // Rapid high-pitched sniff-trot
        [0, 0.08, 0.16, 0.22].forEach((d, i) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(880 + i * 110, now + d);
          g.gain.setValueAtTime(0.10, now + d);
          g.gain.exponentialRampToValueAtTime(0.001, now + d + 0.07);
          o.connect(g); g.connect(this.ctx.destination);
          o.start(now + d); o.stop(now + d + 0.09);
        });
        break;
      }
      case 'rabbit': {
        // Boing spring bounce
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(200, now);
        o.frequency.exponentialRampToValueAtTime(900, now + 0.12);
        o.frequency.exponentialRampToValueAtTime(400, now + 0.28);
        g.gain.setValueAtTime(0.2, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(now); o.stop(now + 0.35);
        break;
      }
      case 'cheetah': {
        // Ferocious sawtooth roar
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.linearRampToValueAtTime(3500, now + 0.1);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.45);
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(80, now);
        o.frequency.linearRampToValueAtTime(140, now + 0.08);
        o.frequency.linearRampToValueAtTime(60, now + 0.45);
        g.gain.setValueAtTime(0.28, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        o.connect(filter); filter.connect(g); g.connect(this.ctx.destination);
        o.start(now); o.stop(now + 0.52);
        break;
      }
      case 'frog': {
        // Ribbit: two-part croak
        [0, 0.22].forEach((d, i) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.type = 'square';
          o.frequency.setValueAtTime(i === 0 ? 180 : 140, now + d);
          o.frequency.exponentialRampToValueAtTime(i === 0 ? 110 : 80, now + d + 0.12);
          g.gain.setValueAtTime(0.16, now + d);
          g.gain.exponentialRampToValueAtTime(0.001, now + d + 0.15);
          o.connect(g); g.connect(this.ctx.destination);
          o.start(now + d); o.stop(now + d + 0.18);
        });
        break;
      }
      case 'cat': {
        // Purr: amplitude-modulated tone
        const o = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        const g = this.ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.value = 110;
        lfo.type = 'sine';
        lfo.frequency.value = 22; // purr rate
        lfoGain.gain.value = 0.12;
        lfo.connect(lfoGain); lfoGain.connect(g.gain);
        g.gain.setValueAtTime(0.14, now);
        g.gain.linearRampToValueAtTime(0.0, now + 0.55);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(now); lfo.start(now);
        o.stop(now + 0.58); lfo.stop(now + 0.58);
        break;
      }
      case 'squirrel': {
        // Hyper chittering
        [0, 0.05, 0.10, 0.15, 0.20].forEach((d, i) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.type = 'square';
          o.frequency.setValueAtTime(1200 + (i % 2) * 400, now + d);
          g.gain.setValueAtTime(0.08, now + d);
          g.gain.exponentialRampToValueAtTime(0.001, now + d + 0.045);
          o.connect(g); g.connect(this.ctx.destination);
          o.start(now + d); o.stop(now + d + 0.05);
        });
        break;
      }
      default: {
        // Generic blip
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(440, now);
        g.gain.setValueAtTime(0.1, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(now); o.stop(now + 0.12);
      }
    }
  }

  // ── 15. Poke squeak ───────────────────────────────────────────────────────
  playSqueak() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + 0.14);
  }

  // ── 16. Typewriter key click ──────────────────────────────────────────────
  playTypewriter() {
    this.resume();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + 0.02);
  }
}

export const audioSynth = new CartoonAudioSynth();
