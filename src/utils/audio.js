// Web Audio API Sound Effects — no external files needed
let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', vol = 0.3, delay = 0) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch (e) { /* audio not supported */ }
}

function playNoise(duration, vol = 0.1) {
  try {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch (e) { /* audio not supported */ }
}

const SOUNDS = {
  correct() {
    playTone(523, 0.15, 'sine', 0.25, 0);
    playTone(659, 0.15, 'sine', 0.25, 0.1);
    playTone(784, 0.25, 'sine', 0.3, 0.2);
  },
  wrong() {
    playTone(330, 0.2, 'sawtooth', 0.15, 0);
    playTone(262, 0.3, 'sawtooth', 0.15, 0.15);
  },
  star() {
    playTone(880, 0.1, 'sine', 0.2, 0);
    playTone(1047, 0.15, 'sine', 0.25, 0.08);
    playTone(1319, 0.2, 'sine', 0.2, 0.16);
  },
  streak() {
    playTone(523, 0.1, 'sine', 0.2, 0);
    playTone(659, 0.1, 'sine', 0.2, 0.08);
    playTone(784, 0.1, 'sine', 0.2, 0.16);
    playTone(1047, 0.3, 'sine', 0.3, 0.24);
  },
  celebration() {
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => {
      playTone(f, 0.18, 'sine', 0.2, i * 0.1);
    });
  },
  hop() {
    playTone(600, 0.08, 'sine', 0.2);
    playTone(900, 0.12, 'sine', 0.15, 0.05);
  },
  click() {
    playTone(800, 0.05, 'sine', 0.1);
  },
  pop() {
    playTone(1200, 0.06, 'sine', 0.15);
  },
  regroup() {
    playNoise(0.15, 0.08);
    playTone(440, 0.2, 'sine', 0.15, 0.1);
    playTone(660, 0.25, 'sine', 0.2, 0.2);
  },
  cardFlip() {
    playNoise(0.06, 0.05);
    playTone(600, 0.08, 'sine', 0.08, 0.03);
  },
  worldComplete() {
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => {
      playTone(f, 0.2, 'sine', 0.2, i * 0.12);
    });
  },
};

export function playSound(key, enabled = true) {
  if (!enabled || !SOUNDS[key]) return;
  try {
    SOUNDS[key]();
  } catch (e) { /* silent fail */ }
}

// ─── Enhanced Female Voice TTS (Web Speech API) ──────────────────────────
let femaleVoice = null;
let voiceReady = false;
let allVoices = [];

function initVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const pickVoice = () => {
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return;
    allVoices = voices;

    // Priority list — natural/neural voices first, then standard female voices
    // These are ranked by how natural and genuine they sound
    const tests = [
      // Microsoft Edge Neural voices (most natural on Windows)
      v => /microsoft.*aria.*online/i.test(v.name) && v.lang.startsWith('en'),
      v => /microsoft.*jenny.*online/i.test(v.name) && v.lang.startsWith('en'),
      v => /microsoft.*ana.*online/i.test(v.name) && v.lang.startsWith('en'),
      v => /microsoft.*sara.*online/i.test(v.name) && v.lang.startsWith('en'),
      v => /microsoft.*sonia.*online/i.test(v.name) && v.lang.startsWith('en'),
      // Google Chrome natural voices
      v => /google uk english female/i.test(v.name),
      v => /google us english/i.test(v.name) && !/male/i.test(v.name),
      // macOS/iOS natural voices
      v => /samantha.*premium/i.test(v.name),
      v => /samantha.*enhanced/i.test(v.name),
      v => /samantha/i.test(v.name),
      v => /karen.*premium/i.test(v.name),
      v => /karen/i.test(v.name) && v.lang.startsWith('en'),
      v => /moira/i.test(v.name),
      v => /fiona/i.test(v.name),
      v => /tessa/i.test(v.name),
      // Windows standard voices
      v => /zira/i.test(v.name),
      v => /hazel/i.test(v.name),
      v => /susan/i.test(v.name),
      // Generic female English
      v => /female/i.test(v.name) && v.lang.startsWith('en'),
      // Microsoft online neural voices (any)
      v => /online.*natural/i.test(v.name) && v.lang.startsWith('en'),
      v => /online/i.test(v.name) && v.lang.startsWith('en') && !/male/i.test(v.name),
      // Any English voice (fallback)
      v => v.lang.startsWith('en-') && !/male/i.test(v.name),
      v => v.lang.startsWith('en'),
    ];

    for (const test of tests) {
      const found = voices.find(test);
      if (found) { femaleVoice = found; voiceReady = true; return; }
    }
    femaleVoice = voices[0];
    voiceReady = true;
  };

  pickVoice();
  if (!voiceReady) {
    speechSynthesis.onvoiceschanged = pickVoice;
  }
}

