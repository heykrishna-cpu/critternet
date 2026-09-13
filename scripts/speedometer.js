// ==========================================================================
// SPEEDOMETER.JS - Gauge Math, Needle Physics & Fictional Speed Runner
// ==========================================================================

import { audioSynth } from './audioSynth.js';

export class Speedometer {
  constructor(particleEngine) {
    this.particles = particleEngine;

    this.needle = document.getElementById('speedometer-needle');
    this.gaugeFillArc = document.getElementById('gauge-fill-arc');
    this.gaugeTicksGroup = document.getElementById('gauge-ticks');
    this.orbitRing = document.getElementById('orbit-ring');
    this.orbitRunner = document.getElementById('orbit-runner');
    this.orbitRunnerText = document.getElementById('orbit-runner-text');
    this.countdownText = document.getElementById('countdown-text');
    this.speedNumber = document.getElementById('speed-number');
    this.speedUnitText = document.getElementById('speed-unit-text');
    this.speedSubtag = document.getElementById('speed-subtag');
    this.resultEmoji = document.getElementById('result-emoji');
    this.statusLabel = document.getElementById('gauge-status-label');

    // Gauge geometry: 240-degree arc from -120° (left) to +120° (right)
    this.minAngle = -120;
    this.maxAngle = 120;
    this.totalArcLength = 630;

    this.currentValue = 0;
    this.targetValue = 0;
    this.currentAngle = -120;
    this.isRunning = false;

    this.initGauge();
  }

  initGauge() {
    this.drawTicks();
    this.setNeedleAngle(-120);
  }

  drawTicks() {
    if (!this.gaugeTicksGroup) return;
    this.gaugeTicksGroup.innerHTML = '';
    const cx = 210;
    const cy = 200;
    const radius = 150;
    const tickValues = ['0', '1', '2', '5', '10', '25', '50', '100+'];

    for (let i = 0; i < tickValues.length; i++) {
      const pct = i / (tickValues.length - 1);
      const angleDeg = this.minAngle + pct * (this.maxAngle - this.minAngle);
      const angleRad = ((angleDeg - 90) * Math.PI) / 180;

      const x1 = cx + Math.cos(angleRad) * (radius - 12);
      const y1 = cy + Math.sin(angleRad) * (radius - 12);
      const x2 = cx + Math.cos(angleRad) * (radius + 2);
      const y2 = cy + Math.sin(angleRad) * (radius + 2);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('class', 'tick-line major');
      this.gaugeTicksGroup.appendChild(line);

      const tx = cx + Math.cos(angleRad) * (radius - 26);
      const ty = cy + Math.sin(angleRad) * (radius - 26);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', tx);
      text.setAttribute('y', ty);
      text.setAttribute('class', 'tick-text');
      text.textContent = tickValues[i];
      this.gaugeTicksGroup.appendChild(text);
    }
  }

  setNeedleAngle(angleDeg) {
    this.currentAngle = angleDeg;
    if (this.needle) {
      this.needle.setAttribute('transform', `rotate(${angleDeg} 210 200)`);
    }

    if (this.gaugeFillArc) {
      const pct = Math.max(0, Math.min(1, (angleDeg - this.minAngle) / (this.maxAngle - this.minAngle)));
      const offset = this.totalArcLength * (1 - pct);
      this.gaugeFillArc.style.strokeDashoffset = offset;
    }
  }

  // Convert speed value to gauge angle (-120° to +120°)
  valueToAngle(val) {
    const normalized = Math.min(100, Math.max(0, val));
    const factor = Math.log10(normalized + 1) / Math.log10(101);
    return this.minAngle + factor * (this.maxAngle - this.minAngle);
  }

  // Start animated test sequence
  startTest(targetSpeed, animalEmoji, unitText, onComplete) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.targetValue = targetSpeed;

