
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, MathProblem, Particle, Wave } from '../types/game';
import { generateWave, checkAnswer } from '../utils/gameLogic';
import { playSound, playBackgroundMusic, stopBackgroundMusic } from '../utils/audio';

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
    problemsHandled: 0
  });

  const [gameState, setGameState] = useState<GameState>(gameStateRef.current);
  const [starField, setStarField] = useState<Array<{x: number, y: number, speed: number}>>([]);

  // Initialize star field
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 100; i++) {
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

  const startGame = useCallback(() => {
    playBackgroundMusic();
    const wave1 = generateWave(1);
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
      problemsHandled: 0
    }));
  }, [updateGameState]);

  const startNextWave = useCallback(() => {
    const currentWave = gameStateRef.current.wave + 1;
    const wave = generateWave(currentWave);
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

  const findTargetProblem = useCallback((input: string): MathProblem | null => {
    if (!input) return null;
    
    const currentState = gameStateRef.current;
    return currentState.problems
      .filter(p => p.answer.toString().startsWith(input))
      .sort((a, b) => b.y - a.y)[0] || null;
  }, []);

  const createExplosion = useCallback((x: number, y: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 30,
        maxLife: 30
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
          // Correct answer - destroy problem
          playSound('destroy');
          createExplosion(targetProblem.x + 50, targetProblem.y + 15);
          
          updateGameState(state => ({
            ...state,
            problems: state.problems.filter(p => p.id !== targetProblem.id),
            score: state.score + 10,
            currentInput: '',
            targetProblem: null,
            problemsHandled: state.problemsHandled + 1
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
        // No valid target - clear input
        updateGameState(state => ({
          ...state,
          currentInput: '',
          targetProblem: null
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
  }, [findTargetProblem, createExplosion, updateGameState]);

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

      if (problemsAtBottom.length > 0) {
        newLives -= problemsAtBottom.length;
        newProblemsHandled += problemsAtBottom.length;
        playSound('loseLife');
        console.log(`Problems at bottom: ${problemsAtBottom.length}, New handled: ${newProblemsHandled}, Total: ${currentState.totalProblemsInWave}`);
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
        updateGameState(state => ({
          ...state,
          gameStatus: 'gameOver',
          lives: 0
        }));
        return;
      }

      // Fixed wave completion logic - check if all problems are handled and no problems remain
      const allProblemsHandled = newProblemsHandled >= currentState.totalProblemsInWave;
      const noProblemsRemaining = remainingProblems.length === 0;
      
      console.log(`Wave ${currentState.wave}: Handled ${newProblemsHandled}/${currentState.totalProblemsInWave}, Remaining: ${remainingProblems.length}`);
      
      if (allProblemsHandled && noProblemsRemaining) {
        playSound('waveComplete');
        updateGameState(state => ({
          ...state,
          gameStatus: 'waveComplete',
          problems: [],
          particles: updatedParticles,
          lives: newLives,
          problemsHandled: newProblemsHandled
        }));

        setTimeout(() => {
          startNextWave();
        }, 3000);
        return;
      }

      // Update game state
      updateGameState(state => ({
        ...state,
        problems: remainingProblems,
        particles: updatedParticles,
        lives: newLives,
        problemsHandled: newProblemsHandled,
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

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 800, 600);

    // Draw stars
    ctx.fillStyle = '#ffffff';
    starField.forEach(star => {
      ctx.fillRect(star.x, star.y, 2, 2);
    });

    if (gameState.gameStatus === 'menu') {
      // Draw menu
      ctx.font = '48px "Courier New"';
      ctx.fillStyle = '#66fcf1';
      ctx.textAlign = 'center';
      ctx.fillText('MATHFALL', 400, 200);
      
      ctx.font = '24px "Courier New"';
      ctx.fillText('Destroy falling math problems by typing the answers!', 400, 300);
      ctx.fillText('Press SPACE to start', 400, 400);
      
      return;
    }

    if (gameState.gameStatus === 'gameOver') {
      // Draw game over screen
      ctx.font = '48px "Courier New"';
      ctx.fillStyle = '#ff6b6b';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', 400, 250);
      
      ctx.font = '24px "Courier New"';
      ctx.fillStyle = '#66fcf1';
      ctx.fillText(`Final Score: ${gameState.score}`, 400, 320);
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

    // Draw player ship
    ctx.fillStyle = '#66fcf1';
    ctx.beginPath();
    ctx.moveTo(400, 570);
    ctx.lineTo(380, 590);
    ctx.lineTo(420, 590);
    ctx.closePath();
    ctx.fill();

    // Draw wing extensions
    ctx.fillRect(375, 585, 10, 5);
    ctx.fillRect(415, 585, 10, 5);

    // Draw problems
    ctx.font = '20px "Courier New"';
    gameState.problems.forEach(problem => {
      ctx.fillStyle = problem === gameState.targetProblem ? '#ffff00' : '#66fcf1';
      ctx.fillText(problem.text, problem.x, problem.y);
    });

    // Draw particles
    gameState.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(particle.x, particle.y, 3, 3);
    });

    // Draw UI
    ctx.font = '24px "Courier New"';
    ctx.textAlign = 'left';
    
    // Score (top-left)
    ctx.fillStyle = '#66fcf1';
    ctx.fillText(`Score: ${gameState.score}`, 20, 40);
    
    // Wave (top-right)
    ctx.textAlign = 'right';
    ctx.fillText(`Wave: ${gameState.wave}`, 780, 40);
    
    // Lives (bottom-right) - draw as ship icons
    ctx.fillStyle = '#66fcf1';
    for (let i = 0; i < gameState.lives; i++) {
      const x = 750 - (i * 25);
      const y = 570;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 8, y + 8);
      ctx.lineTo(x + 8, y + 8);
      ctx.closePath();
      ctx.fill();
    }
    
    // Current input (bottom-left)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffff00';
    ctx.fillText(`Input: ${gameState.currentInput}`, 20, 570);

  }, [gameState, starField]);

  // Handle space key for menu/restart
  useEffect(() => {
    const handleSpace = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (gameState.gameStatus === 'menu' || gameState.gameStatus === 'gameOver') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleSpace);
    return () => window.removeEventListener('keydown', handleSpace);
  }, [gameState.gameStatus, startGame]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="border-4 border-cyan-400 rounded-lg overflow-hidden shadow-2xl shadow-cyan-400/50">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="block"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
};

export default MathFall;
