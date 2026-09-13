// ==========================================================================
// BUFFERINGSCENE.JS - Dynamic Animal Wi-Fi Packet Courier Mini-Drama
// ==========================================================================

import { audioSynth } from './audioSynth.js';

export class BufferingScene {
  constructor() {
    this.section = document.getElementById('buffering-scene-section');
    this.courier = document.getElementById('courier-animal');
    this.courierEmoji = document.getElementById('courier-emoji');
    this.signal = document.getElementById('carried-signal');
    this.sweat = document.getElementById('slip-sweat');
    this.narrative = document.getElementById('buffering-narrative');
    this.percentText = document.getElementById('buffer-percent-text');
    this.trail = document.getElementById('courier-trail');

    this.animationFrame = null;
    this.isActive = false;
  }

  show(animalEmoji = '🐾', animalName = 'Courier Critter') {
    if (!this.section) return;
    this.section.classList.remove('hidden');
    if (this.courierEmoji) this.courierEmoji.textContent = animalEmoji;
    this.isActive = true;
    this.startCourierMission(animalEmoji, animalName);
  }

  hide() {
    if (!this.section) return;
    this.section.classList.add('hidden');
    this.isActive = false;
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  }

  startCourierMission(animalEmoji, animalName) {
    if (!this.courier || !this.trail) return;

    // Reset positions and states
    this.courier.style.left = '0%';
    this.courier.classList.remove('animal-slipped');
    if (this.signal) this.signal.classList.remove('signal-dropped');
    if (this.sweat) this.sweat.classList.add('hidden');

    this.narrative.textContent = `${animalEmoji} ${animalName} is carefully transporting 1 packet of Wi-Fi across the floor...`;
    this.percentText.textContent = "0% Packets Dropped";

    const totalDuration = 3800;
    const startTime = Date.now();
    let hasTripped = false;
    let hasRecovered = false;

    const animate = () => {
      if (!this.isActive) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / totalDuration);

      // Phase 1: Walking calmly to the middle (0 to 42% time)
      if (progress < 0.42) {
        const xPct = (progress / 0.42) * 45;
        this.courier.style.left = `${xPct}%`;
      }
      // Phase 2: Tripping & dropping the signal! (42% to 65% time)
      else if (progress >= 0.42 && progress < 0.65) {
        if (!hasTripped) {
          hasTripped = true;
          this.triggerTripEvent(animalEmoji, animalName);
        }
      }
      // Phase 3: Recovering and sprinting to destination (65% to 100% time)
      else {
        if (!hasRecovered) {
          hasRecovered = true;
          this.triggerRecoverEvent(animalEmoji, animalName);
        }
        const sprintProgress = (progress - 0.65) / 0.35;
        const xPct = 45 + sprintProgress * 50;
        this.courier.style.left = `${xPct}%`;
      }

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.finishDelivery(animalEmoji, animalName);
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  triggerTripEvent(animalEmoji, animalName) {
    audioSynth.playSlip();
    audioSynth.playBufferGlitch();   // digital packet-drop crackle
    this.courier.classList.add('animal-slipped');
    if (this.signal) this.signal.classList.add('signal-dropped');
    if (this.sweat) this.sweat.classList.remove('hidden');

    this.percentText.textContent = "Packet Dropped! 😱";
    this.narrative.textContent = `😱 OH NO! ${animalName} tripped over an invisible USB cord! Wi-Fi dropped!`;
  }

  triggerRecoverEvent(animalEmoji, animalName) {
    this.courier.classList.remove('animal-slipped');
    if (this.signal) this.signal.classList.remove('signal-dropped');
    if (this.sweat) this.sweat.classList.add('hidden');

    this.percentText.textContent = "Rescued! 🩹";
    this.narrative.textContent = `🩹 ${animalName} dusted off the signal antenna and dashed heroically forward!`;
  }

  finishDelivery(animalEmoji, animalName) {
    this.percentText.textContent = "Packet Delivered! 🌐";
    this.narrative.textContent = `🌐 SUCCESS! ${animalEmoji} ${animalName} delivered the packet straight into The Cloud!`;
  }
}
