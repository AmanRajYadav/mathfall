
import { MathProblem, Wave, Difficulty } from '../types/game';

let problemIdCounter = 0;

const getDifficultyMultipliers = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy':
      return { speedMultiplier: 0.8, complexityMultiplier: 0.5, problemCount: 1.0 };
    case 'medium':
      return { speedMultiplier: 1.0, complexityMultiplier: 1.0, problemCount: 1.2 };
    case 'hard':
      return { speedMultiplier: 1.4, complexityMultiplier: 1.5, problemCount: 1.5 };
  }
};

const generateFraction = (difficulty: Difficulty) => {
  if (difficulty === 'easy') {
    const numerator = Math.floor(Math.random() * 7) + 1;
    const denominator = Math.floor(Math.random() * 8) + 2;
    if (numerator >= denominator) return generateFraction(difficulty);
    return { numerator, denominator, decimal: numerator / denominator };
  } else if (difficulty === 'medium') {
    const numerator = Math.floor(Math.random() * 15) + 1;
    const denominator = Math.floor(Math.random() * 12) + 2;
    return { numerator, denominator, decimal: numerator / denominator };
  } else {
    const numerator = Math.floor(Math.random() * 25) + 1;
    const denominator = Math.floor(Math.random() * 20) + 2;
    return { numerator, denominator, decimal: numerator / denominator };
  }
};