    this.statusLabel.textContent = "SYNCHRONIZING HABITAT TELEMETRY...";
    this.speedSubtag.textContent = "SAMPLING ANIMAL KINGDOM FREQUENCIES";
    if (this.orbitRing) this.orbitRing.classList.add('active-orbit');
    if (this.orbitRunner) this.orbitRunner.classList.remove('hidden');
    if (this.orbitRunnerText) this.orbitRunnerText.textContent = animalEmoji || '🐾';
    this.particles.setGaugeActive(true);

    const startTime = Date.now();
    const duration = 4000;
    let lastTickTime = 0;
    let orbitAngle = 0;

    const updateLoop = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (elapsed < duration) {
        // Countdown (3... 2... 1...)
        const remainingSeconds = Math.ceil((duration - elapsed) / 1000);
        if (remainingSeconds <= 3) {
          this.countdownText.classList.remove('hidden');
          if (this.countdownText.textContent !== String(remainingSeconds)) {
            this.countdownText.textContent = remainingSeconds;
            audioSynth.playCountdown(350 + (4 - remainingSeconds) * 120);
          }
        }

        // Wild random needle oscillation
        const wildVal = Math.random() * 88 + (Math.sin(elapsed * 0.015) * 20 + 20);
        const randomAngle = this.valueToAngle(wildVal);
        this.setNeedleAngle(randomAngle);

        // Rapidly cycling numbers
        const jitterNumber = (Math.random() * 95 + Math.random() * 5).toFixed(2);
        this.speedNumber.textContent = jitterNumber;

        // Sound tick
        if (now - lastTickTime > 90) {
          audioSynth.playNeedleTick(280 + Math.random() * 320);
          lastTickTime = now;
        }

        // Orbiting animal runner
        orbitAngle = (elapsed * 0.35) % 360;
        const rad = (orbitAngle * Math.PI) / 180;
        const rx = 210 + Math.cos(rad) * 165;
        const ry = 200 + Math.sin(rad) * 165;
        if (this.orbitRunner) {
          this.orbitRunner.setAttribute('transform', `translate(${rx}, ${ry}) rotate(${orbitAngle + 90})`);
        }

        requestAnimationFrame(updateLoop);
      } else {
        // Sudden stop!
        this.finishTest(targetSpeed, animalEmoji, unitText, onComplete);
      }
    };

    requestAnimationFrame(updateLoop);
  }

  finishTest(finalSpeed, animalEmoji, unitText, onComplete) {
    this.isRunning = false;
    if (this.orbitRing) this.orbitRing.classList.remove('active-orbit');
    if (this.orbitRunner) this.orbitRunner.classList.add('hidden');
    if (this.countdownText) this.countdownText.classList.add('hidden');
    this.particles.setGaugeActive(false);

    // Lock needle to exact final angle
    const finalAngle = this.valueToAngle(finalSpeed);
    this.setNeedleAngle(finalAngle);

    // Final result with scale-up and "BOOM!" bounce
    this.speedNumber.textContent = finalSpeed.toFixed(2);
    this.speedNumber.classList.add('animate-boom');
    if (this.resultEmoji) this.resultEmoji.textContent = animalEmoji || '🐾';
    if (this.speedUnitText) this.speedUnitText.textContent = unitText || 'ANIMAL UNITS / SEC';

    this.statusLabel.textContent = "SPEED CERTIFIED IN ANIMAL ARCHIVES";
    this.speedSubtag.textContent = "OFFICIAL HABITAT CALIBRATION";

    audioSynth.playBoom();

    setTimeout(() => {
      this.speedNumber.classList.remove('animate-boom');
      if (onComplete) onComplete(finalSpeed);
    }, 800);
  }

  reset() {
    this.setNeedleAngle(-120);
    this.speedNumber.textContent = "0.00";
    if (this.resultEmoji) this.resultEmoji.textContent = '🐾';
    if (this.speedUnitText) this.speedUnitText.textContent = 'ANIMAL SPEED UNITS';
    this.statusLabel.textContent = "CALIBRATING CRITTER SENSORS";
    this.speedSubtag.textContent = "PRESS START TO DISCOVER YOUR ANIMAL SPEED";
  }
}
