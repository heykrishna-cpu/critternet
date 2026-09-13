// ==========================================================================
// TURTLE.JS / MASCOT.JS - Multi-Animal Mascot Controller & Dynamic Locomotion
// ==========================================================================

import { audioSynth } from './audioSynth.js';

export class AnimalMascot {
  constructor() {
    this.container = document.getElementById('mascot-character');
    this.track = document.getElementById('race-track');
    this.statusText = document.getElementById('mascot-status-text');
    this.bubble = document.getElementById('mascot-bubble');
    this.bubbleText = document.getElementById('mascot-bubble-text');
    this.mainEmoji = document.getElementById('mascot-main-emoji');
    this.accessory = document.getElementById('mascot-accessory');

    this.posX = 10;
    this.currentAnimal = 'turtle';
    this.speedTier = 'medium';
    this.walkSpeed = 1.3;
    this.isPoked = false;
    this.reactionTimeout = null;

    // Animal Profiles & Dialogue
    this.animalProfiles = {
      snail: {
        name: 'Garden Snail',
        emoji: '🐌',
        tier: 'slow',
        walkSpeed: 0.25,
        status: 'Active Critter: Garden Snail (Leaving a contemplative slime trail)',
        quotes: [
          "Patience is a broadband virtue!",
          "I'll deliver this packet by Tuesday.",
          "Slime trail ping: 4,200ms.",
          "Speed is a social construct."
        ]
      },
      sloth: {
        name: 'Sleepy Sloth',
        emoji: '🦥',
        tier: 'slow',
        walkSpeed: 0.2,
        status: 'Active Critter: Sleepy Sloth (Hanging upside down mid-download)',
        quotes: [
          "Did... you... click... start... yesterday?",
          "Zzz... packet buffering in slow-mo...",
          "Too fast... need a nap...",
          "Yawn... loading one pixel..."
        ]
      },
      turtle: {
        name: 'Meadow Turtle',
        emoji: '🐢',
        tier: 'medium',
        walkSpeed: 1.3,
        status: 'Active Critter: Meadow Turtle (Steadily plodding along)',
        quotes: [
          "Shell-speed optimal!",
          "Slow internet builds character.",
          "Hey! Watch the shell!",
          "Are we at Google yet?"
        ]
      },
      hedgehog: {
        name: 'Curious Hedgehog',
        emoji: '🦔',
        tier: 'medium',
        walkSpeed: 2.2,
        status: 'Active Critter: Curious Hedgehog (Sniffing out data packets)',
        quotes: [
          "Spiky ping detected!",
          "Curling into a protective Wi-Fi ball!",
          "Pitter-patter across the carpet!",
          "Ouch! Watch the quills!"
        ]
      },
      cat: {
        name: 'Keyboard Cat',
        emoji: '🐱',
        tier: 'medium',
        walkSpeed: 1.8,
        status: 'Active Critter: Keyboard Cat (Stepping on CapsLock)',
        quotes: [
          "I knocked your router off the desk.",
          "Purrfectly adequate bandwidth.",
          "Buffering my 9th catnap.",
          "If it loads, I sits."
        ]
      },
      squirrel: {
        name: 'Hyper Squirrel',
        emoji: '🐿️',
        tier: 'fast',
        walkSpeed: 4.2,
        status: 'Active Critter: Hyper Squirrel (Hoarding gigabytes like acorns)',
        quotes: [
          "Stashing packets for the winter!",
          "Hyperactive DNS lookup engaged!",
          "Acorns in the fiber optic cable!",
          "Twitch twitch zoom!"
        ]
      },
      rabbit: {
        name: 'Turbo Rabbit',
        emoji: '🐰',
        tier: 'fast',
        walkSpeed: 4.8,
        status: 'Active Critter: Turbo Rabbit (Bounding through the data burrows)',
        quotes: [
          "Hop hop! Bouncing through the fiber!",
          "Ears perked for high-frequency packets!",
          "Zooming past the buffering spinner!",
          "Can't catch these clover speeds!"
        ]
      },
      cheetah: {
        name: 'Savanna Cheetah',
        emoji: '🐆',
        tier: 'extreme',
        walkSpeed: 14.0,
        status: 'Active Critter: Savanna Cheetah (Breaking the local sound barrier)',
        quotes: [
          "APEX VELOCITY UNLEASHED!",
          "Sonic boom! See ya later!",
          "Too fast for your monitor refresh rate!",
          "Roar! Pure optical speed!"
        ]
      },
      frog: {
        name: 'Lilypad Frog',
        emoji: '🐸',
        tier: 'medium',
        walkSpeed: 2.0,
        status: 'Active Critter: Lilypad Frog (Ribbiting across network hops)',
        quotes: [
          "Ribbit! Jumping across network hops!",
          "Catching bugs in the HTML!",
          "Leap of broadband faith!"
        ]
      }
    };

    this.init();
  }

