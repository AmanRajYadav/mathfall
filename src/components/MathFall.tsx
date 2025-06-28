
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, MathProblem, Particle, Difficulty } from '../types/game';
import { generateWave, checkAnswer } from '../utils/gameLogic';
import { getStoredStatistics, saveStatistics, updateStatistics } from '../utils/statisticsManager';
import { playSound, playBackgroundMusic, stopBackgroundMusic } from '../utils/audio';
import GameMenu from './GameMenu';
import GameHUD from './GameHUD';
import StatisticsPanel from './StatisticsPanel';
import SettingsPanel from './SettingsPanel';

const MathFall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameStateRef = useRef<GameState>({
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

  const [gameState, setGameState] = useState<GameState>(gameStateRef.current);
  const [starField, setStarField] = useState<Array<{x: number, y: number, speed: number}>>([]);

  // Initialize star field
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        speed: Math.random() * 0.5 + 0.1
      });
    }
    setStarField(stars);
  }, []);

  const updateGameState = useCallback((updater: (state: GameState) => GameState) => {
    gameStateRef.current = updater(gameStateRef.current);
    setGameState({ ...gameStateRef.current });
  }, []);

  const startGame = useCallback((difficulty: Difficulty) => {
    playBackgroundMusic();
    const wave1 = generateWave(1, difficulty);
    const startTime = Date.now();
    
    updateGameState(state => ({
      ...state,
      gameStatus: 'playing',
      score: 0,
      lives: 3,
      wave: 1,
      problems: wave1.problems,
      particles: [],
      currentInput: '',
      targetProblem: null,
      totalProblemsInWave: wave1.totalProblems,
      problemsHandled: 0,
      difficulty,
      gameStartTime: startTime,
      statistics: {
        ...state.statistics,
        currentStreak: 0
      }
    }));
  }, [updateGameState]);

  const startNextWave = useCallback(() => {
    const currentWave = gameStateRef.current.wave + 1;
    const wave = generateWave(currentWave, gameStateRef.current.difficulty);
    
    updateGameState(state => ({
      ...state,
      wave: currentWave,
      problems: wave.problems,
      particles: [],
      currentInput: '',
      targetProblem: null,
      totalProblemsInWave: wave.totalProblems,
      problemsHandled: 0,
      gameStatus: 'playing'
    }));
  }, [updateGameState]);

  const pauseGame = useCallback(() => {
    updateGameState(state => ({
      ...state,
      gameStatus: state.gameStatus === 'paused' ? 'playing' : 'paused'
    }));
  }, [updateGameState]);

  const findTargetProblem = useCallback((input: string): MathProblem | null => {
    if (!input) return null;
    
    const currentState = gameStateRef.current;
    return currentState.problems
      .filter(p => p.answer.toString().startsWith(input))
      .sort((a, b) => b.y - a.y)[0] || null;
  }, []);

  const createExplosion = useCallback((x: number, y: number, isStreak = false) => {
    const particles: Particle[] = [];
    const particleCount = isStreak ? 25 : 15;
    const colors = isStreak ? ['#ffff00', '#ffa500', '#ff6b6b'] : ['#ffffff'];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * (isStreak ? 12 : 8),
        vy: (Math.random() - 0.5) * (isStreak ? 12 : 8),
        life: isStreak ? 40 : 30,
        maxLife: isStreak ? 40 : 30,
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
    
    if (currentState.gameStatus === 'paused' && event.key.toLowerCase() === 'p') {
      pauseGame();
      return;
    }
    
    if (currentState.gameStatus !== 'playing') return;

    const key = event.key;
    
    if (key.toLowerCase() === 'p') {
      pauseGame();
      return;
    }
    
    if (key >= '0' && key <= '9') {
      const newInput = currentState.currentInput + key;
      const targetProblem = findTargetProblem(newInput);
      
      if (targetProblem) {
        if (checkAnswer(targetProblem, newInput)) {
          // Correct answer - destroy problem
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
          // Partial correct input
          updateGameState(state => ({
            ...state,
            currentInput: newInput,
            targetProblem
          }));
        }
      } else {
        // No valid target - clear input and break streak
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
  }, [findTargetProblem, createExplosion, updateGameState, pauseGame]);

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      const currentState = gameStateRef.current;
      
      if (currentState.gameStatus === 'paused') {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      
      if (currentState.gameStatus !== 'playing') {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Update star field
      setStarField(stars => stars.map(star => ({
        ...star,
        y: star.y + star.speed,
        ...(star.y > 600 && { y: 0, x: Math.random() * 800 })
      })));

      // Update problems
      const updatedProblems = currentState.problems.map(problem => ({
        ...problem,
        y: problem.y + problem.speed
      }));

      // Check for problems that hit the bottom
      const problemsAtBottom = updatedProblems.filter(p => p.y > 550);
      const remainingProblems = updatedProblems.filter(p => p.y <= 550);

      let newLives = currentState.lives;
      let newProblemsHandled = currentState.problemsHandled;
      let newStats = currentState.statistics;

      if (problemsAtBottom.length > 0) {
        newLives -= problemsAtBottom.length;
        newProblemsHandled += problemsAtBottom.length;
        newStats = updateStatistics(currentState.statistics, {
          currentStreak: 0, // Break streak when missing problems
          totalQuestionsAnswered: currentState.statistics.totalQuestionsAnswered + problemsAtBottom.length
        });
        playSound('loseLife');
      }

      // Update particles
      const updatedParticles = currentState.particles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1
        }))
        .filter(particle => particle.life > 0);

      // Check game over
      if (newLives <= 0) {
        stopBackgroundMusic();
        const finalStats = updateStatistics(newStats, {
          highScore: Math.max(newStats.highScore, currentState.score),
          timePlayedSeconds: newStats.timePlayedSeconds + Math.floor((Date.now() - currentState.gameStartTime) / 1000)
        });
        saveStatistics(finalStats);
        
        updateGameState(state => ({
          ...state,
          gameStatus: 'gameOver',
          lives: 0,
          statistics: finalStats
        }));
        return;
      }

      // FIXED: Wave completion logic - check if all problems are handled
      if (newProblemsHandled >= currentState.totalProblemsInWave && remainingProblems.length === 0) {
        playSound('waveComplete');
        updateGameState(state => ({
          ...state,
          gameStatus: 'waveComplete',
          problems: [],
          particles: updatedParticles,
          lives: newLives,
          problemsHandled: newProblemsHandled,
          statistics: newStats
        }));

        setTimeout(() => {
          startNextWave();
        }, 2000);
        return;
      }

      // Update game state
      updateGameState(state => ({
        ...state,
        problems: remainingProblems,
        particles: updatedParticles,
        lives: newLives,
        problemsHandled: newProblemsHandled,
        statistics: newStats,
        targetProblem: state.targetProblem && remainingProblems.find(p => p.id === state.targetProblem?.id) || null
      }));

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateGameState, startNextWave]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Draw stars with twinkling effect
    starField.forEach((star, index) => {
      const twinkle = Math.sin(Date.now() * 0.01 + index) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.7})`;
      ctx.fillRect(star.x, star.y, 2, 2);
    });

    if (gameState.gameStatus === 'menu') {
      return; // Menu is rendered by React component
    }

    if (gameState.gameStatus === 'gameOver') {
      // Draw game over screen
      ctx.font = '48px "Courier New"';
      ctx.fillStyle = '#ff6b6b';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', 400, 250);
      
      ctx.font = '24px "Courier New"';
      ctx.fillStyle = '#66fcf1';
      ctx.fillText(`Final Score: ${gameState.score}`, 400, 300);
      if (gameState.score === gameState.statistics.highScore) {
        ctx.fillStyle = '#ffff00';
        ctx.fillText('NEW HIGH SCORE!', 400, 330);
      }
      ctx.fillStyle = '#66fcf1';
      ctx.fillText('Press SPACE to restart', 400, 380);
      
      return;
    }

    if (gameState.gameStatus === 'waveComplete') {
      // Draw wave complete screen
      ctx.font = '36px "Courier New"';
      ctx.fillStyle = '#66fcf1';
      ctx.textAlign = 'center';
      ctx.fillText(`WAVE ${gameState.wave} COMPLETE!`, 400, 300);
      
      return;
    }

    if (gameState.gameStatus === 'paused') {
      // Draw pause overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, 800, 600);
      
      ctx.font = '48px "Courier New"';
      ctx.fillStyle = '#66fcf1';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', 400, 280);
      ctx.font = '24px "Courier New"';
      ctx.fillText('Press P to resume', 400, 340);
      
      return;
    }

    // Draw player ship (enhanced)
    ctx.fillStyle = '#66fcf1';
    ctx.beginPath();
    ctx.moveTo(400, 570);
    ctx.lineTo(380, 590);
    ctx.lineTo(420, 590);
    ctx.closePath();
    ctx.fill();

    // Ship details
    ctx.fillRect(375, 585, 10, 5);
    ctx.fillRect(415, 585, 10, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(398, 575, 4, 8);

    // Draw problems with enhanced styling
    ctx.font = '20px "Courier New"';
    gameState.problems.forEach(problem => {
      const isTarget = problem === gameState.targetProblem;
      ctx.fillStyle = isTarget ? '#ffff00' : '#66fcf1';
      
      if (isTarget) {
        // Draw highlight background for targeted problem
        const textWidth = ctx.measureText(problem.text).width;
        ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
        ctx.fillRect(problem.x - 5, problem.y - 25, textWidth + 10, 30);
        ctx.fillStyle = '#ffff00';
      }
      
      ctx.fillText(problem.text, problem.x, problem.y);
    });

    // Draw particles with colors
    gameState.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      const color = particle.color || '#ffffff';
      ctx.fillStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.fillRect(particle.x, particle.y, 3, 3);
    });

  }, [gameState, starField]);

  // Handle space key for menu/restart
  useEffect(() => {
    const handleSpace = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (gameState.gameStatus === 'gameOver') {
          updateGameState(state => ({
            ...state,
            gameStatus: 'menu'
          }));
        }
      }
    };

    window.addEventListener('keydown', handleSpace);
    return () => window.removeEventListener('keydown', handleSpace);
  }, [gameState.gameStatus, updateGameState]);

  const handleShowStatistics = () => {
    updateGameState(state => ({ ...state, gameStatus: 'statistics' }));
  };

  const handleShowSettings = () => {
    updateGameState(state => ({ ...state, gameStatus: 'settings' }));
  };

  const handleBackToMenu = () => {
    updateGameState(state => ({ ...state, gameStatus: 'menu' }));
  };

  const handleResetStats = () => {
    const resetStats = {
      currentStreak: 0,
      bestStreak: 0,
      totalQuestionsAnswered: 0,
      correctAnswers: 0,
      accuracy: 0,
      highScore: 0,
      timePlayedSeconds: 0
    };
    saveStatistics(resetStats);
    updateGameState(state => ({ 
      ...state, 
      statistics: resetStats,
      gameStatus: 'menu'
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 relative">
      <div className="border-4 border-cyan-400 rounded-lg overflow-hidden shadow-2xl shadow-cyan-400/50 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="block"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* React UI Overlays */}
        {gameState.gameStatus === 'menu' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
            <GameMenu
              onStartGame={startGame}
              onShowStatistics={handleShowStatistics}
              onShowSettings={handleShowSettings}
              statistics={gameState.statistics}
            />
          </div>
        )}
        
        {gameState.gameStatus === 'statistics' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-95 p-8 overflow-y-auto">
            <StatisticsPanel
              statistics={gameState.statistics}
              onBack={handleBackToMenu}
              onResetStats={handleResetStats}
            />
          </div>
        )}
        
        {gameState.gameStatus === 'settings' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-95 p-8">
            <SettingsPanel onBack={handleBackToMenu} />
          </div>
        )}
        
        {gameState.gameStatus === 'playing' && (
          <GameHUD gameState={gameState} onPause={pauseGame} />
        )}
      </div>
    </div>
  );
};

export default MathFall;
