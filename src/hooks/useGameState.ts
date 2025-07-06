
import { useState, useCallback, useRef } from 'react';
import { GameState, MathProblem, Difficulty } from '../types/game';
import { generateWave } from '../utils/gameLogic';
import { getStoredStatistics, updateStatistics } from '../utils/statisticsManager';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    wave: 1,
    problems: [],
    particles: [],
    currentInput: '',
    targetProblem: null,
    gameStatus: 'menu',
    totalProblemsInWave: 0,
    problemsHandled: 0,
    difficulty: 'medium',
    statistics: getStoredStatistics(),
    gameStartTime: Date.now()
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const updateGameState = useCallback((updater: (state: GameState) => GameState) => {
    setGameState(prevState => {
      const newState = updater(prevState);
      gameStateRef.current = newState;
      return newState;
    });
  }, []);

  const startGame = useCallback((difficulty: Difficulty) => {
    const wave1 = generateWave(1, difficulty);
    const startTime = Date.now();
    
    console.log(`Starting game with Wave 1: ${wave1.totalProblems} problems`);
    
    updateGameState(() => ({
      score: 0,
      lives: 3,
      wave: 1,
      problems: wave1.problems,
      particles: [],
      currentInput: '',
      targetProblem: null,
      gameStatus: 'playing' as const,
      totalProblemsInWave: wave1.totalProblems,
      problemsHandled: 0,
      difficulty,
      gameStartTime: startTime,
      statistics: {
        ...getStoredStatistics(),
        currentStreak: 0
      }
    }));
  }, [updateGameState]);

  const startNextWave = useCallback(() => {
    const currentWave = gameStateRef.current.wave + 1;
    const wave = generateWave(currentWave, gameStateRef.current.difficulty);
    
    console.log(`Starting Wave ${currentWave} with ${wave.totalProblems} problems`);
    
    updateGameState(state => ({
      ...state,
      wave: currentWave,
      problems: wave.problems,
      particles: [],
      currentInput: '',
      targetProblem: null,
      totalProblemsInWave: wave.totalProblems,
      problemsHandled: 0,
      gameStatus: 'playing' as const
    }));
  }, [updateGameState]);

  return {
    gameState,
    gameStateRef,
    updateGameState,
    startGame,
    startNextWave
  };
};
