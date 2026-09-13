// ==========================================================================
// ACHIEVEMENTS.JS - Feature 4: 3D Rotating Trophy & Animal Achievement System
// ==========================================================================

import { audioSynth } from './audioSynth.js';

export class AchievementSystem {
  constructor(particleEngine) {
    this.particles = particleEngine;

    // Modal elements
    this.modal = document.getElementById('achievement-modal');
    this.titleElem = document.getElementById('ach-title');
    this.descElem = document.getElementById('ach-desc');
    this.xpValElem = document.getElementById('ach-xp-val');
    this.xpBarFill = document.getElementById('ach-xp-bar');
    this.closeBtn = document.getElementById('ach-close-btn');

    // Preview Card elements in Results Hub
    this.prevTitle = document.getElementById('prev-ach-title');
    this.prevDesc = document.getElementById('prev-ach-desc');
    this.prevXp = document.getElementById('prev-ach-xp');
    this.previewCard = document.getElementById('achievement-preview-card');
    this.viewAllBtn = document.getElementById('view-all-ach-btn');

    // Drawer elements
    this.drawer = document.getElementById('trophies-drawer');
    this.drawerBackdrop = document.getElementById('drawer-backdrop');
    this.closeDrawerBtn = document.getElementById('close-drawer-btn');
    this.trophiesTrayBtn = document.getElementById('achievements-tray-btn');
    this.trophiesList = document.getElementById('trophies-list');
    this.totalXpDisplay = document.getElementById('total-xp-display');
    this.unlockedCountDisplay = document.getElementById('unlocked-count-display');
    this.achCountBadge = document.getElementById('ach-count-badge');

    this.totalXp = 850;
    this.achievements = [
      {
        id: 'speed_of_snail',
        icon: '🐌',
        title: 'SPEED OF SNAIL',
        desc: 'Clocking a connection slower than an arthritic snail in molasses on a frosty morning.',
        xp: 350,
        unlocked: true
      },
      {
        id: 'stoic_turtle',
        icon: '🐢',
        title: 'STOIC SHELL DEFENSE',
        desc: 'Surviving 10 consecutive seconds of dial-up ping without crying or refreshing.',
        xp: 500,
        unlocked: true
      },
      {
        id: 'prickly_ping',
        icon: '🦔',
        title: 'PRICKLY PING SURVIVOR',
        desc: 'Curled into a protective hedgehog ball while data packets bounced harmlessly off quills.',
        xp: 450,
        unlocked: true
      },
      {
        id: 'sloth_zen',
        icon: '🦥',
        title: 'SLOTH MEDITATION GURU',
        desc: 'Stared at a static loading bar for 15 unbroken seconds in total transcendent bliss.',
        xp: 400,
        unlocked: false
      },
      {
        id: 'rabbit_hop',
        icon: '🐰',
        title: 'RABBIT HOP ACCELERATOR',
        desc: 'Bounded past the buffering spinner into the high-frequency clover burrow.',
        xp: 600,
        unlocked: false
      },
      {
        id: 'apex_cheetah',
        icon: '🐆',
        title: 'APEX CHEETAH VELOCITY',
        desc: 'Shattered the sound barrier with optical predator speeds without setting the router on fire.',
        xp: 750,
        unlocked: false
      }
    ];

    this.init();
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.dismissModal());
    }
    if (this.trophiesTrayBtn) {
      this.trophiesTrayBtn.addEventListener('click', () => this.openDrawer());
    }
    if (this.viewAllBtn) {
      this.viewAllBtn.addEventListener('click', () => this.openDrawer());
    }
    if (this.closeDrawerBtn) {
      this.closeDrawerBtn.addEventListener('click', () => this.closeDrawer());
    }
    if (this.drawerBackdrop) {
      this.drawerBackdrop.addEventListener('click', () => this.closeDrawer());
    }

    this.updateStats();
  }

  updateStats() {
    const unlockedCount = this.achievements.filter(a => a.unlocked).length;
    if (this.achCountBadge) {
      this.achCountBadge.textContent = `${unlockedCount}/${this.achievements.length}`;
    }
    if (this.unlockedCountDisplay) {
      this.unlockedCountDisplay.textContent = `${unlockedCount} / ${this.achievements.length}`;
    }
    if (this.totalXpDisplay) {
      this.totalXpDisplay.textContent = this.totalXp.toLocaleString();
    }
  }

  // Dramatic Achievement Unlock Animation
  unlock(achId, onFinish = null) {
    const ach = this.achievements.find(a => a.id === achId) || this.achievements[0];
    ach.unlocked = true;

    // Update preview card
    if (this.prevTitle) this.prevTitle.textContent = ach.title;
    if (this.prevDesc) this.prevDesc.textContent = ach.desc;
    if (this.prevXp) this.prevXp.textContent = `+${ach.xp} ANIMAL XP`;

    // Populate modal
    if (this.titleElem) this.titleElem.textContent = ach.title;
    if (this.descElem) this.descElem.textContent = ach.desc;
    if (this.xpValElem) this.xpValElem.textContent = '0';
    if (this.xpBarFill) this.xpBarFill.style.width = '0%';

    // Reveal modal
    this.modal.classList.remove('hidden');

    audioSynth.playUnlockChord();        // rich achievement chord
    this.particles.burstConfetti('gold', 140);

    // Rapid XP Counter Tick-up
    let currentXp = 0;
    const targetXp = ach.xp;
    const startTime = performance.now();
    const duration = 1200;

    const countXp = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      currentXp = Math.floor(progress * targetXp);

      if (this.xpValElem) this.xpValElem.textContent = currentXp;

      if (progress < 1) {
        requestAnimationFrame(countXp);
      } else {
        if (this.xpValElem) this.xpValElem.textContent = targetXp;
        if (this.xpBarFill) this.xpBarFill.style.width = '100%';
        this.totalXp += targetXp;
        this.updateStats();
        if (onFinish) onFinish();
      }
    };

    setTimeout(() => {
      requestAnimationFrame(countXp);
    }, 400);
  }

  dismissModal() {
    audioSynth.playClick();
    this.modal.classList.add('hidden');
  }

  openDrawer() {
    audioSynth.playClick();
    audioSynth.playDrawerOpen();     // slide-in sweep
    this.renderDrawerList();
    this.drawer.classList.remove('hidden');
  }

  closeDrawer() {
    audioSynth.playClick();
    this.drawer.classList.add('hidden');
  }

  renderDrawerList() {
    if (!this.trophiesList) return;
    this.trophiesList.innerHTML = '';

    this.achievements.forEach(ach => {
      const item = document.createElement('div');
      item.className = `trophy-item ${ach.unlocked ? 'unlocked' : 'locked'}`;

      item.innerHTML = `
        <div class="trophy-item-icon">${ach.unlocked ? ach.icon : '🔒'}</div>
        <div class="trophy-item-info">
          <div class="trophy-item-title">${ach.title}</div>
          <div class="trophy-item-desc">${ach.desc}</div>
        </div>
        <div class="trophy-item-xp">+${ach.xp} ANIMAL XP</div>
      `;

      this.trophiesList.appendChild(item);
    });
  }
}
