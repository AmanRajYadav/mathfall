
import React, { useRef, useEffect } from 'react';
import { GameState } from '../types/game';

interface GameCanvasProps {
  gameState: GameState;
  starField: Array<{x: number, y: number, speed: number}>;
  canvasSize: { width: number, height: number };
  isGameOver?: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, starField, canvasSize, isGameOver = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Modern gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(0.3, '#1a1a2e');
    gradient.addColorStop(0.7, '#16213e');
    gradient.addColorStop(1, '#0a0e27');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Enhanced stars with glow and twinkle
    starField.forEach((star, index) => {
      const twinkle = Math.sin(Date.now() * 0.003 + index) * 0.5 + 0.5;
      const alpha = 0.3 + twinkle * 0.7;
      const size = 1 + twinkle * 1.5;
      
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 2 + twinkle * 3;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(star.x - size/2, star.y - size/2, size, size);
      ctx.shadowBlur = 0;
    });

    if (gameState.gameStatus === 'menu') return;

    if (gameState.gameStatus === 'gameOver') {
      // Modern game over screen with glassmorphism
      const overlayGradient = ctx.createRadialGradient(canvasSize.width/2, canvasSize.height/2, 0, canvasSize.width/2, canvasSize.height/2, canvasSize.width/2);
      overlayGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      overlayGradient.addColorStop(1, 'rgba(20, 20, 40, 0.95)');
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      
      // Glowing game over text
      const fontSize = Math.min(48, canvasSize.width / 20);
      ctx.font = `bold ${fontSize}px system-ui`;
      ctx.fillStyle = '#ff4757';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ff4757';
      ctx.shadowBlur = 30;
      ctx.fillText('GAME OVER', canvasSize.width/2, canvasSize.height/2 - 50);
      
      ctx.font = `${fontSize/2}px system-ui`;
      ctx.fillStyle = '#70a1ff';
      ctx.shadowBlur = 15;
      ctx.fillText(`Final Score: ${gameState.score.toLocaleString()}`, canvasSize.width/2, canvasSize.height/2);
      
      if (gameState.score === gameState.statistics.highScore) {
        ctx.fillStyle = '#ffa502';
        ctx.shadowColor = '#ffa502';
        ctx.fillText('🏆 NEW HIGH SCORE! 🏆', canvasSize.width/2, canvasSize.height/2 + 30);
      }
      
      ctx.fillStyle = '#70a1ff';
      ctx.shadowColor = '#70a1ff';
      ctx.shadowBlur = 10;
      ctx.fillText('Press SPACE to restart', canvasSize.width/2, canvasSize.height/2 + 80);
      ctx.shadowBlur = 0;
      
      return;
    }

    if (gameState.gameStatus === 'waveComplete') {
      // Wave complete with celebration effect
      const time = Date.now() * 0.005;
      const overlayGradient = ctx.createRadialGradient(canvasSize.width/2, canvasSize.height/2, 0, canvasSize.width/2, canvasSize.height/2, canvasSize.width/3);
      overlayGradient.addColorStop(0, 'rgba(0, 50, 100, 0.8)');
      overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      
      const fontSize = Math.min(36, canvasSize.width / 25);
      ctx.font = `bold ${fontSize}px system-ui`;
      ctx.fillStyle = '#70a1ff';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#70a1ff';
      ctx.shadowBlur = 20 + Math.sin(time) * 10;
      ctx.fillText(`🎉 WAVE ${gameState.wave} COMPLETE! 🎉`, canvasSize.width/2, canvasSize.height/2);
      ctx.shadowBlur = 0;
      
      return;
    }

    // Enhanced player ship with glow trail (show explosion if game over)
    const shipX = canvasSize.width / 2;
    // Position rocket higher on mobile to account for smaller numpad
    const shipY = canvasSize.height - (canvasSize.width < 768 ? 120 : 25);
    
