
// Audio utility functions using Web Audio API for synthesized sounds

let audioContext: AudioContext | null = null;
let backgroundMusicGain: GainNode | null = null;
let musicOscillator: OscillatorNode | null = null;

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Synthesized sound effects
export const playSound = (type: 'destroy' | 'loseLife' | 'waveComplete') => {
  const ctx = initAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const currentTime = ctx.currentTime;

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  switch (type) {
    case 'destroy':
      // Quick zap sound
      oscillator.frequency.setValueAtTime(800, currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.15);
      oscillator.type = 'square';
      break;

    case 'loseLife':
      // Lower warning sound
      oscillator.frequency.setValueAtTime(150, currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(80, currentTime + 0.5);
      gainNode.gain.setValueAtTime(0.4, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.6);
      oscillator.type = 'sawtooth';
      break;

    case 'waveComplete':
      // Triumphant fanfare
      oscillator.frequency.setValueAtTime(400, currentTime);
      oscillator.frequency.setValueAtTime(500, currentTime + 0.1);
      oscillator.frequency.setValueAtTime(600, currentTime + 0.2);
      oscillator.frequency.setValueAtTime(800, currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.3, currentTime);
      gainNode.gain.setValueAtTime(0.3, currentTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.8);
      oscillator.type = 'triangle';
      break;
  }

  oscillator.start(currentTime);
  oscillator.stop(currentTime + (type === 'waveComplete' ? 0.8 : type === 'loseLife' ? 0.6 : 0.15));
};

// Background synthwave music
export const playBackgroundMusic = () => {
  const ctx = initAudioContext();
  if (!ctx) return;

  stopBackgroundMusic(); // Stop any existing music

  // Create a simple synthwave-style background loop
  musicOscillator = ctx.createOscillator();
  backgroundMusicGain = ctx.createGain();
  
  musicOscillator.connect(backgroundMusicGain);
  backgroundMusicGain.connect(ctx.destination);
  
  musicOscillator.type = 'triangle';
  musicOscillator.frequency.setValueAtTime(220, ctx.currentTime);
  
  // Simple chord progression loop
  const chordProgression = [220, 246.94, 277.18, 329.63]; // A, B, C#, E
  let currentChord = 0;
  
  const changeChord = () => {
    if (musicOscillator && ctx) {
      musicOscillator.frequency.setValueAtTime(chordProgression[currentChord], ctx.currentTime);
      currentChord = (currentChord + 1) % chordProgression.length;
      setTimeout(changeChord, 2000); // Change every 2 seconds
    }
  };
  
  backgroundMusicGain.gain.setValueAtTime(0.1, ctx.currentTime);
  musicOscillator.start();
  
  changeChord();
};

export const stopBackgroundMusic = () => {
  if (musicOscillator) {
    musicOscillator.stop();
    musicOscillator = null;
  }
  if (backgroundMusicGain) {
    backgroundMusicGain = null;
  }
};
