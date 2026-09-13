// ==========================================================================
// PERSONALITYMOOD.JS - Features 1 & 3: Animal Personality & Internet Mood
// ==========================================================================

import { audioSynth } from './audioSynth.js';

export class PersonalityMoodController {
  constructor() {
    // Feature 1: Personality Card Elements
    this.personalityCard = document.getElementById('personality-card');
    this.personalitySilhouette = document.getElementById('personality-silhouette');
    this.personalityIcon = document.getElementById('personality-icon');
    this.personalityTitle = document.getElementById('personality-title');
    this.personalityDesc = document.getElementById('personality-desc');
    this.personalityTag = document.getElementById('personality-tag');

    // Feature 3: Mood Card Elements
    this.moodCard = document.getElementById('mood-card');
    this.moodCharacter = document.getElementById('mood-character');
    this.moodAvatar = document.getElementById('mood-avatar');
    this.moodProps = document.getElementById('mood-props');
    this.moodTitle = document.getElementById('mood-title');
    this.moodDesc = document.getElementById('mood-desc');
    this.moodRarity = document.getElementById('mood-rarity');

    // Rich Animal Personality Catalog across the Animal Kingdom
    this.personalities = [
      {
        id: 'snail',
        icon: '🐌',
        title: 'CONFUSED SNAIL',
        desc: 'Navigates web pages like a snail reading a map upside down in the rain. High contemplation, serene velocity.',
        tag: 'Species: Gastropod Explorer'
      },
      {
        id: 'sloth',
        icon: '🦥',
        title: 'ZEN MEDITATION SLOTH',
        desc: 'Takes three deep breaths before downloading a single JPEG thumbnail. Peaceful, unflappable, and eternally patient.',
        tag: 'Species: Canopy Guru'
      },
      {
        id: 'turtle',
        icon: '🐢',
        title: 'STOIC SHIELD TURTLE',
        desc: 'Plods steadily through packet loss. Shell is armored against 404 errors, network blips, and cosmic rays.',
        tag: 'Species: Ancient Data Guardian'
      },
      {
        id: 'hedgehog',
        icon: '🦔',
        title: 'PRICKLY HEDGEHOG',
        desc: 'Curls into a protective spiky ball whenever high-bandwidth video streams arrive. Adorable under pressure.',
        tag: 'Species: Garden Scout'
      },
      {
        id: 'cat',
        icon: '🐱',
        title: 'KEYBOARD-SLEEPING CAT',
        desc: 'Lounges across your router, casually generating 50 tabs of random keystrokes. Purrfectly aloof bandwidth.',
        tag: 'Species: Feline Router Warmth'
      },
      {
        id: 'squirrel',
        icon: '🐿️',
        title: 'HYPERACTIVE SQUIRREL',
        desc: 'Buries network packets in the garden for winter and forgets which folder they are in. Twitchy and fast.',
        tag: 'Species: Acorn Bandwidth Hoarder'
      },
      {
        id: 'rabbit',
        icon: '🐰',
        title: 'TURBO RABBIT',
        desc: 'Hops past buffering screens with ears twitching at 240Hz. Bounding through data burrows at breakneck pace.',
        tag: 'Species: Meadow Speedster'
      },
      {
        id: 'cheetah',
        icon: '🐆',
        title: 'SAVANNA CHEETAH',
        desc: 'Apex optical predator. Vaporizes web pages into existence before the user finishes pressing the Enter key.',
        tag: 'Species: Supersonic Feline'
      },
      {
        id: 'frog',
        icon: '🐸',
        title: 'QUANTUM POND FROG',
        desc: 'Exists in a superposition of loaded and loading until observed. Leaps across lilypad DNS servers effortlessly.',
        tag: 'Species: Amphibian Jumper'
      }
    ];

    // Internet Mood Catalog
    this.moods = [
      {
        type: 'devastated',
        avatar: '😭',
        title: 'DEVASTATED',
        desc: 'Your router is curled in the corner listening to sad violin solos and buffering tears.',
        rarity: '⭐ RARITY: COMMONLY DROOPY',
        propsHtml: '<span class="tear t1">💧</span><span class="tear t2">💧</span>'
      },
      {
        type: 'sleepy',
        avatar: '😴',
        title: 'SLEEPY',
        desc: 'Your modem took a nap after processing two DNS requests. Do not disturb.',
        rarity: '🌙 RARITY: UNCOMMONLY DROWSY',
        propsHtml: '<span class="zzz-bubble">Zzz...</span>'
      },
      {
        type: 'confident',
        avatar: '😎',
        title: 'CONFIDENT',
        desc: 'Slick and steady. Knows its animal speed archetype and struts with supreme swagger.',
        rarity: '✨ RARITY: MYTHIC CHAD MODEM',
        propsHtml: '<span class="shades-prop">🕶️</span><span class="sparkle-prop">✨</span>'
      },
      {
        type: 'chaotic',
        avatar: '🤪',
        title: 'CHAOTIC',
        desc: 'Fluctuating between snail crawl and cheetah leap. Vibrating into another digital dimension.',
        rarity: '🌀 RARITY: LEGENDARY ANOMALY',
        propsHtml: ''
      }
    ];
  }