    if (isGameOver) {
      // Rocket explosion effect
      const explosionRadius = 40;
      const explosionGradient = ctx.createRadialGradient(shipX, shipY, 0, shipX, shipY, explosionRadius);
      explosionGradient.addColorStop(0, '#ff4757');
      explosionGradient.addColorStop(0.3, '#ff6b6b');
      explosionGradient.addColorStop(0.6, '#ffa502');
      explosionGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = explosionGradient;
      ctx.fillRect(shipX - explosionRadius, shipY - explosionRadius, explosionRadius * 2, explosionRadius * 2);
      
      // Debris particles
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const distance = 20 + Math.random() * 30;
        const debrisX = shipX + Math.cos(angle) * distance;
        const debrisY = shipY + Math.sin(angle) * distance;
        
        ctx.fillStyle = Math.random() > 0.5 ? '#70a1ff' : '#ffffff';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 5;
        ctx.fillRect(debrisX - 2, debrisY - 2, 4, 4);
      }
      ctx.shadowBlur = 0;
    } else {
      // Normal rocket
      const shipGradient = ctx.createRadialGradient(shipX, shipY, 0, shipX, shipY, 25);
      shipGradient.addColorStop(0, '#70a1ff');
      shipGradient.addColorStop(0.7, '#5352ed');
      shipGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = shipGradient;
      ctx.fillRect(shipX - 25, shipY - 25, 50, 50);

      ctx.fillStyle = '#70a1ff';
      ctx.shadowColor = '#70a1ff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(shipX, shipY);
      ctx.lineTo(shipX - 15, shipY + 20);
      ctx.lineTo(shipX + 15, shipY + 20);
      ctx.closePath();
      ctx.fill();

      // Engine trails
      ctx.fillStyle = '#ff6b6b';
      ctx.shadowColor = '#ff6b6b';
      ctx.shadowBlur = 10;
      ctx.fillRect(shipX - 10, shipY + 15, 6, 8);
      ctx.fillRect(shipX + 4, shipY + 15, 6, 8);
      
      // Cockpit
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 5;
      ctx.fillRect(shipX - 2, shipY + 5, 4, 8);
      ctx.shadowBlur = 0;
    }

    // Enhanced problems with dynamic styling
    const problemFontSize = Math.min(20, canvasSize.width / 40);
    ctx.font = `bold ${problemFontSize}px system-ui`;
    gameState.problems.forEach(problem => {
      const isTarget = problem === gameState.targetProblem;
      
      if (isTarget) {
        // Animated target highlight
        const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
        const textWidth = ctx.measureText(problem.text).width;
        
        // Glowing background
        const targetGradient = ctx.createRadialGradient(
          problem.x + textWidth/2, problem.y - 15, 0,
          problem.x + textWidth/2, problem.y - 15, textWidth + 20
        );
        targetGradient.addColorStop(0, `rgba(255, 193, 7, ${pulse * 0.4})`);
        targetGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = targetGradient;
        ctx.fillRect(problem.x - 10, problem.y - 35, textWidth + 20, 40);
        
        // Target text
        ctx.fillStyle = '#ffc107';
        ctx.shadowColor = '#ffc107';
        ctx.shadowBlur = 20;
      } else {
        ctx.fillStyle = '#70a1ff';
        ctx.shadowColor = '#70a1ff';
        ctx.shadowBlur = 8;
      }
      
      ctx.fillText(problem.text, problem.x, problem.y);
      ctx.shadowBlur = 0;
    });

    // Enhanced particles with trails
    gameState.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      const size = 2 + alpha * 3;
      const color = particle.color || '#ffffff';
      
      // Particle trail
      ctx.fillStyle = `${color}${Math.floor(alpha * 100).toString(16).padStart(2, '0')}`;
      ctx.shadowColor = color;
      ctx.shadowBlur = 5;
      ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
      ctx.shadowBlur = 0;
    });

  }, [gameState, starField, canvasSize, isGameOver]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      className={`block rounded-2xl ${gameState.gameStatus === 'gameOver' ? 'animate-screen-shake' : ''}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default GameCanvas;
