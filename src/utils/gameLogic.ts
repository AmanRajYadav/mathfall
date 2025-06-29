
import { MathProblem, Wave, Difficulty } from '../types/game';

let problemIdCounter = 0;

const getDifficultyMultipliers = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy':
      return { speedMultiplier: 1.0, complexityMultiplier: 0.5, problemCount: 1.0 };
    case 'medium':
      return { speedMultiplier: 1.3, complexityMultiplier: 1.0, problemCount: 1.2 };
    case 'hard':
      return { speedMultiplier: 1.6, complexityMultiplier: 1.5, problemCount: 1.5 };
  }
};

const generateProblem = (type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'complex', waveNumber: number, difficulty: Difficulty): MathProblem => {
  let text = '';
  let answer = 0;
  const { speedMultiplier, complexityMultiplier } = getDifficultyMultipliers(difficulty);
  
  switch (type) {
    case 'addition':
      const useHardAdd = waveNumber > 2 && Math.random() < (0.3 * complexityMultiplier);
      if (useHardAdd) {
        const a1 = Math.floor(Math.random() * 45) + 15;
        const b1 = Math.floor(Math.random() * 35) + 10;
        text = `${a1} + ${b1}`;
        answer = a1 + b1;
      } else {
        const maxNum = difficulty === 'easy' ? 9 : difficulty === 'medium' ? 15 : 20;
        const a1 = Math.floor(Math.random() * maxNum) + 1;
        const b1 = Math.floor(Math.random() * maxNum) + 1;
        text = `${a1} + ${b1}`;
        answer = a1 + b1;
      }
      break;
      
    case 'subtraction':
      const useHardSub = waveNumber > 2 && Math.random() < (0.3 * complexityMultiplier);
      if (useHardSub) {
        const a2 = Math.floor(Math.random() * 80) + 20;
        const b2 = Math.floor(Math.random() * (a2 - 10)) + 5;
        text = `${a2} - ${b2}`;
        answer = a2 - b2;
      } else {
        const maxNum = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 30;
        const a2 = Math.floor(Math.random() * maxNum) + 6;
        const b2 = Math.floor(Math.random() * (a2 - 1)) + 1;
        text = `${a2} - ${b2}`;
        answer = a2 - b2;
      }
      break;
      
    case 'multiplication':
      const useHardMult = waveNumber > 3 && Math.random() < (0.4 * complexityMultiplier);
      if (useHardMult) {
        const a3 = Math.floor(Math.random() * 8) + 12;
        const b3 = Math.floor(Math.random() * 9) + 2;
        text = `${a3} × ${b3}`;
        answer = a3 * b3;
      } else {
        const maxNum = difficulty === 'easy' ? 9 : difficulty === 'medium' ? 12 : 15;
        const a3 = Math.floor(Math.random() * maxNum) + 2;
        const b3 = Math.floor(Math.random() * (difficulty === 'easy' ? 9 : 11)) + 2;
        text = `${a3} × ${b3}`;
        answer = a3 * b3;
      }
      break;
      
    case 'division':
      const maxQuotient = difficulty === 'easy' ? 9 : difficulty === 'medium' ? 12 : 15;
      const quotient = Math.floor(Math.random() * maxQuotient) + 2;
      const divisor = Math.floor(Math.random() * 8) + 2;
      const dividend = quotient * divisor;
      text = `${dividend} ÷ ${divisor}`;
      answer = quotient;
      break;
      
    case 'complex':
      const complexType = Math.floor(Math.random() * 3);
      if (complexType === 0) {
        const a = Math.floor(Math.random() * 15) + 10;
        const b = Math.floor(Math.random() * 10) + 5;
        const c = Math.floor(Math.random() * 8) + 3;
        text = `(${a} + ${b}) - ${c}`;
        answer = (a + b) - c;
      } else if (complexType === 1) {
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 6) + 2;
        text = `${a} + ${b} × ${c}`;
        answer = a + (b * c);
      } else {
        const base = Math.floor(Math.random() * 8) + 3;
        text = `${base}²`;
        answer = base * base;
      }
      break;
  }
  
  // Increased base speed by 15% and added wave progression
  const baseSpeed = (0.8 + (waveNumber * 0.4) + (Math.random() * 0.6)) * 1.15;
  const speed = baseSpeed * speedMultiplier;
  const textWidth = text.length * 12;
  const maxX = 800 - textWidth - 20;
  
  return {
    id: `problem_${problemIdCounter++}`,
    text,
    answer,
    x: Math.random() * maxX + 10,
    y: -30,
    speed
  };
};

