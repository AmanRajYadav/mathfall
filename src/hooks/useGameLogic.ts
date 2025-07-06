
import { useCallback, useEffect } from 'react';
import { MathProblem, Particle } from '../types/game';
import { checkAnswer } from '../utils/gameLogic';
import { updateStatistics, saveStatistics } from '../utils/statisticsManager';
import { playSound, stopBackgroundMusic } from '../utils/audio';
import { useGameState } from './useGameState';

export const useGameLogic = () => {
  const { gameState, gameStateRef, updateGameState, startNextWave } = useGameState();

  const findTargetProblem = useCallback((input: string): MathProblem | null => {
    if (!input) return null;
    
    const currentState = gameStateRef.current;
    return currentState.problems
      .filter(p => p.answer.toString().startsWith(input))
      .sort((a, b) => b.y - a.y)[0] || null;
  }, [gameStateRef]);

  const createExplosion = useCallback((x: number, y: number, isStreak = false) => {
    const particles: Particle[] = [];
    const particleCount = isStreak ? 30 : 20;
    const colors = isStreak ? ['#ffff00', '#ffa500', '#ff6b6b', '#00ff00'] : ['#ffffff', '#66fcf1'];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * (isStreak ? 15 : 10),
        vy: (Math.random() - 0.5) * (isStreak ? 15 : 10),
        life: isStreak ? 50 : 35,
        maxLife: isStreak ? 50 : 35,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    updateGameState(state => ({
      ...state,
      particles: [...state.particles, ...particles]
    }));
  }, [updateGameState]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const currentState = gameStateRef.current;
    
    if (currentState.gameStatus !== 'playing') return;

    const key = event.key;
    
    if (key >= '0' && key <= '9') {
      const newInput = currentState.currentInput + key;
      const targetProblem = findTargetProblem(newInput);
      
      if (targetProblem) {
        if (checkAnswer(targetProblem, newInput)) {
          playSound('destroy');
          const isStreak = currentState.statistics.currentStreak >= 5;
          createExplosion(targetProblem.x + 50, targetProblem.y + 15, isStreak);
          
          const baseScore = 10;
          const streakMultiplier = Math.floor(currentState.statistics.currentStreak / 5) + 1;
          const scoreGain = baseScore * streakMultiplier;
          
          const newStats = updateStatistics(currentState.statistics, {
            currentStreak: currentState.statistics.currentStreak + 1,
            totalQuestionsAnswered: currentState.statistics.totalQuestionsAnswered + 1,
            correctAnswers: currentState.statistics.correctAnswers + 1
          });
          
          updateGameState(state => ({
            ...state,
            problems: state.problems.filter(p => p.id !== targetProblem.id),
            score: state.score + scoreGain,
            currentInput: '',
            targetProblem: null,
            problemsHandled: state.problemsHandled + 1,
            statistics: newStats
          }));
        } else {
          updateGameState(state => ({
            ...state,
            currentInput: newInput,
            targetProblem
          }));
        }
      } else {
        const newStats = updateStatistics(currentState.statistics, {
          currentStreak: 0,
          totalQuestionsAnswered: currentState.statistics.totalQuestionsAnswered + 1
        });
        
        updateGameState(state => ({
          ...state,
          currentInput: '',
          targetProblem: null,
          statistics: newStats
        }));
      }
    } else if (key === 'Backspace') {
      const newInput = currentState.currentInput.slice(0, -1);
      const targetProblem = findTargetProblem(newInput);
      
      updateGameState(state => ({
        ...state,
        currentInput: newInput,
        targetProblem
      }));
    }
  }, [findTargetProblem, createExplosion, updateGameState, gameStateRef]);

  const gameLoop = useCallback(() => {
    const currentState = gameStateRef.current;
    
    if (currentState.gameStatus !== 'playing') return;

    const waveProgress = currentState.problemsHandled / currentState.totalProblemsInWave;
    const speedBoost = 1 + (waveProgress * 0.03);
    
    const updatedProblems = currentState.problems.map(problem => ({
      ...problem,
      y: problem.y + (problem.speed * speedBoost)
    }));

    const problemsAtBottom = updatedProblems.filter(p => p.y > 550);
    const remainingProblems = updatedProblems.filter(p => p.y <= 550);

    let newLives = currentState.lives;
    let newProblemsHandled = currentState.problemsHandled;
    let newStats = currentState.statistics;

    if (problemsAtBottom.length > 0) {
      newLives -= problemsAtBottom.length;
      newProblemsHandled += problemsAtBottom.length;
      newStats = updateStatistics(currentState.statistics, {
        currentStreak: 0,
        totalQuestionsAnswered: currentState.statistics.totalQuestionsAnswered + problemsAtBottom.length
      });
      playSound('loseLife');
    }

    const updatedParticles = currentState.particles
      .map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1
      }))
      .filter(particle => particle.life > 0);

    if (newLives <= 0) {
      stopBackgroundMusic();
      const finalStats = updateStatistics(newStats, {
        highScore: Math.max(newStats.highScore, currentState.score),
        timePlayedSeconds: newStats.timePlayedSeconds + Math.floor((Date.now() - currentState.gameStartTime) / 1000)
      });
      saveStatistics(finalStats);
      
      updateGameState(state => ({
        ...state,
        gameStatus: 'gameOver' as const,
        lives: 0,
        statistics: finalStats
      }));
      return;
    }

    // Wave completion check - fixed logic
    if (newProblemsHandled >= currentState.totalProblemsInWave) {
      console.log(`Wave ${currentState.wave} complete! Starting next wave...`);
      playSound('waveComplete');
      
      updateGameState(state => ({
        ...state,
        gameStatus: 'waveComplete' as const,
        problems: [],
        particles: updatedParticles,
        lives: newLives,
        problemsHandled: newProblemsHandled,
        statistics: newStats
      }));

      setTimeout(() => {
        startNextWave();
      }, 1500);
      return;
    }

    updateGameState(state => ({
      ...state,
      problems: remainingProblems,
      particles: updatedParticles,
      lives: newLives,
      problemsHandled: newProblemsHandled,
      statistics: newStats,
      targetProblem: state.targetProblem && remainingProblems.find(p => p.id === state.targetProblem?.id) || null
    }));
  }, [updateGameState, startNextWave, gameStateRef]);

  return {
    gameState,
    handleKeyPress,
    gameLoop,
    startGame: useGameState().startGame
  };
};
