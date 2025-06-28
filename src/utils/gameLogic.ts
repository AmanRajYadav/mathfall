
import { MathProblem, Wave } from '../types/game';

let problemIdCounter = 0;

const generateProblem = (type: 'addition' | 'subtraction' | 'multiplication', difficulty: number): MathProblem => {
  let text = '';
  let answer = 0;
  
  switch (type) {
    case 'addition':
      const a1 = Math.floor(Math.random() * 9) + 1;
      const b1 = Math.floor(Math.random() * 9) + 1;
      text = `${a1} + ${b1}`;
      answer = a1 + b1;
      break;
      
    case 'subtraction':
      const a2 = Math.floor(Math.random() * 20) + 6;
      const b2 = Math.floor(Math.random() * (a2 - 1)) + 1;
      text = `${a2} - ${b2}`;
      answer = a2 - b2;
      break;
      
    case 'multiplication':
      const a3 = Math.floor(Math.random() * 11) + 2;
      const b3 = Math.floor(Math.random() * 11) + 2;
      text = `${a3} × ${b3}`;
      answer = a3 * b3;
      break;
  }
  
  // Reduced speed by 60% (multiply by 0.4)
  const speed = (0.5 + (difficulty * 0.3) + (Math.random() * 0.5)) * 0.4;
  const textWidth = text.length * 12; // Approximate character width
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

export const generateWave = (waveNumber: number): Wave => {
  const problems: MathProblem[] = [];
  let totalProblems = 0;
  
  switch (waveNumber) {
    case 1:
      // Wave 1: Simple Addition
      totalProblems = 15;
      for (let i = 0; i < totalProblems; i++) {
        const problem = generateProblem('addition', 1);
        problem.y = -50 - (i * 100); // Space problems out
        problems.push(problem);
      }
      break;
      
    case 2:
      // Wave 2: Addition + Subtraction
      totalProblems = 20;
      for (let i = 0; i < totalProblems; i++) {
        const type = Math.random() < 0.5 ? 'addition' : 'subtraction';
        const problem = generateProblem(type, 2);
        problem.y = -50 - (i * 80);
        problems.push(problem);
      }
      break;
      
    case 3:
      // Wave 3: Multiplication
      totalProblems = 20;
      for (let i = 0; i < totalProblems; i++) {
        const problem = generateProblem('multiplication', 3);
        problem.y = -50 - (i * 70);
        problems.push(problem);
      }
      break;
      
    default:
      // Dynamic waves - increase complexity
      totalProblems = 15 + (waveNumber * 3);
      const types: ('addition' | 'subtraction' | 'multiplication')[] = ['addition', 'subtraction', 'multiplication'];
      
      for (let i = 0; i < totalProblems; i++) {
        const typeIndex = Math.floor(Math.random() * Math.min(3, waveNumber));
        const type = types[typeIndex];
        const problem = generateProblem(type, waveNumber);
        problem.y = -50 - (i * Math.max(40, 100 - waveNumber * 5));
        problems.push(problem);
      }
      break;
  }
  
  return { problems, totalProblems };
};

export const checkAnswer = (problem: MathProblem, input: string): boolean => {
  return problem.answer.toString() === input;
};
