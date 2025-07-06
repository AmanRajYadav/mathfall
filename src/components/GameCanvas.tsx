
import React, { useRef, useEffect } from 'react';
import { GameState } from '../types/game';

interface GameCanvasProps {
  gameState: GameState;
  starField: Array<{x: number, y: number, speed: number}>;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, starField }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Modern gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(0.3, '#1a1a2e');
    gradient.addColorStop(0.7, '#16213e');
    gradient.addColorStop(1, '#0a0e27');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

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
      const overlayGradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 400);
      overlayGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      overlayGradient.addColorStop(1, 'rgba(20, 20, 40, 0.95)');
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, 800, 600);
      
      // Glowing game over text
      ctx.font = 'bold 48px system-ui';
      ctx.fillStyle = '#ff4757';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ff4757';
      ctx.shadowBlur = 30;
      ctx.fillText('GAME OVER', 400, 250);
      
      ctx.font = '24px system-ui';
      ctx.fillStyle = '#70a1ff';
      ctx.shadowBlur = 15;
      ctx.fillText(`Final Score: ${gameState.score.toLocaleString()}`, 400, 300);
      
      if (gameState.score === gameState.statistics.highScore) {
        ctx.fillStyle = '#ffa502';
        ctx.shadowColor = '#ffa502';
        ctx.fillText('🏆 NEW HIGH SCORE! 🏆', 400, 330);
      }
      
      ctx.fillStyle = '#70a1ff';
      ctx.shadowColor = '#70a1ff';
      ctx.shadowBlur = 10;
      ctx.fillText('Press SPACE to restart', 400, 380);
      ctx.shadowBlur = 0;
      
      return;
    }

    if (gameState.gameStatus === 'waveComplete') {
      // Wave complete with celebration effect
      const time = Date.now() * 0.005;
      const overlayGradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 300);
      overlayGradient.addColorStop(0, 'rgba(0, 50, 100, 0.8)');
      overlayGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, 800, 600);
      
      ctx.font = 'bold 36px system-ui';
      ctx.fillStyle = '#70a1ff';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#70a1ff';
      ctx.shadowBlur = 20 + Math.sin(time) * 10;
      ctx.fillText(`🎉 WAVE ${gameState.wave} COMPLETE! 🎉`, 400, 300);
      ctx.shadowBlur = 0;
      
      return;
    }

    // Enhanced player ship with glow trail
    const shipGradient = ctx.createRadialGradient(400, 575, 0, 400, 575, 25);
    shipGradient.addColorStop(0, '#70a1ff');
    shipGradient.addColorStop(0.7, '#5352ed');
    shipGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = shipGradient;
    ctx.fillRect(375, 550, 50, 50);

    ctx.fillStyle = '#70a1ff';
    ctx.shadowColor = '#70a1ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(400, 570);
    ctx.lineTo(385, 590);
    ctx.lineTo(415, 590);
    ctx.closePath();
    ctx.fill();

    // Engine trails
    ctx.fillStyle = '#ff6b6b';
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 10;
    ctx.fillRect(390, 585, 6, 8);
    ctx.fillRect(404, 585, 6, 8);
    
    // Cockpit
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 5;
    ctx.fillRect(398, 575, 4, 8);
    ctx.shadowBlur = 0;

    // Enhanced problems with dynamic styling
    ctx.font = 'bold 20px system-ui';
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

  }, [gameState, starField]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="block rounded-2xl"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default GameCanvas;
