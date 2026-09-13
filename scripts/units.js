// ==========================================================================
// UNITS.JS - Feature 2: Fictional Animal Speed Units & Smooth Count-Up Easing
// ==========================================================================

import { audioSynth } from './audioSynth.js';

export class FunnyUnitsEngine {
  constructor() {
    this.container = document.getElementById('units-grid');
    this.section = document.getElementById('units-section');
    this.generateBtn = document.getElementById('generate-units-btn');

    this.currentBaseSpeed = 4.72; // baseline
    this.unitPool = [
      {
        icon: '🐆',
        unit: 'CHEETAHS / SECOND',
        calc: (s) => (s / 10).toFixed(2),
        context: 'Savanna sprint velocity benchmark'
      },
      {
        icon: '🐰',
        unit: 'RABBITS / SECOND',
        calc: (s) => (s * 1.85).toFixed(2),
        context: 'Calculated over open meadow clover'
      },
      {
        icon: '🐢',
        unit: 'TURTLES / SECOND',
        calc: (s) => s.toFixed(2),
        context: 'Standard mossy stone traverse rate'
      },
      {
        icon: '🦔',
        unit: 'HEDGEHOGS / SECOND',
        calc: (s) => (s * 2.65).toFixed(2),
        context: 'Curious garden perimeter trot'
      },
      {
        icon: '🐌',
        unit: 'SNAILS / MINUTE',
        calc: (s) => (s * 3.89).toFixed(2),
        context: 'Measured across wet rainy pavement'
      },
      {
        icon: '🦥',
        unit: 'SLOTHS / HOUR',
        calc: (s) => (s * 0.148).toFixed(2),
        context: 'Three-toed canopy reach index'
      },
      {
        icon: '📺',
        unit: 'LOADING SCREENS / MINUTE',
        calc: (s) => Math.max(1, Math.round(12 / (s + 0.1))),
        context: 'Nostalgic spinning ring frequency'
      },
      {
        icon: '✨',
        unit: 'WI-FI VIBES / SECOND',
        calc: (s) => (s * 14.2).toFixed(1),
        context: 'Atmospheric packet aura resonance'
      },
      {
        icon: '📡',
        unit: 'ROUTER CONFUSION UNITS',
        calc: (s) => Math.max(1, Math.round(100 / (s + 0.5))),
        context: 'Flashing LED indecision quotient'
      },
      {
        icon: '🐸',
        unit: 'LILYPAD HOPS / FORTNIGHT',
        calc: (s) => (s * 24.5).toFixed(1),
        context: 'Pond crossing quantum leap metric'
      }
    ];

    this.init();
  }

  init() {
    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => {
        audioSynth.playClick();
        this.shuffleAndRender();
      });
    }
  }

  show() {
    if (this.section) this.section.classList.remove('hidden');
  }

  hide() {
    if (this.section) this.section.classList.add('hidden');
  }

  // Smooth upward number counting ease-out
  countUp(element, targetVal, duration = 1200) {
    const startTime = performance.now();
    const num = parseFloat(targetVal);
    const isFloat = String(targetVal).includes('.');

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out: 1 - (1 - t)^3
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * num;

      element.textContent = isFloat ? current.toFixed(2) : Math.floor(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = targetVal;
      }
    };

    requestAnimationFrame(tick);
  }

  // Render funny unit cards tailored to the speed tier
  renderUnits(baseSpeed, onFinish = null) {
    if (!this.container) return;
    this.currentBaseSpeed = baseSpeed;
    this.show();
    this.container.innerHTML = '';

    // Pick units relevant to speed tier
    let selectedUnits = [];
    if (baseSpeed < 1.0) {
      // Slow tier
      selectedUnits = [this.unitPool[4], this.unitPool[5], this.unitPool[6], this.unitPool[8]]; // Snail, Sloth, Loading Screens, Router Confusion
    } else if (baseSpeed < 15.0) {
      // Medium tier
      selectedUnits = [this.unitPool[2], this.unitPool[3], this.unitPool[7], this.unitPool[4]]; // Turtle, Hedgehog, Wi-Fi Vibes, Snail
    } else {
      // Fast tier
      selectedUnits = [this.unitPool[0], this.unitPool[1], this.unitPool[7], this.unitPool[9]]; // Cheetah, Rabbit, Wi-Fi Vibes, Frog
    }

    selectedUnits.forEach((u, idx) => {
      const card = document.createElement('div');
      card.className = 'unit-card card-glass';
      card.style.animationDelay = `${idx * 160}ms`;

      const targetVal = u.calc(baseSpeed);

      card.innerHTML = `
        <span class="unit-icon-badge">${u.icon}</span>
        <div class="unit-value" id="unit-val-${idx}">0.00</div>
        <div class="unit-label">${u.unit}</div>
        <div class="unit-context">${u.context}</div>
      `;

      this.container.appendChild(card);

      // Trigger count-up with staggered start
      setTimeout(() => {
        const valElem = document.getElementById(`unit-val-${idx}`);
        if (valElem) {
          this.countUp(valElem, targetVal, 1100);
          audioSynth.playChime();   // sparkle chime per card
        }
      }, idx * 160 + 200);
    });

    if (onFinish) {
      setTimeout(onFinish, selectedUnits.length * 160 + 1200);
    }
  }

  // Shuffle & re-roll fresh funny unit cards
  shuffleAndRender() {
    const shuffled = [...this.unitPool].sort(() => 0.5 - Math.random());
    this.container.innerHTML = '';

    shuffled.slice(0, 4).forEach((u, idx) => {
      const card = document.createElement('div');
      card.className = 'unit-card card-glass';
      card.style.animationDelay = `${idx * 120}ms`;

      const targetVal = u.calc(this.currentBaseSpeed);

      card.innerHTML = `
        <span class="unit-icon-badge">${u.icon}</span>
        <div class="unit-value" id="shuff-val-${idx}">0.00</div>
        <div class="unit-label">${u.unit}</div>
        <div class="unit-context">${u.context}</div>
      `;

      this.container.appendChild(card);

      setTimeout(() => {
        const valElem = document.getElementById(`shuff-val-${idx}`);
        if (valElem) {
          this.countUp(valElem, targetVal, 1000);
        }
      }, idx * 120 + 150);
    });
  }
}
