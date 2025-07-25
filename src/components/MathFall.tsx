import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, MathProblem, Particle, Difficulty } from '../types/game';
import { generateWave, checkAnswer } from '../utils/gameLogic';
import { getStoredStatistics, saveStatistics, updateStatistics } from '../utils/statisticsManager';
import { playSound, playBackgroundMusic, stopBackgroundMusic } from '../utils/audio';
import GameMenu from './GameMenu';
import GameHUD from './GameHUD';
import StatisticsPanel from './StatisticsPanel';
import SettingsPanel from './SettingsPanel';
import GameCanvas from './GameCanvas';
import MobileNumpad from './MobileNumpad';

const MathFall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  
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

  // Handle window resize for fullscreen canvas
  useEffect(() => {
    const updateCanvasSize = () => {
      const newWidth = Math.min(window.innerWidth - 40, 1400);
      const newHeight = Math.min(window.innerHeight - 40, 900);
      setCanvasSize({ width: newWidth, height: newHeight });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Initialize star field based on canvas size
  useEffect(() => {
    const stars = [];
    const starCount = Math.floor((canvasSize.width * canvasSize.height) / 4000);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvasSize.width,
        y: Math.random() * canvasSize.height,
        speed: Math.random() * 0.8 + 0.2
      });
    }
    setStarField(stars);
  }, [canvasSize]);

  const updateGameState = useCallback((updater: (state: GameState) => GameState) => {
    gameStateRef.current = updater(gameStateRef.current);
    setGameState({ ...gameStateRef.current });
  }, []);

  const startGame = useCallback((difficulty: Difficulty) => {
    playBackgroundMusic();
    const wave1 = generateWave(1, difficulty, canvasSize.width);
    const startTime = Date.now();
    
    console.log(`Starting new game - Wave 1 with ${wave1.totalProblems} problems`);
    
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
  }, [updateGameState, canvasSize.width]);

  const startNextWave = useCallback(() => {
    const currentWave = gameStateRef.current.wave + 1;
    const wave = generateWave(currentWave, gameStateRef.current.difficulty, canvasSize.width);
    
    console.log(`Starting Wave ${currentWave} with ${wave.totalProblems} problems (difficulty: ${gameStateRef.current.difficulty})`);
    
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
  }, [updateGameState, canvasSize.width]);

  const checkWaveCompletion = useCallback(() => {
    const currentState = gameStateRef.current;
    if (currentState.problemsHandled >= currentState.totalProblemsInWave) {
      console.log(`Wave ${currentState.wave} complete! Starting next wave...`);
      playSound('waveComplete');
      
      // Start next wave after a short delay
      setTimeout(() => {
        startNextWave();
      }, 1000);
    }
  }, [startNextWave]);

  const findTargetProblem = useCallback((input: string): MathProblem | null => {
    if (!input) return null;
    
    const currentState = gameStateRef.current;
    return currentState.problems
      .filter(p => p.answer.toString().startsWith(input))
      .sort((a, b) => b.y - a.y)[0] || null;
  }, []);

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

  const handleKeyInput = useCallback((key: string) => {
    const currentState = gameStateRef.current;
    
    if ((key >= '0' && key <= '9') || key === '.') {
      const newInput = currentState.currentInput + key;
      const targetProblem = findTargetProblem(newInput);
      
      if (targetProblem) {
        if (checkAnswer(targetProblem, newInput)) {
          // Correct answer - destroy problem
          playSound('destroy');
          const isStreak = currentState.statistics.currentStreak >= 5;
          createExplosion(targetProblem.x + 50, targetProblem.y + 15, isStreak);
          
          const baseScore = 10;
          const waveMultiplier = Math.floor(currentState.wave / 2) + 1;
          const streakMultiplier = Math.floor(currentState.statistics.currentStreak / 5) + 1;
          const scoreGain = baseScore * waveMultiplier * streakMultiplier;
          
          const newStats = updateStatistics(currentState.statistics, {
            currentStreak: currentState.statistics.currentStreak + 1,
            totalQuestionsAnswered: currentState.statistics.totalQuestionsAnswered + 1,
            correctAnswers: currentState.statistics.correctAnswers + 1
          });
          
          const newProblemsHandled = currentState.problemsHandled + 1;
          console.log(`Problem solved! Problems handled: ${newProblemsHandled}/${currentState.totalProblemsInWave}`);
          
          updateGameState(state => ({
            ...state,
            problems: state.problems.filter(p => p.id !== targetProblem.id),
            score: state.score + scoreGain,
            currentInput: '',
            targetProblem: null,
            problemsHandled: newProblemsHandled,
            statistics: newStats
          }));

          // Check for wave completion after state update
          setTimeout(() => {
            checkWaveCompletion();
          }, 100);
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
  }, [findTargetProblem, createExplosion, updateGameState, checkWaveCompletion]);

  const handleMobileKeyPress = useCallback((key: string) => {
    const currentState = gameStateRef.current;
    
    if (currentState.gameStatus !== 'playing') return;

    handleKeyInput(key);
  }, [handleKeyInput]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const currentState = gameStateRef.current;
    
    if (currentState.gameStatus !== 'playing') return;

    handleKeyInput(event.key);
  }, [handleKeyInput]);

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      const currentState = gameStateRef.current;
      
      if (currentState.gameStatus !== 'playing') {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Update star field
      setStarField(stars => stars.map(star => ({
        ...star,
        y: star.y + star.speed,
        ...(star.y > canvasSize.height && { y: 0, x: Math.random() * canvasSize.width })
      })));

      // Update problems with progressive speed increase
      const waveProgress = currentState.problemsHandled / currentState.totalProblemsInWave;
      const difficultySpeedMultiplier = currentState.difficulty === 'easy' ? 0.8 : currentState.difficulty === 'hard' ? 1.3 : 1.0;
      const speedBoost = (1 + (waveProgress * 0.05) + (currentState.wave * 0.02)) * difficultySpeedMultiplier;
      
      const updatedProblems = currentState.problems.map(problem => ({
        ...problem,
        y: problem.y + (problem.speed * speedBoost)
      }));

      // Check for problems that hit the bottom - use canvas height
      const bottomY = canvasSize.height - 50;
      const problemsAtBottom = updatedProblems.filter(p => p.y > bottomY);
      const remainingProblems = updatedProblems.filter(p => p.y <= bottomY);

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
        console.log(`${problemsAtBottom.length} problems missed! Problems handled: ${newProblemsHandled}/${currentState.totalProblemsInWave}`);
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

      // Update game state normally
      updateGameState(state => ({
        ...state,
        problems: remainingProblems,
        particles: updatedParticles,
        lives: newLives,
        problemsHandled: newProblemsHandled,
        statistics: newStats,
        targetProblem: state.targetProblem && remainingProblems.find(p => p.id === state.targetProblem?.id) || null
      }));

      // Check wave completion if problems were missed
      if (problemsAtBottom.length > 0) {
        setTimeout(() => {
          checkWaveCompletion();
        }, 100);
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateGameState, canvasSize, checkWaveCompletion]);

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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div 
        ref={containerRef}
        className={`relative border-4 border-cyan-400/50 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-400/30 backdrop-blur-sm ${gameState.gameStatus === 'gameOver' ? 'animate-screen-shake' : ''}`}
        style={{ width: canvasSize.width, height: canvasSize.height }}
      >
        <GameCanvas 
          gameState={gameState} 
          starField={starField} 
          canvasSize={canvasSize} 
          isGameOver={gameState.gameStatus === 'gameOver'} 
        />
        
        {/* React UI Overlays */}
        {gameState.gameStatus === 'menu' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md">
            <GameMenu
              onStartGame={startGame}
              onShowStatistics={handleShowStatistics}
              onShowSettings={handleShowSettings}
              statistics={gameState.statistics}
            />
          </div>
        )}
        
        {gameState.gameStatus === 'statistics' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-8 overflow-y-auto">
            <StatisticsPanel
              statistics={gameState.statistics}
              onBack={handleBackToMenu}
              onResetStats={handleResetStats}
            />
          </div>
        )}
        
        {gameState.gameStatus === 'settings' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-8">
            <SettingsPanel onBack={handleBackToMenu} />
          </div>
        )}
        
        {gameState.gameStatus === 'playing' && (
          <>
            <GameHUD gameState={gameState} />
            <MobileNumpad 
              onKeyPress={handleMobileKeyPress}
              currentInput={gameState.currentInput}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MathFall;