export const generateWave = (waveNumber: number, difficulty: Difficulty): Wave => {
  const problems: MathProblem[] = [];
  let totalProblems = 0;
  
  const { problemCount } = getDifficultyMultipliers(difficulty);
  const baseProblems = Math.floor((difficulty === 'easy' ? 12 : difficulty === 'medium' ? 16 : 20) * problemCount);
  
  switch (waveNumber) {
    case 1:
      totalProblems = baseProblems;
      for (let i = 0; i < totalProblems; i++) {
        const problem = generateProblem('addition', waveNumber, difficulty);
        problem.y = -50 - (i * 80); // Reduced spacing for more frequent problems
        problems.push(problem);
      }
      break;
      
    case 2:
      totalProblems = baseProblems + 4;
      for (let i = 0; i < totalProblems; i++) {
        const type = Math.random() < 0.6 ? 'addition' : 'subtraction';
        const problem = generateProblem(type, waveNumber, difficulty);
        problem.y = -50 - (i * 75);
        problems.push(problem);
      }
      break;
      
    case 3:
      totalProblems = baseProblems + 8;
      for (let i = 0; i < totalProblems; i++) {
        const type = Math.random() < 0.8 ? 'multiplication' : 'division';
        const problem = generateProblem(type, waveNumber, difficulty);
        problem.y = -50 - (i * 70);
        problems.push(problem);
      }
      break;
      
    case 4:
      totalProblems = baseProblems + 10;
      for (let i = 0; i < totalProblems; i++) {
        const types: ('addition' | 'subtraction' | 'multiplication' | 'division')[] = 
          ['addition', 'subtraction', 'multiplication', 'division'];
        const type = types[Math.floor(Math.random() * types.length)];
        const problem = generateProblem(type, waveNumber, difficulty);
        problem.y = -50 - (i * 65);
        problems.push(problem);
      }
      break;
      
    case 5:
      totalProblems = baseProblems + 12;
      for (let i = 0; i < totalProblems; i++) {
        const useComplex = Math.random() < 0.4;
        const type = useComplex ? 'complex' : 
          (['addition', 'subtraction', 'multiplication', 'division'] as const)[Math.floor(Math.random() * 4)];
        const problem = generateProblem(type, waveNumber, difficulty);
        problem.y = -50 - (i * 60);
        problems.push(problem);
      }
      break;
      
    default:
      totalProblems = Math.min(baseProblems + 20, baseProblems + (waveNumber * 3));
      const types: ('addition' | 'subtraction' | 'multiplication' | 'division' | 'complex')[] = 
        ['addition', 'subtraction', 'multiplication', 'division', 'complex'];
      
      for (let i = 0; i < totalProblems; i++) {
        const complexChance = Math.min(0.6, (waveNumber - 4) * 0.15);
        const useComplex = Math.random() < complexChance;
        const type = useComplex ? 'complex' : types[Math.floor(Math.random() * 4)];
        const problem = generateProblem(type, waveNumber, difficulty);
        problem.y = -50 - (i * Math.max(45, 80 - waveNumber * 2));
        problems.push(problem);
      }
      break;
  }
  
  return { problems, totalProblems };
};

export const checkAnswer = (problem: MathProblem, input: string): boolean => {
  return problem.answer.toString() === input;
};