  init() {
    if (!this.container) return;

    // Interactive poke micro-interaction
    this.container.addEventListener('click', () => this.poke());
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.poke();
      }
    });

    // Start continuous locomotion loop
    this.startLocomotion();
  }

  // Dynamically set the active animal mascot
  setAnimal(animalId) {
    const profile = this.animalProfiles[animalId] || this.animalProfiles.turtle;
    this.currentAnimal = animalId;
    this.speedTier = profile.tier;
    this.walkSpeed = profile.walkSpeed;

    if (!this.container) return;

    // Remove all animal classes
    this.container.className = `mascot-character tier-${profile.tier} animal-${animalId}`;
    if (this.mainEmoji) this.mainEmoji.textContent = profile.emoji;
    if (this.accessory) this.accessory.classList.add('hidden');
    if (this.statusText) this.statusText.textContent = profile.status;

    // Trigger state quirks
    if (profile.tier === 'slow' && Math.random() > 0.4) {
      this.triggerSleepy();
    }

    // Play animal voice cue
    audioSynth.playAnimalVoice(animalId);
  }

  // Set animal based on speed value
  setAnimalBySpeed(speedVal) {
    if (speedVal < 0.3) {
      this.setAnimal('sloth');
    } else if (speedVal < 1.0) {
      this.setAnimal('snail');
    } else if (speedVal < 6.0) {
      this.setAnimal('turtle');
    } else if (speedVal < 18.0) {
      this.setAnimal(Math.random() > 0.5 ? 'hedgehog' : 'cat');
    } else if (speedVal < 60.0) {
      this.setAnimal(Math.random() > 0.5 ? 'rabbit' : 'squirrel');
    } else {
      this.setAnimal('cheetah');
    }
  }

  // Continuous locomotion loop across the runway
  startLocomotion() {
    const step = () => {
      if (!this.isPoked && this.track && this.container) {
        const trackWidth = this.track.clientWidth;
        this.posX += this.walkSpeed;

        if (this.posX > trackWidth) {
          this.posX = -90; // Wrap around smoothly
        }

        this.container.style.left = `${this.posX}px`;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Emotional reaction: sleepy
  triggerSleepy() {
    if (!this.container) return;
    this.container.classList.add('state-sleepy');
    this.showBubble("😴 Zzz... ping: 9999ms");
  }

  // Emotional reaction: confused
  triggerConfused() {
    if (!this.container) return;
    this.container.classList.add('state-confused');
    this.showBubble("❓ 404 Trail Not Found");
  }

  // Emotional reaction: celebrate
  triggerCelebration() {
    if (!this.container) return;
    this.container.classList.remove('state-sleepy', 'state-confused');
    this.container.classList.add('state-celebrating');
    if (this.accessory) {
      this.accessory.textContent = '🕶️';
      this.accessory.classList.remove('hidden');
    }
    this.showBubble("🎉 EXPERIMENT SUCCESS!");
  }

  // Speech bubble display helper
  showBubble(text, duration = 2800) {
    if (!this.bubble || !this.bubbleText) return;
    this.bubbleText.textContent = text;
    this.bubble.classList.remove('hidden');

    if (this.reactionTimeout) clearTimeout(this.reactionTimeout);
    this.reactionTimeout = setTimeout(() => {
      this.bubble.classList.add('hidden');
    }, duration);
  }

  // Interactive poke reaction
  poke() {
    if (this.isPoked) return;
    this.isPoked = true;
    audioSynth.playSqueak();

    this.container.classList.add('is-poked');
    const profile = this.animalProfiles[this.currentAnimal] || this.animalProfiles.turtle;
    const quote = profile.quotes[Math.floor(Math.random() * profile.quotes.length)];
    this.showBubble(quote, 2200);

    setTimeout(() => {
      this.container.classList.remove('is-poked');
      this.isPoked = false;
    }, 1000);
  }
}
