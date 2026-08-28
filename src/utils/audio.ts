/**
 * Gentle Web Audio synthesizer for tactile, cozy game feedback
 * Requires zero external audio files.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  try {
    localStorage.setItem('mb_sound_enabled', enabled ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export function isSoundEnabled(): boolean {
  try {
    const saved = localStorage.getItem('mb_sound_enabled');
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  } catch {
    // ignore
  }
  return soundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (!soundEnabled) return null;
  if (typeof window === 'undefined') return null;

  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playPickupSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(460, now + 0.08);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.08);
}

export function playPlaceSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Cozy woody/bubble snap sound
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(240, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.09);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.09);
}

export function playLineClearSound(lineCount: number = 1) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const baseFreqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const count = Math.min(lineCount, 4);

  for (let i = 0; i < count + 1; i++) {
    const delay = i * 0.06;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const freq = baseFreqs[i % baseFreqs.length] * (1 + 0.1 * Math.floor(i / 4));
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  }
}

export function playFullBoardClearSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Joyful harmonic celebration fanfare
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
  notes.forEach((freq, index) => {
    const now = ctx.currentTime + index * 0.08;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  });
}

export function playRewardSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const chords = [880, 1108.73, 1318.51, 1760]; // A5 Major
  chords.forEach((freq, idx) => {
    const now = ctx.currentTime + idx * 0.07;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.42);
  });
}

export function playGameOverSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [392, 349.23, 329.63, 261.63]; // G4, F4, E4, C4 gentle downward
  notes.forEach((freq, idx) => {
    const now = ctx.currentTime + idx * 0.12;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  });
}
