
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
}

export interface Wave {
  problems: MathProblem[];
  totalProblems: number;
}

export interface GameState {
  score: number;
  lives: number;
  wave: number;
  problems: MathProblem[];
  particles: Particle[];
  currentInput: string;
  targetProblem: MathProblem | null;
  gameStatus: 'menu' | 'playing' | 'waveComplete' | 'gameOver';
  totalProblemsInWave: number;
  problemsHandled: number;
}