// Auto-init
initVoices();

// ─── Speech Queue for sentence-by-sentence reading ──────────────────────
let speechQueue = [];
let isSpeaking = false;
let currentUtterance = null;

// Chrome bug workaround: keeps speech alive for long utterances
let chromeKeepAlive = null;

function startChromeWorkaround() {
  stopChromeWorkaround();
  chromeKeepAlive = setInterval(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      speechSynthesis.resume();
    }
  }, 10000);
}

function stopChromeWorkaround() {
  if (chromeKeepAlive) {
    clearInterval(chromeKeepAlive);
    chromeKeepAlive = null;
  }
}

/**
 * Split text into natural sentences for a more genuine reading rhythm.
 * Each sentence is spoken with a slight pause between them.
 */
function splitIntoSentences(text) {
  // Split on sentence endings but keep the punctuation
  const parts = text.match(/[^.!?]+[.!?]+[\s)"]*/g) || [text];
  return parts.map(s => s.trim()).filter(Boolean);
}

function speakNextInQueue() {
  if (speechQueue.length === 0) {
    isSpeaking = false;
    stopChromeWorkaround();
    return;
  }

  isSpeaking = true;
  const { text, rate, pitch, volume } = speechQueue.shift();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  if (femaleVoice) utterance.voice = femaleVoice;

  utterance.onend = () => {
    currentUtterance = null;
    // Small natural pause between sentences
    setTimeout(speakNextInQueue, 120);
  };

  utterance.onerror = () => {
    currentUtterance = null;
    speakNextInQueue();
  };

  currentUtterance = utterance;
  speechSynthesis.speak(utterance);
}

/**
 * Speak text aloud using the best available female voice.
 * Text is broken into sentences for natural pacing.
 * Rate/pitch tuned for a warm, genuine, teacher-like delivery.
 */
export function speakText(text, enabled = true) {
  if (!enabled || !text || typeof speechSynthesis === 'undefined') return;

  // Cancel any ongoing speech first
  stopSpeech();

  const sentences = splitIntoSentences(text);

  // Queue each sentence with natural voice settings
  sentences.forEach((sentence, i) => {
    speechQueue.push({
      text: sentence,
      rate: 0.92,     // Slightly slower than normal — warm, unhurried
      pitch: 1.08,    // Very slightly higher for warmth, not cartoon-ish
      volume: 0.95,   // Near full volume
    });
  });

  startChromeWorkaround();
  speakNextInQueue();
}

/** Stop any ongoing speech and clear the queue */
export function stopSpeech() {
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
  }
  speechQueue = [];
  isSpeaking = false;
  currentUtterance = null;
  stopChromeWorkaround();
}

// ─── Phase Narration Content ──────────────────────────────────────────────
// Warm, encouraging intro narration for each phase

const PHASE_NARRATIONS = {
  wonder: {
    1: "Welcome to the Wonder phase! Let's ask a big question together. Have you ever thought about how we can combine numbers? Let's find out!",
    2: "Welcome back! This time, we're going to wonder about adding bigger numbers. What happens when the ones add up to more than nine? Let's explore!",
  },
  story: {
    1: "It's story time! Let me tell you about Leo the Lion Cub and his wonderful adventure with addition. Listen carefully!",
    2: "Time for another story! This time, meet Ella the Elephant. She's learning to add bigger numbers at the market. Let's follow along!",
  },
  simulate: {
    1: "Now it's your turn to try! Use the number line and ten-frame to explore addition yourself. Go ahead, experiment and have fun!",
    2: "Great job getting this far! Now try using the place value mat and column addition tools. You can change the numbers and see what happens!",
  },
  play: {
    1: "It's game time! You'll travel through five exciting worlds and answer addition questions. Do your best and earn stars. You've got this!",
    2: "Ready for a challenge? Five worlds of bigger addition problems await you. Remember what you've learned, and let's go!",
  },
  reflect: {
    1: "Well done! Let's look at how you did. Every question you tried made you a better mathematician!",
    2: "Amazing effort! Let's review your journey. You've learned so much about addition within one hundred!",
  },
};

/**
 * Speak a warm phase-intro narration when a phase begins.
 * @param {string} phase — 'wonder' | 'story' | 'simulate' | 'play' | 'reflect'
 * @param {number} part — 1 or 2
 * @param {boolean} enabled — whether audio is enabled
 */
export function speakPhaseIntro(phase, part, enabled = true) {
  if (!enabled || typeof speechSynthesis === 'undefined') return;
  const narrations = PHASE_NARRATIONS[phase];
  if (!narrations) return;
  const text = narrations[part] || narrations[1];
  speakText(text, enabled);
}
