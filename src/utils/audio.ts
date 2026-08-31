/**
 * Gentle Web Audio synthesizer for tactile, cozy game feedback
 * Requires zero external audio files.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

// Chain variables for consecutive clear combos
let lastClearTime = 0;
let currentChainCount = 0;

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
  
  // Create a short burst of white noise for the "air swoop/swish"
  const bufferSize = ctx.sampleRate * 0.15; // 150ms
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;

  // Filter to shape the noise into a fast "whoosh"
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.5;
  filter.frequency.setValueAtTime(300, now);
  filter.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

  const gain = ctx.createGain();
  // Fast fade in, then fade out to simulate swooping motion
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.4, now + 0.05); 
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noiseSource.start(now);
  noiseSource.stop(now + 0.15);
}

export function playPlaceSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. The Wooden Knock (Hollow, marimba-like body)
  const oscBody = ctx.createOscillator();
  const gainBody = ctx.createGain();
  oscBody.type = 'triangle'; // Triangle gives a hollow, woody tone
  oscBody.frequency.setValueAtTime(450, now);
  oscBody.frequency.exponentialRampToValueAtTime(150, now + 0.08);
  
  gainBody.gain.setValueAtTime(0.8, now);
  gainBody.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

  oscBody.connect(gainBody);
  gainBody.connect(ctx.destination);
  oscBody.start(now);
  oscBody.stop(now + 0.08);

  // 2. The Clop (Higher pitched wooden tap)
  const oscClick = ctx.createOscillator();
  const gainClick = ctx.createGain();
  oscClick.type = 'sine'; // Sine for a clean, round tap
  oscClick.frequency.setValueAtTime(800, now);
  oscClick.frequency.exponentialRampToValueAtTime(200, now + 0.03);
  
  gainClick.gain.setValueAtTime(0.4, now);
  gainClick.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

  oscClick.connect(gainClick);
  gainClick.connect(ctx.destination);
  oscClick.start(now);
  oscClick.stop(now + 0.03);
}

export function playLineClearSound(lineCount: number = 1) {
  const nowMs = Date.now();
  
  if (currentChainCount < 10) {
    // Climb gracefully 1 to 10 with no timer pressure
    currentChainCount++;
  } else {
    // Fever Mode: At chain 10, the 10-second timer kicks in
    if (nowMs - lastClearTime <= 10000) {
      currentChainCount = 10;
    } else {
      currentChainCount = 1;
    }
  }
  
  lastClearTime = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Crisp Ice Splash (Background Texture)
  // Short burst of high-frequency white noise to mimic shattering ice
  const bufferSize = ctx.sampleRate * 0.12; // 120ms
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1);
  }
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.setValueAtTime(4000, now);

  const noiseGain = ctx.createGain();
  // Soften the ice splash: lower volume and soft attack
  noiseGain.gain.setValueAtTime(0.01, now);
  noiseGain.gain.linearRampToValueAtTime(0.1, now + 0.02);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseSource.start(now);
  noiseSource.stop(now + 0.15);

  // 2. Pronounced Piano Chord (The Star of the Sound)
  // Base frequencies for a satisfying, rich Major chord (C4, E4, G4, C5)
  const baseNotes = [261.63, 329.63, 392.00, 523.25];
  
  // Pitch goes up for consecutive chain clears (up to 10 max)
  const chainMultipliers = [
    1.0,      // Chain 1: Base
    1.122,    // Chain 2: Major 2nd
    1.25,     // Chain 3: Major 3rd
    1.333,    // Chain 4: Perfect 4th
    1.5,      // Chain 5: Perfect 5th
    1.666,    // Chain 6: Major 6th
    1.875,    // Chain 7: Major 7th
    2.0,      // Chain 8: Octave
    2.25,     // Chain 9: Major 9th
    2.5       // Chain 10: Major 10th
  ];
  const pitchMultiplier = chainMultipliers[currentChainCount - 1];

  baseNotes.forEach((freq) => {
    const noteFreq = freq * pitchMultiplier;

    // --- The Piano Body (Warm & Woody) ---
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(noteFreq, now);
    
    // Soft attack (prevents jumpscare pop) and elegant long fade
    bodyGain.gain.setValueAtTime(0.01, now);
    bodyGain.gain.linearRampToValueAtTime(0.2, now + 0.03);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    
    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    bodyOsc.start(now);
    bodyOsc.stop(now + 0.8);

    // --- The Piano Hammer (Bright Strike) ---
    const hammerOsc = ctx.createOscillator();
    const hammerGain = ctx.createGain();
    hammerOsc.type = 'sine';
    hammerOsc.frequency.setValueAtTime(noteFreq * 2, now); // 1st overtone
    
    // Softer, gentler strike
    hammerGain.gain.setValueAtTime(0.01, now);
    hammerGain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    hammerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    hammerOsc.connect(hammerGain);
    hammerGain.connect(ctx.destination);
    hammerOsc.start(now);
    hammerOsc.stop(now + 0.2);
  });
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
