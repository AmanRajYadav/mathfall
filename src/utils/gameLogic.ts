
import { MathProblem, Wave, Difficulty } from '../types/game';

let problemIdCounter = 0;

const getDifficultyMultipliers = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy':
      return { speedMultiplier: 0.5, complexityMultiplier: 0.6, problemCount: 1.0, spacingMultiplier: 1.2 };
    case 'medium':
      return { speedMultiplier: 1.0, complexityMultiplier: 1.0, problemCount: 1.2, spacingMultiplier: 2.5 };
    case 'hard':
      return { speedMultiplier: 1.3, complexityMultiplier: 1.4, problemCount: 1.4, spacingMultiplier: 5.0 };
  }
};

const generateProblem = (type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'exponents' | 'roots' | 'fractions' | 'decimals' | 'complex', waveNumber: number, difficulty: Difficulty, canvasWidth: number): MathProblem => {
  let text = '';
  let answer = 0;
  const { speedMultiplier, complexityMultiplier } = getDifficultyMultipliers(difficulty);
  const waveComplexity = Math.min(waveNumber * 0.2, 2.0); // Cap complexity boost
  
  switch (type) {
    case 'addition':
      if (difficulty === 'easy') {
        const a = Math.floor(Math.random() * (15 + waveNumber * 3)) + 1;
        const b = Math.floor(Math.random() * (15 + waveNumber * 3)) + 1;
        text = `${a} + ${b}`;
        answer = a + b;
      } else if (difficulty === 'medium') {
        const a = Math.floor(Math.random() * (40 + waveNumber * 5)) + 10;
        const b = Math.floor(Math.random() * (40 + waveNumber * 5)) + 10;
        text = `${a} + ${b}`;
        answer = a + b;
      } else {
        const a = Math.floor(Math.random() * (80 + waveNumber * 8)) + 25;
        const b = Math.floor(Math.random() * (80 + waveNumber * 8)) + 25;
        text = `${a} + ${b}`;
        answer = a + b;
      }
      break;
      
    case 'subtraction':
      if (difficulty === 'easy') {
        const a = Math.floor(Math.random() * (25 + waveNumber * 4)) + 10;
        const b = Math.floor(Math.random() * (a - 5)) + 1;
        text = `${a} - ${b}`;
        answer = a - b;
      } else if (difficulty === 'medium') {
        const a = Math.floor(Math.random() * (70 + waveNumber * 6)) + 20;
        const b = Math.floor(Math.random() * (a - 10)) + 5;
        text = `${a} - ${b}`;
        answer = a - b;
      } else {
        const a = Math.floor(Math.random() * (120 + waveNumber * 10)) + 50;
        const b = Math.floor(Math.random() * (a - 20)) + 10;
        text = `${a} - ${b}`;
        answer = a - b;
      }
      break;
      
    case 'multiplication':
      if (difficulty === 'easy') {
        const a = Math.floor(Math.random() * (7 + Math.floor(waveNumber / 2))) + 2;
        const b = Math.floor(Math.random() * (7 + Math.floor(waveNumber / 2))) + 2;
        text = `${a} × ${b}`;
        answer = a * b;
      } else if (difficulty === 'medium') {
        const a = Math.floor(Math.random() * (10 + waveNumber)) + 3;
        const b = Math.floor(Math.random() * (10 + waveNumber)) + 3;
        text = `${a} × ${b}`;
        answer = a * b;
      } else {
        const a = Math.floor(Math.random() * (15 + waveNumber * 2)) + 5;
        const b = Math.floor(Math.random() * (12 + waveNumber)) + 3;
        text = `${a} × ${b}`;
        answer = a * b;
      }
      break;
      
    case 'division':
      if (difficulty === 'easy') {
        const quotient = Math.floor(Math.random() * (10 + waveNumber)) + 2;
        const divisor = Math.floor(Math.random() * (6 + Math.floor(waveNumber / 2))) + 2;
        const dividend = quotient * divisor;
        text = `${dividend} ÷ ${divisor}`;
        answer = quotient;
      } else if (difficulty === 'medium') {
        const quotient = Math.floor(Math.random() * (15 + waveNumber * 2)) + 3;
        const divisor = Math.floor(Math.random() * (10 + waveNumber)) + 2;
        const dividend = quotient * divisor;
        text = `${dividend} ÷ ${divisor}`;
        answer = quotient;
      } else {
        const quotient = Math.floor(Math.random() * (25 + waveNumber * 3)) + 5;
        const divisor = Math.floor(Math.random() * (15 + waveNumber)) + 3;
        const dividend = quotient * divisor;
        text = `${dividend} ÷ ${divisor}`;
        answer = quotient;
      }
      break;
      
    case 'exponents':
      if (difficulty === 'easy') {
        const base = Math.floor(Math.random() * (5 + Math.floor(waveNumber / 2))) + 2;
        const exp = 2;
        text = `${base}²`;
        answer = Math.pow(base, exp);
      } else if (difficulty === 'medium') {
        const base = Math.floor(Math.random() * (6 + Math.floor(waveNumber / 2))) + 2;
        const exp = Math.random() < 0.7 ? 2 : 3;
        text = exp === 2 ? `${base}²` : `${base}³`;
        answer = Math.pow(base, exp);
      } else {
        const base = Math.floor(Math.random() * (8 + waveNumber)) + 2;
        const exp = Math.floor(Math.random() * 3) + 2;
        text = exp === 2 ? `${base}²` : exp === 3 ? `${base}³` : `${base}⁴`;
        answer = Math.pow(base, exp);
      }
      break;
      
    case 'roots':
      if (difficulty === 'easy') {
        const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
        const maxIndex = Math.min(perfectSquares.length - 1, 5 + Math.floor(waveNumber / 2));
        const square = perfectSquares[Math.floor(Math.random() * (maxIndex + 1))];
        text = `√${square}`;
        answer = Math.sqrt(square);
      } else if (difficulty === 'medium') {
        const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169];
        const maxIndex = Math.min(perfectSquares.length - 1, 7 + Math.floor(waveNumber / 2));
        const square = perfectSquares[Math.floor(Math.random() * (maxIndex + 1))];
        text = `√${square}`;
        answer = Math.sqrt(square);
      } else {
        const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324];
        const perfectCubes = [8, 27, 64, 125, 216];
        if (Math.random() < 0.8 || waveNumber < 3) {
          const maxIndex = Math.min(perfectSquares.length - 1, 9 + waveNumber);
          const square = perfectSquares[Math.floor(Math.random() * (maxIndex + 1))];
          text = `√${square}`;
          answer = Math.sqrt(square);
        } else {
          const maxIndex = Math.min(perfectCubes.length - 1, 2 + Math.floor(waveNumber / 3));
          const cube = perfectCubes[Math.floor(Math.random() * (maxIndex + 1))];
          text = `∛${cube}`;
          answer = Math.round(Math.pow(cube, 1/3));
        }
      }
      break;
      
    case 'fractions':
      const generateFraction = (diff: Difficulty, wave: number) => {
        if (diff === 'easy') {
          const numerator = Math.floor(Math.random() * (4 + Math.floor(wave / 2))) + 1;
          const denominator = Math.floor(Math.random() * (6 + Math.floor(wave / 2))) + 2;
          if (numerator >= denominator) return generateFraction(diff, wave);
          return { numerator, denominator, decimal: numerator / denominator };
        } else if (diff === 'medium') {
          const numerator = Math.floor(Math.random() * (8 + wave)) + 1;
          const denominator = Math.floor(Math.random() * (10 + wave)) + 2;
          return { numerator, denominator, decimal: numerator / denominator };
        } else {
          const numerator = Math.floor(Math.random() * (12 + wave * 2)) + 1;
          const denominator = Math.floor(Math.random() * (15 + wave * 2)) + 2;
          return { numerator, denominator, decimal: numerator / denominator };
        }
      };
      
      const frac1 = generateFraction(difficulty, waveNumber);
      
      if (Math.random() < 0.6 && waveNumber > 2) {
        // Addition of fractions
        const frac2 = generateFraction(difficulty, waveNumber);
        text = `${frac1.numerator}/${frac1.denominator} + ${frac2.numerator}/${frac2.denominator}`;
        const result = frac1.decimal + frac2.decimal;
        answer = Math.round(result * 100) / 100;
      } else {
        // Convert to decimal
        text = `${frac1.numerator}/${frac1.denominator}`;
        answer = Math.round(frac1.decimal * 100) / 100;
      }
      break;
      
    case 'decimals':
      if (difficulty === 'easy') {
        const a = Math.round((Math.random() * (3 + waveNumber * 0.5) + 1) * 10) / 10;
        const b = Math.round((Math.random() * (3 + waveNumber * 0.5) + 1) * 10) / 10;
        if (Math.random() < 0.5) {
          text = `${a} + ${b}`;
          answer = Math.round((a + b) * 10) / 10;
        } else {
          text = `${Math.max(a, b)} - ${Math.min(a, b)}`;
          answer = Math.round((Math.max(a, b) - Math.min(a, b)) * 10) / 10;
        }
      } else if (difficulty === 'medium') {
        const a = Math.round((Math.random() * (5 + waveNumber) + 2) * 100) / 100;
        const b = Math.round((Math.random() * (5 + waveNumber) + 2) * 100) / 100;
        const operation = Math.floor(Math.random() * 3);
        if (operation === 0) {
          text = `${a} + ${b}`;
          answer = Math.round((a + b) * 100) / 100;
        } else if (operation === 1) {
          text = `${Math.max(a, b)} - ${Math.min(a, b)}`;
          answer = Math.round((Math.max(a, b) - Math.min(a, b)) * 100) / 100;
        } else {
          const c = Math.floor(Math.random() * (8 + waveNumber)) + 2;
          text = `${a} × ${c}`;
          answer = Math.round((a * c) * 100) / 100;
        }
      } else {
        const a = Math.round((Math.random() * (8 + waveNumber * 1.5) + 3) * 100) / 100;
        const b = Math.round((Math.random() * (8 + waveNumber * 1.5) + 3) * 100) / 100;
        const operation = Math.floor(Math.random() * 4);
        if (operation === 0) {
          text = `${a} + ${b}`;
          answer = Math.round((a + b) * 100) / 100;
        } else if (operation === 1) {
          text = `${Math.max(a, b)} - ${Math.min(a, b)}`;
          answer = Math.round((Math.max(a, b) - Math.min(a, b)) * 100) / 100;
        } else if (operation === 2) {
          const c = Math.floor(Math.random() * (12 + waveNumber)) + 2;
          text = `${a} × ${c}`;
          answer = Math.round((a * c) * 100) / 100;
        } else {
          const c = Math.floor(Math.random() * (6 + Math.floor(waveNumber / 2))) + 2;
          text = `${(a * c).toFixed(2)} ÷ ${c}`;
          answer = Math.round(a * 100) / 100;
        }
      }
      break;
      
    case 'complex':
      const complexType = Math.floor(Math.random() * 4);
      const complexityBoost = Math.floor(waveNumber * complexityMultiplier);
      
      if (complexType === 0) {
        const a = Math.floor(Math.random() * (10 + complexityBoost)) + 10;
        const b = Math.floor(Math.random() * (8 + complexityBoost)) + 5;
        const c = Math.floor(Math.random() * (6 + complexityBoost)) + 3;
        text = `(${a} + ${b}) - ${c}`;
        answer = (a + b) - c;
      } else if (complexType === 1) {
        const a = Math.floor(Math.random() * (12 + complexityBoost)) + 5;
        const b = Math.floor(Math.random() * (6 + complexityBoost)) + 2;
        const c = Math.floor(Math.random() * (4 + complexityBoost)) + 2;
        text = `${a} + ${b} × ${c}`;
        answer = a + (b * c);
      } else if (complexType === 2) {
        const a = Math.floor(Math.random() * (8 + complexityBoost)) + 4;
        const b = Math.floor(Math.random() * (6 + complexityBoost)) + 2;
        const c = Math.floor(Math.random() * (4 + complexityBoost)) + 2;
        text = `${a} × ${b} - ${c}`;
        answer = (a * b) - c;
      } else {
        const base = Math.floor(Math.random() * (6 + Math.floor(complexityBoost / 2))) + 3;
        const add = Math.floor(Math.random() * (8 + complexityBoost)) + 5;
        text = `${base}² + ${add}`;
        answer = (base * base) + add;
      }
      break;
  }
  
  const baseSpeed = (0.25 + (waveNumber * 0.06) + (Math.random() * 0.12)) * 0.7;
  const speed = baseSpeed * speedMultiplier;
  const textWidth = text.length * 12;
  const maxX = canvasWidth - textWidth - 20;
  
  // Determine problem personality and appearance based on complexity and difficulty
  let personality: 'friendly' | 'neutral' | 'aggressive' | 'boss';
  let size: 'small' | 'medium' | 'large' | 'giant';
  let health: number = 1;
  
  // Aggressive/boss personalities mainly for hard difficulty
  if (difficulty === 'hard') {
    const complexityScore = (type === 'complex' ? 3 : type === 'exponents' || type === 'roots' ? 2 : 1) + 
                           (waveNumber > 3 ? 2 : waveNumber > 1 ? 1 : 0);
    
    // Lower thresholds so we see boss/aggressive problems earlier
    if (complexityScore >= 4 || (waveNumber > 5 && Math.random() < 0.3)) {
      personality = 'boss';
      size = 'giant';
      health = 3;
    } else if (complexityScore >= 2 || (waveNumber > 2 && Math.random() < 0.4)) {
      personality = 'aggressive';
      size = 'large';
      health = 2;
    } else if (Math.random() < 0.3) {
      personality = 'neutral';
      size = 'medium';
      health = 1;
    } else {
      personality = 'friendly';
      size = 'small';
      health = 1;
    }
  } else {
    // Easy/medium problems are mostly friendly or neutral
    const complexityScore = (type === 'complex' ? 2 : type === 'exponents' || type === 'roots' ? 1 : 0) + 
                           (waveNumber > 7 ? 1 : 0);
    
    if (complexityScore >= 2) {
      personality = 'neutral';
      size = 'medium';
      health = 1;
    } else {
      personality = 'friendly';
      size = 'small';
      health = 1;
    }
  }
  
  // Random variation for diversity - but respect difficulty constraints
  if (Math.random() < 0.2) { // Increased from 0.1 to 0.2 for more variety
    if (difficulty === 'hard') {
      const personalities: Array<'friendly' | 'neutral' | 'aggressive' | 'boss'> = ['aggressive', 'boss', 'neutral'];
      if (waveNumber > 3) personalities.push('boss'); // Earlier boss appearance
      personality = personalities[Math.floor(Math.random() * personalities.length)];
    } else {
      // Easy/medium can only be friendly or neutral
      const personalities: Array<'friendly' | 'neutral'> = ['friendly', 'neutral'];
      personality = personalities[Math.floor(Math.random() * personalities.length)];
    }
  }
  
  // Add personality-based emojis to problems
  const getPersonalityEmoji = (personality: string): string => {
    switch (personality) {
      case 'friendly':
        const friendlyEmojis = ['😊', '🙂', '😄', '😆', '🤗', '😇'];
        return friendlyEmojis[Math.floor(Math.random() * friendlyEmojis.length)];
      case 'aggressive':
        const aggressiveEmojis = ['😠', '😤', '👿', '💢', '🔥', '⚡'];
        return aggressiveEmojis[Math.floor(Math.random() * aggressiveEmojis.length)];
      case 'boss':
        const bossEmojis = ['👑', '💀', '⚔️', '🏆', '💎', '🌟'];
        return bossEmojis[Math.floor(Math.random() * bossEmojis.length)];
      default: // neutral
        const neutralEmojis = ['🤔', '📝', '🧠', '💭', '🎯', '⭐'];
        return neutralEmojis[Math.floor(Math.random() * neutralEmojis.length)];
    }
  };
  
  const personalityEmoji = getPersonalityEmoji(personality);
  const finalText = `${text} ${personalityEmoji}`;
  
  // Debug log for boss/aggressive problems
  if (personality === 'boss' || personality === 'aggressive') {
    console.log(`Generated ${personality} problem: ${finalText} (difficulty: ${difficulty}, wave: ${waveNumber})`);
  }
  
  return {
    id: `problem_${problemIdCounter++}`,
    text: finalText,
    answer,
    x: Math.random() * Math.max(maxX, 50) + 10,
    y: -30,
    speed,
    difficulty,
    personality,
    size,
    health
  };
};

