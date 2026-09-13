// ==========================================================================
// APP.JS - Master Orchestrator, Multi-Animal Telemetry & Finale Sequence
// ==========================================================================

import { audioSynth } from './audioSynth.js';
import { ParticleEngine } from './particles.js';
import { AnimalMascot } from './turtle.js';
import { Speedometer } from './speedometer.js';
import { BufferingScene } from './bufferingScene.js';
import { PersonalityMoodController } from './personalityMood.js';
import { AchievementSystem } from './achievements.js';
import { FunnyUnitsEngine } from './units.js';

class CritterNetApp {
  constructor() {
    this.particles = new ParticleEngine();
    this.mascot = new AnimalMascot();
    this.speedometer = new Speedometer(this.particles);
    this.buffering = new BufferingScene();
    this.personalityMood = new PersonalityMoodController();
    this.achievements = new AchievementSystem(this.particles);
    this.units = new FunnyUnitsEngine();

    // UI Buttons and Selectors
    this.startBtn = document.getElementById('start-test-btn');
    this.testAgainBtn = document.getElementById('test-again-btn');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.soundIcon = document.getElementById('sound-icon');
    this.presetSelect = document.getElementById('speed-preset-select');

    // Dramatic Overlay elements
    this.dramaticOverlay = document.getElementById('dramatic-overlay');
    this.dramaticText = document.getElementById('dramatic-text');
    this.dramaticRunner = document.getElementById('dramatic-runner');
    this.dramaticRunnerEmoji = document.getElementById('dramatic-runner-emoji');
    this.dramaticBoom = document.getElementById('dramatic-boom');

    // Results sections
    this.resultsHub = document.getElementById('results-hub');
    this.unitsSection = document.getElementById('units-section');

    this.isTesting = false;
    this.init();
  }

