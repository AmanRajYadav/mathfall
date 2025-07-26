import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, MathProblem, Particle, Difficulty } from '../types/game';
import { generateWave, checkAnswer } from '../utils/gameLogic';
import { getStoredStatistics, saveStatistics, updateStatistics } from '../utils/statisticsManager';
import { playSound, playBackgroundMusic, stopBackgroundMusic } from '../utils/audio';
import { shouldSpawnPowerUp, getRandomPowerUpType, createPowerUp, powerUpConfigs } from '../utils/powerUpConfigs';
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
    gameStartTime: Date.now(),
    selectedRocket: 'classic',
    currentMusicTrack: '',
    powerUps: [],
    activePowerUps: [],
    rocketX: 600 // Start in center
  });

  const [gameState, setGameState] = useState<GameState>(gameStateRef.current);
  const [starField, setStarField] = useState<Array<{x: number, y: number, speed: number}>>([]);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Initialize audio on first user interaction
  const initializeAudio = useCallback(() => {
    if (!audioInitialized) {
      playBackgroundMusic(1, 'menu');
      setAudioInitialized(true);
    }
  }, [audioInitialized]);

  // Handle user interaction to initialize audio
  useEffect(() => {
    const handleUserInteraction = () => {
      initializeAudio();
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [initializeAudio]);

  // Handle window resize for fullscreen canvas
  useEffect(() => {
    const updateCanvasSize = () => {
      // True fullscreen - use entire viewport
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
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
    playBackgroundMusic(1, 'playing');
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
    
    // Update music for new wave
    playBackgroundMusic(currentWave, 'playing');
    
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

  // Vibration utility function
  const triggerVibration = useCallback((intensity: 'light' | 'medium' | 'heavy' | 'powerup' | 'streak' = 'medium') => {
    if ('vibrate' in navigator && navigator.vibrate) {
      try {
        switch (intensity) {
          case 'light':
            navigator.vibrate(40); // Quick tap for friendly problems
            break;
          case 'medium':
            navigator.vibrate(80); // Medium buzz for normal hits
            break;
          case 'heavy':
            navigator.vibrate([120, 30, 80, 30, 120]); // Complex pattern for boss problems
            break;
          case 'powerup':
            navigator.vibrate([50, 20, 50]); // Double tap for power-ups
            break;
          case 'streak':
            navigator.vibrate([30, 20, 30, 20, 30]); // Rapid fire for streaks
            break;
        }
      } catch (error) {
        // Silently fail if vibration is not supported or fails
        console.warn('Vibration not supported or failed:', error);
      }
    }
  }, []);

  const createExplosion = useCallback((x: number, y: number, isStreak = false, personality?: string) => {
    const particles: Particle[] = [];
    
    // Enhanced explosion based on problem personality
    let particleCount = isStreak ? 30 : 20;
    let colors = isStreak ? ['#ffff00', '#ffa500', '#ff6b6b', '#00ff00'] : ['#ffffff', '#66fcf1'];
    let speed = isStreak ? 15 : 10;
    let life = isStreak ? 50 : 35;
    
    if (personality === 'boss') {
      particleCount = isStreak ? 50 : 40;
      colors = ['#a855f7', '#ffd700', '#ff4757', '#ffffff'];
      speed = isStreak ? 20 : 15;
      life = isStreak ? 70 : 50;
    } else if (personality === 'aggressive') {
      particleCount = isStreak ? 35 : 25;
      colors = ['#ef4444', '#ff6b6b', '#ffa500', '#ffffff'];
      speed = isStreak ? 18 : 12;
      life = isStreak ? 60 : 40;
    } else if (personality === 'friendly') {
      particleCount = isStreak ? 25 : 15;
      colors = ['#22c55e', '#66fcf1', '#ffffff', '#90ee90'];
      speed = isStreak ? 12 : 8;
      life = isStreak ? 45 : 30;
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        life,
        maxLife: life,
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
          // Correct answer - destroy problem with personality-based sound
          const soundType = targetProblem.personality === 'boss' ? 'destroyBoss' : 
                           targetProblem.personality === 'aggressive' ? 'destroyAggressive' : 'destroy';
          console.log(`Playing sound: ${soundType} for ${targetProblem.personality} problem`);
          playSound(soundType);
          
          // Trigger vibration based on problem personality
          const vibrationIntensity = targetProblem.personality === 'boss' ? 'heavy' : 
                                   targetProblem.personality === 'aggressive' ? 'medium' : 'light';
          console.log(`Triggering vibration: ${vibrationIntensity}`);
          triggerVibration(vibrationIntensity);
          
          const isStreak = currentState.statistics.currentStreak >= 5;
          createExplosion(targetProblem.x + 50, targetProblem.y + 15, isStreak, targetProblem.personality);
          
          // Check if power-up should spawn
          if (shouldSpawnPowerUp(currentState.wave, currentState.statistics.correctAnswers)) {
            const powerUpType = getRandomPowerUpType(currentState.wave);
            const newPowerUp = createPowerUp(powerUpType, targetProblem.x + 25, targetProblem.y);
            
            updateGameState(state => ({
              ...state,
              powerUps: [...state.powerUps, newPowerUp]
            }));
          }
          
          const baseScore = 10;
          const waveMultiplier = Math.floor(currentState.wave / 2) + 1;
          const streakMultiplier = Math.floor(currentState.statistics.currentStreak / 5) + 1;
          
          // Apply score multiplier if active
          const multiplierBonus = currentState.activePowerUps.find(p => p.type === 'multiplier') ? 2 : 1;
          const scoreGain = baseScore * waveMultiplier * streakMultiplier * multiplierBonus;
          
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
          // Partial correct input - play laser sound when first targeting
          const wasTargeting = currentState.targetProblem !== null;
          const nowTargeting = targetProblem !== null;
          
          if (!wasTargeting && nowTargeting) {
            console.log('Playing laser shoot sound - new target acquired');
            playSound('laserShoot'); // Play laser sound when first locking onto target
          }
          
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
      
      // Play laser sound when first targeting after backspace
      const wasTargeting = currentState.targetProblem !== null;
      const nowTargeting = targetProblem !== null;
      
      if (!wasTargeting && nowTargeting) {
        playSound('laserShoot');
      }
      
      updateGameState(state => ({
        ...state,
        currentInput: newInput,
        targetProblem
      }));
    }
  }, [findTargetProblem, createExplosion, updateGameState, checkWaveCompletion, triggerVibration]);

  const handleMobileKeyPress = useCallback((key: string) => {
    const currentState = gameStateRef.current;
    
    if (currentState.gameStatus !== 'playing') return;

    handleKeyInput(key);
  }, [handleKeyInput]);

  const handleVoiceInput = useCallback((input: string) => {
    const currentState = gameStateRef.current;
    
    if (currentState.gameStatus !== 'playing') return;

    console.log('Processing voice input:', input);
    handleKeyInput(input);
  }, [handleKeyInput]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const currentState = gameStateRef.current;
    
    if (currentState.gameStatus !== 'playing') return;

    handleKeyInput(event.key);
  }, [handleKeyInput]);

  // Rocket movement controls
  const handleMovementKeyPress = useCallback((event: KeyboardEvent) => {
    const currentState = gameStateRef.current;
    
    if (currentState.gameStatus !== 'playing') return;
    
    const moveSpeed = 15;
    const minX = 50;
    const maxX = canvasSize.width - 50;
    
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      event.preventDefault();
      updateGameState(state => ({
        ...state,
        rocketX: Math.max(minX, state.rocketX - moveSpeed)
      }));
    } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      event.preventDefault();
      updateGameState(state => ({
        ...state,
        rocketX: Math.min(maxX, state.rocketX + moveSpeed)
      }));
    }
  }, [updateGameState, canvasSize.width]);
  
  // Keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keydown', handleMovementKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keydown', handleMovementKeyPress);
    };
  }, [handleKeyPress, handleMovementKeyPress]);

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

      // Update problems with progressive speed increase (modified by time slowdown)
      const waveProgress = currentState.problemsHandled / currentState.totalProblemsInWave;
      const difficultySpeedMultiplier = currentState.difficulty === 'easy' ? 0.8 : currentState.difficulty === 'hard' ? 1.3 : 1.0;
      const timeSlowdown = currentState.activePowerUps.find(p => p.type === 'timeSlowdown') ? 0.3 : 1.0;
      const freeze = currentState.activePowerUps.find(p => p.type === 'freeze') ? 0 : 1.0;
      const speedBoost = (1 + (waveProgress * 0.05) + (currentState.wave * 0.02)) * difficultySpeedMultiplier * timeSlowdown * freeze;
      
      const updatedProblems = currentState.problems.map(problem => ({
        ...problem,
        y: problem.y + (problem.speed * speedBoost)
      }));

      // Update power-ups
      const updatedPowerUps = currentState.powerUps.map(powerUp => ({
        ...powerUp,
        y: powerUp.y + powerUp.speed
      })).filter(powerUp => powerUp.y < canvasSize.height && !powerUp.collected);

      // Check for power-up collection (optimized)
      const shipX = currentState.rocketX || canvasSize.width / 2;
      const shipY = canvasSize.height - (canvasSize.width < 768 ? 180 : 25);
      
      let newActivePowerUps = [...currentState.activePowerUps];
      let collectedAny = false;
      const collectedPowerUpIds: string[] = [];
      
      // Only check collection if there are power-ups on screen
      if (updatedPowerUps.length > 0) {
        updatedPowerUps.forEach(powerUp => {
          const distance = Math.sqrt(
            Math.pow(powerUp.x - shipX, 2) + Math.pow(powerUp.y - shipY, 2)
          );
          if (distance < 40 && !powerUp.collected) {
            collectedAny = true;
            collectedPowerUpIds.push(powerUp.id);
            powerUp.collected = true;
            
            if (powerUp.type === 'destroyAll') {
              // Instant effect - destroy all problems (batch create explosions)
              const explosionPromises = updatedProblems.map(problem => 
                createExplosion(problem.x + 25, problem.y, false, problem.personality)
              );
              // Count destroyed problems for wave completion and update statistics
              newProblemsHandled += updatedProblems.length;
              newStats = updateStatistics(currentState.statistics, {
                totalQuestionsAnswered: currentState.statistics.totalQuestionsAnswered + updatedProblems.length,
                correctAnswers: currentState.statistics.correctAnswers + updatedProblems.length
              });
            } else if (powerUp.duration > 0) {
              // Add timed effect (prevent duplicates)
              const existingPowerUp = newActivePowerUps.find(ap => ap.type === powerUp.type);
              if (existingPowerUp) {
                // Reset timer instead of stacking
                existingPowerUp.remainingTime = powerUp.duration;
              } else {
                newActivePowerUps.push({
                  type: powerUp.type,
                  remainingTime: powerUp.duration,
                  effect: powerUpConfigs[powerUp.type]
                });
              }
            }
          }
        });
        
        // Play sound and vibration for collected power-ups
        if (collectedAny) {
          playSound('powerUpCollect');
          triggerVibration('powerup'); // Special power-up vibration pattern
        }
      }

      // Update active power-ups timers
      newActivePowerUps = newActivePowerUps
        .map(activePowerUp => ({
          ...activePowerUp,
          remainingTime: activePowerUp.remainingTime - (1/60) // Assuming 60fps
        }))
        .filter(activePowerUp => activePowerUp.remainingTime > 0);

      // Apply destroy all effect (check if any collected power-up was destroyAll)
      let finalProblems = updatedProblems;
      let destroyAllActivated = false;
      if (collectedAny) {
        // Check if any collected power-up was destroyAll
        updatedPowerUps.forEach(powerUp => {
          if (powerUp.collected && powerUp.type === 'destroyAll') {
            destroyAllActivated = true;
          }
        });
        if (destroyAllActivated) {
          finalProblems = [];
        }
      }

      // Check for problems that hit the bottom (modified by shield)
      const bottomY = canvasSize.height - 50;
      const problemsAtBottom = finalProblems.filter(p => p.y > bottomY);
      const remainingProblems = finalProblems.filter(p => p.y <= bottomY);

      let newLives = currentState.lives;
      let newProblemsHandled = currentState.problemsHandled;
      let newStats = currentState.statistics;

      if (problemsAtBottom.length > 0) {
        const hasShield = currentState.activePowerUps.find(p => p.type === 'shield');
        if (!hasShield) {
          newLives -= problemsAtBottom.length;
        }
        newProblemsHandled += problemsAtBottom.length;
        newStats = updateStatistics(currentState.statistics, {
          currentStreak: 0,
          totalQuestionsAnswered: currentState.statistics.totalQuestionsAnswered + problemsAtBottom.length
        });
        playSound('loseLife');
        console.log(`${problemsAtBottom.length} problems ${hasShield ? 'blocked by shield' : 'missed'}! Problems handled: ${newProblemsHandled}/${currentState.totalProblemsInWave}`);
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
        playBackgroundMusic(currentState.wave, 'gameOver');
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
        powerUps: updatedPowerUps.filter(p => !p.collected),
        activePowerUps: newActivePowerUps,
        lives: newLives,
        problemsHandled: newProblemsHandled,
        statistics: newStats,
        targetProblem: state.targetProblem && remainingProblems.find(p => p.id === state.targetProblem?.id) || null
      }));

      // Check wave completion if problems were missed or destroyed by power-up
      if (problemsAtBottom.length > 0 || destroyAllActivated) {
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
  }, [updateGameState, canvasSize, checkWaveCompletion, createExplosion, triggerVibration]);

  // Handle space key for menu/restart
  useEffect(() => {
    const handleSpace = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (gameState.gameStatus === 'gameOver') {
          playBackgroundMusic(1, 'menu');
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

  const handleRocketChange = (rocket: any) => {
    updateGameState(state => ({ ...state, selectedRocket: rocket }));
  };

  const handleBackToMenu = () => {
    playBackgroundMusic(1, 'menu');
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
    playBackgroundMusic(1, 'menu');
    updateGameState(state => ({ 
      ...state, 
      statistics: resetStats,
      gameStatus: 'menu'
    }));
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div 
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden ${gameState.gameStatus === 'gameOver' ? 'animate-screen-shake' : ''}`}
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-lg">
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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md">
            <SettingsPanel 
              onBack={handleBackToMenu}
              selectedRocket={gameState.selectedRocket}
              onRocketChange={handleRocketChange}
            />
          </div>
        )}
        
        {gameState.gameStatus === 'playing' && (
          <>
            <GameHUD 
              gameState={gameState} 
              onVoiceInput={handleVoiceInput}
            />
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
