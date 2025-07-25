
export interface MathProblem {
  id: string;
  text: string;
  answer: number;
  x: number;
  y: number;
  speed: number;
  difficulty: 'easy' | 'medium' | 'hard';
  personality: 'friendly' | 'neutral' | 'aggressive' | 'boss';
  size: 'small' | 'medium' | 'large' | 'giant';
  health?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color?: string;
}

export interface Wave {
  problems: MathProblem[];
  totalProblems: number;
}

export interface GameStatistics {
  currentStreak: number;
  bestStreak: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  highScore: number;
  timePlayedSeconds: number;
}

export interface GameState {
  score: number;
  lives: number;
  wave: number;
  problems: MathProblem[];
  particles: Particle[];
  currentInput: string;
  targetProblem: MathProblem | null;
  gameStatus: 'menu' | 'playing' | 'waveComplete' | 'gameOver' | 'paused' | 'statistics' | 'settings';
  totalProblemsInWave: number;
  problemsHandled: number;
  difficulty: 'easy' | 'medium' | 'hard';
  statistics: GameStatistics;
  gameStartTime: number;
  selectedRocket: RocketType;
  currentMusicTrack: string;
  powerUps: PowerUp[];
  activePowerUps: ActivePowerUp[];
  rocketX: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type RocketType = 'classic' | 'stealth' | 'tank' | 'speed' | 'plasma';

export interface RocketConfig {
  id: RocketType;
  name: string;
  description: string;
  color: string;
  size: number;
  laserColor: string;
  engineColor: string;
  speed: number;
  fireRate: number;
}

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  confidence: number;
  continuous: boolean;
}

export type PowerUpType = 'timeSlowdown' | 'destroyAll' | 'shield' | 'rapidFire' | 'multiplier' | 'freeze';

export interface PowerUp {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  speed: number;
  collected: boolean;
  duration?: number; // in seconds
  multiplier?: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  remainingTime: number;
  effect: any;
}

export interface PowerUpConfig {
  id: PowerUpType;
  name: string;
  description: string;
  color: string;
  icon: string;
  duration: number;
  rarity: number; // 0-1, lower = rarer
}