  init() {
    // Sound Toggle Button
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        const muted = audioSynth.toggleMute();
        this.soundIcon.textContent = muted ? '🔇' : '🔊';
        const label = this.soundToggleBtn.querySelector('.sound-label');
        if (label) label.textContent = muted ? 'SFX: OFF' : 'SFX: ON';
      });
    }

    // Launch Test Button
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.runTestFlow());
      this.startBtn.addEventListener('mouseenter', () => audioSynth.playHover());
    }

    // Test Again Button
    if (this.testAgainBtn) {
      this.testAgainBtn.addEventListener('click', () => this.resetTestFlow());
      this.testAgainBtn.addEventListener('mouseenter', () => audioSynth.playHover());
    }

    // Preset selector changes active critter habitat
    if (this.presetSelect) {
      this.presetSelect.addEventListener('change', () => {
        const val = this.presetSelect.value;
        if (val === 'random') {
          const critterIds = ['snail', 'sloth', 'turtle', 'hedgehog', 'rabbit', 'cheetah', 'cat', 'squirrel', 'frog'];
          const rand = critterIds[Math.floor(Math.random() * critterIds.length)];
          this.mascot.setAnimal(rand);
        } else {
          this.mascot.setAnimal(val);
        }
      });
    }

    // 3D Tilt Card Micro-interactions
    this.setupCardTiltInteractions();
  }

  // Determine active animal archetype, speed value, and unit description
  getHabitatParameters() {
    const preset = this.presetSelect ? this.presetSelect.value : 'random';
    
    if (preset === 'snail') {
      return { animalId: 'snail', emoji: '🐌', name: 'Garden Snail', speed: 0.42, unit: 'SNAILS / MINUTE' };
    } else if (preset === 'sloth') {
      return { animalId: 'sloth', emoji: '🦥', name: 'Sleepy Sloth', speed: 0.18, unit: 'SLOTHS / HOUR' };
    } else if (preset === 'turtle') {
      return { animalId: 'turtle', emoji: '🐢', name: 'Meadow Turtle', speed: 4.72, unit: 'TURTLES / SECOND' };
    } else if (preset === 'hedgehog') {
      return { animalId: 'hedgehog', emoji: '🦔', name: 'Curious Hedgehog', speed: 12.40, unit: 'HEDGEHOGS / SECOND' };
    } else if (preset === 'rabbit') {
      return { animalId: 'rabbit', emoji: '🐰', name: 'Turbo Rabbit', speed: 38.90, unit: 'RABBITS / SECOND' };
    } else if (preset === 'cheetah') {
      return { animalId: 'cheetah', emoji: '🐆', name: 'Savanna Cheetah', speed: 94.20, unit: 'CHEETAHS / SECOND' };
    } else {
      // Random / Surprise Me
      const roll = Math.random();
      if (roll < 0.15) {
        return { animalId: 'sloth', emoji: '🦥', name: 'Sleepy Sloth', speed: +(Math.random() * 0.2 + 0.08).toFixed(2), unit: 'SLOTHS / HOUR' };
      } else if (roll < 0.32) {
        return { animalId: 'snail', emoji: '🐌', name: 'Garden Snail', speed: +(Math.random() * 0.6 + 0.2).toFixed(2), unit: 'SNAILS / MINUTE' };
      } else if (roll < 0.55) {
        return { animalId: 'turtle', emoji: '🐢', name: 'Meadow Turtle', speed: +(Math.random() * 4 + 2).toFixed(2), unit: 'TURTLES / SECOND' };
      } else if (roll < 0.72) {
        return { animalId: 'hedgehog', emoji: '🦔', name: 'Curious Hedgehog', speed: +(Math.random() * 12 + 8).toFixed(2), unit: 'HEDGEHOGS / SECOND' };
      } else if (roll < 0.88) {
        return { animalId: 'rabbit', emoji: '🐰', name: 'Turbo Rabbit', speed: +(Math.random() * 30 + 20).toFixed(2), unit: 'RABBITS / SECOND' };
      } else {
        return { animalId: 'cheetah', emoji: '🐆', name: 'Savanna Cheetah', speed: +(Math.random() * 60 + 70).toFixed(2), unit: 'CHEETAHS / SECOND' };
      }
    }
  }

  // Main Test Flow Orchestrator
  runTestFlow() {
    if (this.isTesting) return;
    this.isTesting = true;

    audioSynth.playClick();

    // UI state transitions
    this.startBtn.classList.add('hidden');
    this.testAgainBtn.classList.add('hidden');
    this.resultsHub.classList.add('hidden');
    this.units.hide();

    // Determine habitat parameters
    const habitat = this.getHabitatParameters();

    // Update Mascot Runway critter
    this.mascot.setAnimal(habitat.animalId);

    // Show Buffering Scene with active critter
    this.buffering.show(habitat.emoji, habitat.name);

    // Start Speedometer animation
    this.speedometer.startTest(habitat.speed, habitat.emoji, habitat.unit, (finalSpeed) => {
      // Hide buffering scene
      this.buffering.hide();

      // Run Dramatic Finale Sequence
      this.runDramaticFinale(habitat);
    });
  }

  // Dramatic Results Climax Sequence
  runDramaticFinale(habitat) {
    // Step 1: Screen goes dark
    this.dramaticOverlay.classList.remove('hidden');
    this.dramaticText.textContent = "YOUR ANIMAL SPEED IS...";
    if (this.dramaticRunnerEmoji) this.dramaticRunnerEmoji.textContent = habitat.emoji;
    this.dramaticBoom.classList.add('hidden');

    // Step 2: Pause. Critter runs across dark screen
    audioSynth.playWhoosh();        // cinematic whoosh
    audioSynth.playCountdown(440);

    setTimeout(() => {
      // Step 3: Dramatic BOOM!
      this.dramaticBoom.classList.remove('hidden');
      audioSynth.playBoom();

      setTimeout(() => {
        // Step 4: Fade out dramatic overlay
        this.dramaticOverlay.classList.add('hidden');

        // Step 5: Sequential Cascading Reveals
        this.revealCascade(habitat);
      }, 900);
    }, 1200);
  }

  // Sequential reveal of the 4 core features
  revealCascade(habitat) {
    this.resultsHub.classList.remove('hidden');
    audioSynth.playResultReveal();  // rising arpeggio intro

    // 1. Feature 1: Animal Personality Generator
    this.personalityMood.revealPersonality(habitat.animalId, habitat.speed, () => {
      // 2. Feature 3: Internet Mood Detector
      this.personalityMood.revealMood(habitat.speed, () => {
        // 3. Feature 2: Funny Speed Units
        this.units.renderUnits(habitat.speed, () => {
          // 4. Mascot celebration
          this.mascot.triggerCelebration();

          // 5. Confetti explosion
          this.particles.burstConfetti('rainbow', 160);
          audioSynth.playFanfare();

          // 6. Feature 4: Achievement System Unlock
          setTimeout(() => {
            let achId = 'stoic_turtle';
            if (habitat.speed < 0.5) achId = 'speed_of_snail';
            else if (habitat.speed < 1.0) achId = 'sloth_zen';
            else if (habitat.speed < 20.0) achId = 'prickly_ping';
            else if (habitat.speed < 60.0) achId = 'rabbit_hop';
            else achId = 'apex_cheetah';

            this.achievements.unlock(achId);
          }, 1000);

          // Show Test Again button
          this.testAgainBtn.classList.remove('hidden');
          this.isTesting = false;
        });
      });
    });
  }

  // Reset test flow
  resetTestFlow() {
    audioSynth.playClick();
    this.speedometer.reset();
    this.mascot.setAnimal('turtle');
    this.resultsHub.classList.add('hidden');
    this.units.hide();
    this.testAgainBtn.classList.add('hidden');
    this.startBtn.classList.remove('hidden');
    this.isTesting = false;
  }

  // 3D Perspective Card Tilt on Mouse Move
  setupCardTiltInteractions() {
    const applyTilt = (card) => {
      if (card._tiltBound) return; // Avoid duplicate listeners
      card._tiltBound = true;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    };

    // Apply to already-existing cards
    document.querySelectorAll('.card-glass').forEach(applyTilt);

    // Observe for dynamically added cards (result cards added later)
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.card-glass').forEach(applyTilt);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.critterNet = new CritterNetApp();
});
