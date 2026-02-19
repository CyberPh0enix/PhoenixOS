let audioCtx = null;

const initAudio = () => {
  if (!window.AudioContext && !window.webkitAudioContext) return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

// Base synthesizer function
const playTone = (freq, type, duration, vol = 0.1, delay = 0) => {
  const ctx = initAudio();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime + delay);

  // Volume envelope (prevents clicking sounds at start/end of tones)
  gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + delay + duration,
  );

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime + delay);
  oscillator.stop(ctx.currentTime + delay + duration);
};

export const SensoryEngine = {
  vibrate: (pattern) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  },

  playKeystroke: () => {
    // Very short, high-pitched mechanical "click" (Square wave)
    playTone(800, "square", 0.03, 0.02);
  },

  triggerSuccess: () => {
    // Ascending major chime (Sine wave)
    playTone(523.25, "sine", 0.15, 0.1, 0); // C5
    playTone(659.25, "sine", 0.15, 0.1, 0.1); // E5
    playTone(783.99, "sine", 0.3, 0.1, 0.2); // G5
    SensoryEngine.vibrate([50, 50, 50]);
  },

  triggerError: () => {
    // Harsh, dissonant low buzz (Sawtooth wave)
    playTone(150, "sawtooth", 0.3, 0.1, 0);
    playTone(155, "sawtooth", 0.3, 0.1, 0); // Slight detune for harshness
    SensoryEngine.vibrate([200, 100, 200]);
  },

  triggerAlert: () => {
    // Mid-pitch digital ping
    playTone(440, "sine", 0.2, 0.1, 0); // A4
    SensoryEngine.vibrate([100]);
  },
};
