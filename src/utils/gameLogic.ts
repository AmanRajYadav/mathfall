
import { MathProblem, Wave } from '../types/game';

let problemIdCounter = 0;

const generateProblem = (type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'complex', difficulty: number): MathProblem => {
  let text = '';
  let answer = 0;
  
  switch (type) {
    case 'addition':
      // Mix of simple and harder addition
      const useHard = difficulty > 2 && Math.random() < 0.3;
      if (useHard) {
        const a1 = Math.floor(Math.random() * 45) + 15; // 15-59
        const b1 = Math.floor(Math.random() * 35) + 10; // 10-44
        text = `${a1} + ${b1}`;
        answer = a1 + b1;
      } else {
        const a1 = Math.floor(Math.random() * 9) + 1;
        const b1 = Math.floor(Math.random() * 9) + 1;
        text = `${a1} + ${b1}`;
        answer = a1 + b1;
      }
      break;
      
    case 'subtraction':
      const useHardSub = difficulty > 2 && Math.random() < 0.3;
      if (useHardSub) {
        const a2 = Math.floor(Math.random() * 80) + 20; // 20-99
        const b2 = Math.floor(Math.random() * (a2 - 10)) + 5; // Ensure positive result
        text = `${a2} - ${b2}`;
        answer = a2 - b2;
      } else {
        const a2 = Math.floor(Math.random() * 20) + 6;
        const b2 = Math.floor(Math.random() * (a2 - 1)) + 1;
        text = `${a2} - ${b2}`;
        answer = a2 - b2;
      }
      break;
      
    case 'multiplication':
      const useHardMult = difficulty > 3 && Math.random() < 0.4;
      if (useHardMult) {
        // Harder multiplication like 15×7, 13×8, etc.
        const a3 = Math.floor(Math.random() * 8) + 12; // 12-19
        const b3 = Math.floor(Math.random() * 9) + 2; // 2-10
        text = `${a3} × ${b3}`;
        answer = a3 * b3;
      } else {
        const a3 = Math.floor(Math.random() * 11) + 2;
        const b3 = Math.floor(Math.random() * 11) + 2;
        text = `${a3} × ${b3}`;
        answer = a3 * b3;
      }
      break;
      
    case 'division':
      // Simple division that results in whole numbers
      const quotient = Math.floor(Math.random() * 12) + 2; // 2-13
      const divisor = Math.floor(Math.random() * 8) + 2; // 2-9
      const dividend = quotient * divisor;
      text = `${dividend} ÷ ${divisor}`;
      answer = quotient;
      break;
      
    case 'complex':
      // More complex problems for higher waves
      const complexType = Math.floor(Math.random() * 3);
      if (complexType === 0) {
        // Two-step addition/subtraction like (15 + 8) - 7
        const a = Math.floor(Math.random() * 15) + 10;
        const b = Math.floor(Math.random() * 10) + 5;
        const c = Math.floor(Math.random() * 8) + 3;
        text = `(${a} + ${b}) - ${c}`;
        answer = (a + b) - c;
      } else if (complexType === 1) {
        // Mixed operations like 12 + 6 × 2
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 6) + 2;
        text = `${a} + ${b} × ${c}`;
        answer = a + (b * c); // Order of operations
      } else {
        // Square numbers like 7²
        const base = Math.floor(Math.random() * 8) + 3; // 3-10
        text = `${base}²`;
        answer = base * base;
      }
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
      totalProblems = 12;
      for (let i = 0; i < totalProblems; i++) {
        const problem = generateProblem('addition', 1);
        problem.y = -50 - (i * 120); // More spacing
        problems.push(problem);
      }
      break;
      
    case 2:
      // Wave 2: Addition + Subtraction
      totalProblems = 15;
      for (let i = 0; i < totalProblems; i++) {
        const type = Math.random() < 0.6 ? 'addition' : 'subtraction';
        const problem = generateProblem(type, 2);
        problem.y = -50 - (i * 100);
        problems.push(problem);
      }
      break;
      
    case 3:
      // Wave 3: Multiplication + Some Division
      totalProblems = 18;
      for (let i = 0; i < totalProblems; i++) {
        const type = Math.random() < 0.8 ? 'multiplication' : 'division';
        const problem = generateProblem(type, 3);
        problem.y = -50 - (i * 90);
        problems.push(problem);
      }
      break;
      
    case 4:
      // Wave 4: Mixed Operations
      totalProblems = 20;
      for (let i = 0; i < totalProblems; i++) {
        const types: ('addition' | 'subtraction' | 'multiplication' | 'division')[] = 
          ['addition', 'subtraction', 'multiplication', 'division'];
        const type = types[Math.floor(Math.random() * types.length)];
        const problem = generateProblem(type, 4);
        problem.y = -50 - (i * 80);
        problems.push(problem);
      }
      break;
      
    case 5:
      // Wave 5: Complex Problems Start
      totalProblems = 22;
      for (let i = 0; i < totalProblems; i++) {
        const useComplex = Math.random() < 0.4;
        const type = useComplex ? 'complex' : 
          (['addition', 'subtraction', 'multiplication', 'division'] as const)[Math.floor(Math.random() * 4)];
        const problem = generateProblem(type, 5);
        problem.y = -50 - (i * 75);
        problems.push(problem);
      }
      break;
      
    default:
      // Dynamic waves - increase complexity and speed
      totalProblems = Math.min(25, 15 + (waveNumber * 2));
      const types: ('addition' | 'subtraction' | 'multiplication' | 'division' | 'complex')[] = 
        ['addition', 'subtraction', 'multiplication', 'division', 'complex'];
      
      for (let i = 0; i < totalProblems; i++) {
        // Higher chance of complex problems in later waves
        const complexChance = Math.min(0.6, (waveNumber - 4) * 0.15);
        const useComplex = Math.random() < complexChance;
        const type = useComplex ? 'complex' : types[Math.floor(Math.random() * 4)];
        const problem = generateProblem(type, waveNumber);
        problem.y = -50 - (i * Math.max(50, 100 - waveNumber * 3));
        problems.push(problem);
      }
      break;
  }
  
  return { problems, totalProblems };
};

export const checkAnswer = (problem: MathProblem, input: string): boolean => {
  return problem.answer.toString() === input;
};
