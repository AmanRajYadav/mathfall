
// Audio utility functions using Web Audio API for synthesized sounds

let audioContext: AudioContext | null = null;
let backgroundMusicGain: GainNode | null = null;
let musicOscillator: OscillatorNode | null = null;
let backgroundMusicAudio: HTMLAudioElement | null = null;
let musicEnabled = true;
let musicVolume = 0.4; // 40% volume by default
let sfxVolume = 1.0; // Separate SFX volume
let currentTrack = '';

// Music tracks for different waves/themes  
const musicTracks = {
  menu: '/mathfall/audio/cinematic-menu.mp3', // Epic cinematic menu music like God of War/Call of Duty
  wave1_3: '/mathfall/audio/background-music.mp3',
  wave4_6: '/mathfall/audio/wave4-music.mp3',
  wave7_9: '/mathfall/audio/wave7-music.mp3',
  wave10plus: '/mathfall/audio/boss-music.mp3',
  gameOver: '/mathfall/audio/gameover-music.mp3'
};

type MusicTrack = keyof typeof musicTracks;

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Synthesized sound effects
export const playSound = (type: 'destroy' | 'destroyAggressive' | 'destroyBoss' | 'laserShoot' | 'powerUpCollect' | 'loseLife' | 'waveComplete') => {
  const ctx = initAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const currentTime = ctx.currentTime;

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  switch (type) {
    case 'destroy':
      // Quick zap sound for friendly/neutral problems
      oscillator.frequency.setValueAtTime(800, currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3 * sfxVolume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * sfxVolume, currentTime + 0.15);
      oscillator.type = 'square';
      break;

    case 'destroyAggressive':
      // Harsh, aggressive destruction sound
      oscillator.frequency.setValueAtTime(1200, currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, currentTime + 0.12);
      gainNode.gain.setValueAtTime(0.4 * sfxVolume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * sfxVolume, currentTime + 0.18);
      oscillator.type = 'sawtooth';
      break;

    case 'destroyBoss':
      // Epic boss destruction with complex harmonics
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      
      // Main frequency
      oscillator.frequency.setValueAtTime(1500, currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, currentTime + 0.25);
      gainNode.gain.setValueAtTime(0.5 * sfxVolume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * sfxVolume, currentTime + 0.3);
      oscillator.type = 'square';
      
      // Harmonic frequency
      osc2.frequency.setValueAtTime(750, currentTime);
      osc2.frequency.exponentialRampToValueAtTime(50, currentTime + 0.25);
      gain2.gain.setValueAtTime(0.3 * sfxVolume, currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01 * sfxVolume, currentTime + 0.3);
      osc2.type = 'triangle';
      
      osc2.start(currentTime);
      osc2.stop(currentTime + 0.3);
      break;

    case 'laserShoot':
      // Sci-fi laser shoot sound
      oscillator.frequency.setValueAtTime(1000, currentTime);
      oscillator.frequency.linearRampToValueAtTime(1500, currentTime + 0.05);
      oscillator.frequency.exponentialRampToValueAtTime(800, currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.2 * sfxVolume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * sfxVolume, currentTime + 0.1);
      oscillator.type = 'sine';
      break;

    case 'powerUpCollect':
      // Magical power-up collection sound
      oscillator.frequency.setValueAtTime(600, currentTime);
      oscillator.frequency.linearRampToValueAtTime(1200, currentTime + 0.1);
      oscillator.frequency.linearRampToValueAtTime(900, currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.25 * sfxVolume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * sfxVolume, currentTime + 0.25);
      oscillator.type = 'triangle';
      break;

    case 'loseLife':
      // Lower warning sound
      oscillator.frequency.setValueAtTime(150, currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(80, currentTime + 0.5);
      gainNode.gain.setValueAtTime(0.4 * sfxVolume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * sfxVolume, currentTime + 0.6);
      oscillator.type = 'sawtooth';
      break;

    case 'waveComplete':
      // Triumphant fanfare
      oscillator.frequency.setValueAtTime(400, currentTime);
      oscillator.frequency.setValueAtTime(500, currentTime + 0.1);
      oscillator.frequency.setValueAtTime(600, currentTime + 0.2);
      oscillator.frequency.setValueAtTime(800, currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.3 * sfxVolume, currentTime);
      gainNode.gain.setValueAtTime(0.3 * sfxVolume, currentTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * sfxVolume, currentTime + 0.8);
      oscillator.type = 'triangle';
      break;
  }

  oscillator.start(currentTime);
  
  // Set stop time based on sound type
  let stopTime = 0.15; // default
  switch (type) {
    case 'waveComplete': stopTime = 0.8; break;
    case 'loseLife': stopTime = 0.6; break;
    case 'destroyBoss': stopTime = 0.3; break;
    case 'destroyAggressive': stopTime = 0.18; break;
    case 'powerUpCollect': stopTime = 0.25; break;
    case 'laserShoot': stopTime = 0.1; break;
    default: stopTime = 0.15; break;
  }
  
  oscillator.stop(currentTime + stopTime);
};

// Dynamic music system based on game state
export const playBackgroundMusic = async (wave: number = 1, gameStatus: string = 'playing') => {
  if (!musicEnabled) return;
  
  // Determine which track to play
  let trackKey: MusicTrack;
  
  if (gameStatus === 'menu') {
    trackKey = 'menu';
  } else if (gameStatus === 'gameOver') {
    trackKey = 'gameOver';
  } else if (wave >= 10) {
    trackKey = 'wave10plus';
  } else if (wave >= 7) {
    trackKey = 'wave7_9';
  } else if (wave >= 4) {
    trackKey = 'wave4_6';
  } else {
    trackKey = 'wave1_3';
  }
  
  const trackPath = musicTracks[trackKey];
  
  // Don't restart if already playing the same track
  if (currentTrack === trackPath && backgroundMusicAudio && !backgroundMusicAudio.paused) {
    return;
  }
  
  stopBackgroundMusic(); // Stop any existing music
  currentTrack = trackPath;

  // Try to load and play MP3 file first
  try {
    backgroundMusicAudio = new Audio(trackPath);
    backgroundMusicAudio.loop = true;
    backgroundMusicAudio.volume = musicVolume;
    
    // Add event listeners for better error handling
    backgroundMusicAudio.addEventListener('canplaythrough', () => {
      if (backgroundMusicAudio && musicEnabled) {
        backgroundMusicAudio.play().catch(err => {
          console.warn(`Could not play music track ${trackPath}:`, err);
          // Fallback to synthesized music
          playSynthesizedMusic(wave, gameStatus);
        });
      }
    });
    
    backgroundMusicAudio.addEventListener('error', () => {
      console.warn(`Music file not found: ${trackPath}, using synthesized music`);
      // Fallback to synthesized music
      playSynthesizedMusic(wave, gameStatus);
    });
    
    // Load the audio
    backgroundMusicAudio.load();
    
  } catch (error) {
    console.warn(`Could not load MP3 music: ${trackPath}, using synthesized music`);
    playSynthesizedMusic(wave, gameStatus);
  }
};

// Fallback synthesized background music with wave-based variations
const playSynthesizedMusic = (wave: number = 1, gameStatus: string = 'playing') => {
  const ctx = initAudioContext();
  if (!ctx || !musicEnabled) return;

  // Create a simple synthwave-style background loop
  musicOscillator = ctx.createOscillator();
  backgroundMusicGain = ctx.createGain();
  
  musicOscillator.connect(backgroundMusicGain);
  backgroundMusicGain.connect(ctx.destination);
  
  musicOscillator.type = 'triangle';
  
  // Different chord progressions for different wave ranges
  let baseFreq: number;
  let chordProgression: number[];
  let tempo: number;
  
  if (gameStatus === 'menu') {
    // Epic cinematic menu music - low, dramatic tones
    baseFreq = 65.41; // C2 - very low and dramatic
    chordProgression = [65.41, 73.42, 82.41, 98.00]; // C2, D2, E2, G2 - epic progression
    tempo = 1200; // Slower, more dramatic
  } else if (wave >= 10) {
    // Boss music - dramatic and intense
    baseFreq = 110; // Lower, more ominous
    chordProgression = [110, 123.47, 146.83, 164.81]; // A2, B2, D3, E3
    tempo = 1500; // Faster tempo
  } else if (wave >= 7) {
    // High wave - more complex and energetic
    baseFreq = 330; // Higher pitch
    chordProgression = [330, 369.99, 415.30, 493.88]; // E4, F#4, G#4, B4
    tempo = 1600;
  } else if (wave >= 4) {
    // Mid waves - building intensity
    baseFreq = 277.18; // C#
    chordProgression = [277.18, 311.13, 369.99, 415.30]; // C#, D#, F#, G#
    tempo = 1800;
  } else {
    // Early waves - classic progression
    baseFreq = 220;
    chordProgression = [220, 246.94, 277.18, 329.63]; // A, B, C#, E
    tempo = 2000;
  }
  
  musicOscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
  
  let currentChord = 0;
  
  const changeChord = () => {
    if (musicOscillator && ctx && musicEnabled) {
      musicOscillator.frequency.setValueAtTime(chordProgression[currentChord], ctx.currentTime);
      currentChord = (currentChord + 1) % chordProgression.length;
      setTimeout(changeChord, tempo);
    }
  };
  
  backgroundMusicGain.gain.setValueAtTime(musicVolume * 0.3, ctx.currentTime);
  musicOscillator.start();
  
  changeChord();
};

export const stopBackgroundMusic = () => {
  // Stop MP3 audio
  if (backgroundMusicAudio) {
    backgroundMusicAudio.pause();
    backgroundMusicAudio.currentTime = 0;
    backgroundMusicAudio = null;
  }
  
  // Stop synthesized music
  if (musicOscillator) {
    musicOscillator.stop();
    musicOscillator = null;
  }
  if (backgroundMusicGain) {
    backgroundMusicGain = null;
  }
  
  currentTrack = '';
};

// Music control functions
export const toggleMusic = () => {
  musicEnabled = !musicEnabled;
  if (!musicEnabled) {
    stopBackgroundMusic();
  }
  return musicEnabled;
};

export const setMusicVolume = (volume: number) => {
  musicVolume = Math.max(0, Math.min(1, volume));
  
  if (backgroundMusicAudio) {
    backgroundMusicAudio.volume = musicVolume;
  }
  
  if (backgroundMusicGain) {
    backgroundMusicGain.gain.setValueAtTime(musicVolume * 0.3, audioContext?.currentTime || 0);
  }
};

export const getMusicEnabled = () => musicEnabled;
export const getMusicVolume = () => musicVolume;

// SFX Volume Controls
export const setSfxVolume = (volume: number) => {
  sfxVolume = Math.max(0, Math.min(1, volume));
};

export const getSfxVolume = () => sfxVolume;