const generateProblem = (type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'exponents' | 'roots' | 'fractions' | 'decimals' | 'complex', waveNumber: number, difficulty: Difficulty, canvasWidth: number): MathProblem => {
  let text = '';
  let answer = 0;
  const { speedMultiplier, complexityMultiplier } = getDifficultyMultipliers(difficulty);
  
  switch (type) {
    case 'addition':
      if (difficulty === 'easy') {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        text = `${a} + ${b}`;
        answer = a + b;
      } else if (difficulty === 'medium') {
        const a = Math.floor(Math.random() * 50) + 10;
        const b = Math.floor(Math.random() * 50) + 10;
        text = `${a} + ${b}`;
        answer = a + b;
      } else {
        const a = Math.floor(Math.random() * 100) + 25;
        const b = Math.floor(Math.random() * 100) + 25;
        text = `${a} + ${b}`;
        answer = a + b;
      }
      break;
      
    case 'subtraction':
      if (difficulty === 'easy') {
        const a = Math.floor(Math.random() * 30) + 10;
        const b = Math.floor(Math.random() * (a - 5)) + 1;
        text = `${a} - ${b}`;
        answer = a - b;
      } else if (difficulty === 'medium') {
        const a = Math.floor(Math.random() * 80) + 20;
        const b = Math.floor(Math.random() * (a - 10)) + 5;
        text = `${a} - ${b}`;
        answer = a - b;
      } else {
        const a = Math.floor(Math.random() * 150) + 50;
        const b = Math.floor(Math.random() * (a - 20)) + 10;
        text = `${a} - ${b}`;
        answer = a - b;
      }
      break;
      
    case 'multiplication':
      if (difficulty === 'easy') {
        const a = Math.floor(Math.random() * 9) + 2;
        const b = Math.floor(Math.random() * 9) + 2;
        text = `${a} × ${b}`;
        answer = a * b;
      } else if (difficulty === 'medium') {
        const a = Math.floor(Math.random() * 12) + 3;
        const b = Math.floor(Math.random() * 12) + 3;
        text = `${a} × ${b}`;
        answer = a * b;
      } else {
        const a = Math.floor(Math.random() * 20) + 5;
        const b = Math.floor(Math.random() * 15) + 3;
        text = `${a} × ${b}`;
        answer = a * b;
      }
      break;
      
    case 'division':
      if (difficulty === 'easy') {
        const quotient = Math.floor(Math.random() * 12) + 2;
        const divisor = Math.floor(Math.random() * 8) + 2;
        const dividend = quotient * divisor;
        text = `${dividend} ÷ ${divisor}`;
        answer = quotient;
      } else if (difficulty === 'medium') {
        const quotient = Math.floor(Math.random() * 20) + 3;
        const divisor = Math.floor(Math.random() * 12) + 2;
        const dividend = quotient * divisor;
        text = `${dividend} ÷ ${divisor}`;
        answer = quotient;
      } else {
        const quotient = Math.floor(Math.random() * 35) + 5;
        const divisor = Math.floor(Math.random() * 18) + 3;
        const dividend = quotient * divisor;
        text = `${dividend} ÷ ${divisor}`;
        answer = quotient;
      }
      break;
      
    case 'exponents':
      if (difficulty === 'easy') {
        const base = Math.floor(Math.random() * 7) + 2;
        const exp = 2;
        text = `${base}²`;
        answer = Math.pow(base, exp);
      } else if (difficulty === 'medium') {
        const base = Math.floor(Math.random() * 8) + 2;
        const exp = Math.random() < 0.7 ? 2 : 3;
        text = exp === 2 ? `${base}²` : `${base}³`;
        answer = Math.pow(base, exp);
      } else {
        const base = Math.floor(Math.random() * 12) + 2;
        const exp = Math.floor(Math.random() * 3) + 2;
        text = exp === 2 ? `${base}²` : exp === 3 ? `${base}³` : `${base}⁴`;
        answer = Math.pow(base, exp);
      }
      break;
      
    case 'roots':
      if (difficulty === 'easy') {
        const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
        const square = perfectSquares[Math.floor(Math.random() * perfectSquares.length)];
        text = `√${square}`;
        answer = Math.sqrt(square);
      } else if (difficulty === 'medium') {
        const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169];
        const square = perfectSquares[Math.floor(Math.random() * perfectSquares.length)];
        text = `√${square}`;
        answer = Math.sqrt(square);
      } else {
        const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256];
        const perfectCubes = [8, 27, 64, 125];
        if (Math.random() < 0.7) {
          const square = perfectSquares[Math.floor(Math.random() * perfectSquares.length)];
          text = `√${square}`;
          answer = Math.sqrt(square);
        } else {
          const cube = perfectCubes[Math.floor(Math.random() * perfectCubes.length)];
          text = `∛${cube}`;
          answer = Math.round(Math.pow(cube, 1/3));
        }
      }
      break;
      
    case 'fractions':
      const frac1 = generateFraction(difficulty);
      const frac2 = generateFraction(difficulty);
      
      if (Math.random() < 0.5) {
        // Addition
        text = `${frac1.numerator}/${frac1.denominator} + ${frac2.numerator}/${frac2.denominator}`;
        const commonDenom = frac1.denominator * frac2.denominator;
        const num1 = frac1.numerator * frac2.denominator;
        const num2 = frac2.numerator * frac1.denominator;
        const resultNum = num1 + num2;
        
        // Simplify fraction
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(resultNum, commonDenom);
        answer = Math.round((resultNum / divisor) * 100 + (commonDenom / divisor) * 0.01);
      } else {
        // Convert to decimal
        text = `${frac1.numerator}/${frac1.denominator}`;
        answer = Math.round(frac1.decimal * 100) / 100;
      }
      break;
      
    case 'decimals':
      if (difficulty === 'easy') {
        const a = (Math.floor(Math.random() * 50) + 10) / 10;
        const b = (Math.floor(Math.random() * 50) + 10) / 10;
        if (Math.random() < 0.5) {
          text = `${a} + ${b}`;
          answer = Math.round((a + b) * 10) / 10;
        } else {
          text = `${Math.max(a, b)} - ${Math.min(a, b)}`;
          answer = Math.round((Math.max(a, b) - Math.min(a, b)) * 10) / 10;
        }
      } else if (difficulty === 'medium') {
        const a = (Math.floor(Math.random() * 100) + 20) / 100;
        const b = (Math.floor(Math.random() * 100) + 20) / 100;
        const operation = Math.floor(Math.random() * 3);
        if (operation === 0) {
          text = `${a} + ${b}`;
          answer = Math.round((a + b) * 100) / 100;
        } else if (operation === 1) {
          text = `${Math.max(a, b)} - ${Math.min(a, b)}`;
          answer = Math.round((Math.max(a, b) - Math.min(a, b)) * 100) / 100;
        } else {
          const c = Math.floor(Math.random() * 10) + 2;
          text = `${a} × ${c}`;
          answer = Math.round((a * c) * 100) / 100;
        }
      } else {
        const a = (Math.floor(Math.random() * 200) + 50) / 100;
        const b = (Math.floor(Math.random() * 200) + 50) / 100;
        const operation = Math.floor(Math.random() * 4);
        if (operation === 0) {
          text = `${a} + ${b}`;
          answer = Math.round((a + b) * 100) / 100;
        } else if (operation === 1) {
          text = `${Math.max(a, b)} - ${Math.min(a, b)}`;
          answer = Math.round((Math.max(a, b) - Math.min(a, b)) * 100) / 100;
        } else if (operation === 2) {
          const c = Math.floor(Math.random() * 15) + 2;
          text = `${a} × ${c}`;
          answer = Math.round((a * c) * 100) / 100;
        } else {
          const c = Math.floor(Math.random() * 8) + 2;
          text = `${a * c} ÷ ${c}`;
          answer = Math.round(a * 100) / 100;
        }
      }
      break;
      
    case 'complex':
      const complexType = Math.floor(Math.random() * 4);
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
      } else if (complexType === 2) {
        const a = Math.floor(Math.random() * 12) + 4;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 6) + 2;
        text = `${a} × ${b} - ${c}`;
        answer = (a * b) - c;
      } else {
        const base = Math.floor(Math.random() * 8) + 3;
        const add = Math.floor(Math.random() * 10) + 5;
        text = `${base}² + ${add}`;
        answer = (base * base) + add;
      }
      break;
  }
  
  const baseSpeed = (0.3 + (waveNumber * 0.08) + (Math.random() * 0.15)) * 0.6;
  const speed = baseSpeed * speedMultiplier;
  const textWidth = text.length * 12;
  const maxX = canvasWidth - textWidth - 20;
  
  return {
    id: `problem_${problemIdCounter++}`,
    text,
    answer,
    x: Math.random() * maxX + 10,
    y: -30,
    speed
  };
};