  // Typewriter text generator with clicking sounds
  typewriter(element, text, speed = 28, onFinish = null) {
    if (!element) return;
    element.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        audioSynth.playTypewriter();
        i++;
      } else {
        clearInterval(interval);
        if (onFinish) onFinish();
      }
    }, speed);
  }

  // Reveal Animal Personality with suspense sequence
  revealPersonality(animalId, speedVal, onComplete) {
    if (!this.personalityCard) return;

    // Match personality to active animal or speed
    let item = this.personalities.find(p => p.id === animalId);
    if (!item) {
      if (speedVal < 0.3) item = this.personalities[1]; // sloth
      else if (speedVal < 1.0) item = this.personalities[0]; // snail
      else if (speedVal < 6.0) item = this.personalities[2]; // turtle
      else if (speedVal < 18.0) item = this.personalities[3]; // hedgehog
      else if (speedVal < 50.0) item = this.personalities[6]; // rabbit
      else item = this.personalities[7]; // cheetah
    }

    // Step 1: Silhouette blur & mystery state
    this.personalitySilhouette.classList.add('blurred');
    this.personalitySilhouette.classList.remove('revealed');
    this.personalityIcon.textContent = '🐾';
    this.personalityTitle.textContent = 'Identifying animal vibe...';
    this.personalityDesc.textContent = '';
    this.personalityTag.textContent = 'Habitat calibration: 52%';

    // Step 2: Card suspense shake
    this.personalityCard.classList.add('shaking');

    setTimeout(() => {
      // Step 3: Reveal icon with bounce
      this.personalityCard.classList.remove('shaking');
      this.personalitySilhouette.classList.remove('blurred');
      this.personalitySilhouette.classList.add('revealed');
      this.personalityIcon.textContent = item.icon;
      audioSynth.playBoom();

      // Step 4: Typewriter title and description
      this.typewriter(this.personalityTitle, item.title, 35, () => {
        this.personalityDesc.textContent = item.desc;
        this.personalityTag.textContent = item.tag;
        if (onComplete) onComplete();
      });
    }, 1100);
  }

  // Reveal Internet Mood Card
  revealMood(speedVal, onComplete) {
    if (!this.moodCard) return;

    let mood = this.moods[0];
    if (speedVal < 0.4) mood = this.moods[0]; // devastated
    else if (speedVal < 3.0) mood = this.moods[1]; // sleepy
    else if (speedVal < 30.0) mood = this.moods[2]; // confident
    else mood = this.moods[3]; // chaotic

    // Reset classes
    this.moodCharacter.className = `mood-character mood-${mood.type}`;
    this.moodAvatar.textContent = mood.avatar;
    this.moodProps.innerHTML = mood.propsHtml;

    this.moodTitle.textContent = mood.title;
    this.moodDesc.textContent = mood.desc;
    this.moodRarity.textContent = mood.rarity;

    this.moodCard.style.animation = 'revealBounce 0.5s var(--transition-bounce)';
    setTimeout(() => {
      this.moodCard.style.animation = '';
      if (onComplete) onComplete();
    }, 500);
  }
}
