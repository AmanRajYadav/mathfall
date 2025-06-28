
export interface MathProblem {
  id: string;
  text: string;
  answer: number;
  x: number;
  y: number;
  speed: number;
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
}

export type Difficulty = 'easy' | 'medium' | 'hard';