export const generateWave = (waveNumber: number, difficulty: Difficulty, canvasWidth: number = 800): Wave => {
  const problems: MathProblem[] = [];
  const { problemCount } = getDifficultyMultipliers(difficulty);
  
  const baseCounts = {
    easy: { base: 8, increment: 2 },
    medium: { base: 10, increment: 3 },
    hard: { base: 12, increment: 4 }
  };
  
  const counts = baseCounts[difficulty];
  const totalProblems = Math.floor((counts.base + (waveNumber - 1) * counts.increment) * problemCount);
  
  console.log(`Generating Wave ${waveNumber} with ${totalProblems} problems (difficulty: ${difficulty})`);
  
  const spacing = Math.max(8, 15 - (waveNumber * 0.8));
  
  // Problem type distribution based on wave
  const getProblemsForWave = (wave: number): Array<'addition' | 'subtraction' | 'multiplication' | 'division' | 'exponents' | 'roots' | 'fractions' | 'decimals' | 'complex'> => {
    if (wave === 1) return ['addition', 'subtraction'];
    if (wave === 2) return ['addition', 'subtraction', 'multiplication'];
    if (wave === 3) return ['addition', 'subtraction', 'multiplication', 'division'];
    if (wave === 4) return ['addition', 'subtraction', 'multiplication', 'division', 'exponents'];
    if (wave === 5) return ['addition', 'subtraction', 'multiplication', 'division', 'exponents', 'roots'];
    if (wave === 6) return ['addition', 'subtraction', 'multiplication', 'division', 'exponents', 'roots', 'decimals'];
    if (wave === 7) return ['addition', 'subtraction', 'multiplication', 'division', 'exponents', 'roots', 'decimals', 'fractions'];
    return ['addition', 'subtraction', 'multiplication', 'division', 'exponents', 'roots', 'decimals', 'fractions', 'complex'];
  };
  
  const availableTypes = getProblemsForWave(waveNumber);
  
  for (let i = 0; i < totalProblems; i++) {
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const problem = generateProblem(type, waveNumber, difficulty, canvasWidth);
    problem.y = -50 - (i * spacing);
    problems.push(problem);
  }
  
  console.log(`Wave ${waveNumber} generated successfully: ${problems.length} problems created`);
  
  return { problems, totalProblems };
};

export const checkAnswer = (problem: MathProblem, input: string): boolean => {
  const inputNum = parseFloat(input);
  const answerNum = problem.answer;
  
  // Handle decimal precision
  if (Math.abs(answerNum - Math.round(answerNum)) > 0.001) {
    return Math.abs(inputNum - answerNum) < 0.01;
  }
  
  return Math.abs(inputNum - answerNum) < 0.001;
};