export const generateWave = (waveNumber: number, difficulty: Difficulty, canvasWidth: number = 800): Wave => {
  const problems: MathProblem[] = [];
  const { problemCount, spacingMultiplier } = getDifficultyMultipliers(difficulty);
  
  const baseCounts = {
    easy: { base: 6, increment: 1 },
    medium: { base: 8, increment: 2 },
    hard: { base: 10, increment: 3 }
  };
  
  const counts = baseCounts[difficulty];
  const totalProblems = Math.floor((counts.base + (waveNumber - 1) * counts.increment) * problemCount);
  
  console.log(`Generating Wave ${waveNumber} with ${totalProblems} problems (difficulty: ${difficulty})`);
  
  // Apply difficulty-based spacing multiplier
  const baseSpacing = Math.max(8, 18 - (waveNumber * 0.5));
  const spacing = baseSpacing * spacingMultiplier;
  
  // Problem type distribution based on wave - progressive introduction
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
    const typeIndex = Math.floor(Math.random() * availableTypes.length);
    const type = availableTypes[typeIndex];
    const problem = generateProblem(type, waveNumber, difficulty, canvasWidth);
    problem.y = -50 - (i * spacing);
    problems.push(problem);
  }
  
  console.log(`Wave ${waveNumber} generated successfully: ${problems.length} problems created with spacing: ${spacing.toFixed(1)} (${difficulty} mode)`);
  
  return { problems, totalProblems };
};

export const checkAnswer = (problem: MathProblem, input: string): boolean => {
  const inputNum = parseFloat(input);
  const answerNum = problem.answer;
  
  if (isNaN(inputNum) || isNaN(answerNum)) return false;
  
  // Handle decimal precision with tolerance
  if (Math.abs(answerNum - Math.round(answerNum)) > 0.001) {
    return Math.abs(inputNum - answerNum) < 0.01;
  }
  
  return Math.abs(inputNum - answerNum) < 0.001;
};
