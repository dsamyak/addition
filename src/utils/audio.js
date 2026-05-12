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
