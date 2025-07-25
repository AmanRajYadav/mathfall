
import React, { useRef, useEffect } from 'react';
import { GameState } from '../types/game';
import { getRocketConfig } from '../utils/rocketConfigs';
import { powerUpConfigs } from '../utils/powerUpConfigs';

interface GameCanvasProps {
  gameState: GameState;
  starField: Array<{x: number, y: number, speed: number}>;
  canvasSize: { width: number, height: number };
  isGameOver?: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, starField, canvasSize, isGameOver = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketImageRef = useRef<HTMLImageElement | null>(null);

  // Load rocket GIF image
  useEffect(() => {
    if (!rocketImageRef.current) {
      const img = new Image();
      img.src = '/rocket-moving.gif';
      img.onload = () => {
        rocketImageRef.current = img;
      };
    }
  }, []);

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
      
      // Glowing game over text - double size on mobile
      const isMobile = canvasSize.width < 768;
      const gameOverFontSize = Math.min(48, canvasSize.width / 20) * (isMobile ? 2 : 1);
      const scoreFontSize = (gameOverFontSize / 2) * (isMobile ? 2 : 1);
      
      ctx.font = `bold ${gameOverFontSize}px system-ui`;
      ctx.fillStyle = '#ff4757';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ff4757';
      ctx.shadowBlur = 30;
      ctx.fillText('GAME OVER', canvasSize.width/2, canvasSize.height/2 - 50);
      
      ctx.font = `${scoreFontSize}px system-ui`;
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
    const shipX = gameState.rocketX || canvasSize.width / 2;
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
      // Enhanced rocket with different models
      const rocketConfig = getRocketConfig(gameState.selectedRocket);
      const rocketSize = 25 * rocketConfig.size;
      
      // Use GIF for classic rocket, draw others normally
      if (gameState.selectedRocket === 'classic' && rocketImageRef.current) {
        // Draw animated GIF rocket
        const img = rocketImageRef.current;
        const gifWidth = rocketSize * 2;
        const gifHeight = rocketSize * 2;
        
        // Rocket glow aura
        const rocketGradient = ctx.createRadialGradient(shipX, shipY, 0, shipX, shipY, rocketSize + 10);
        rocketGradient.addColorStop(0, `${rocketConfig.color}80`);
        rocketGradient.addColorStop(0.7, `${rocketConfig.color}40`);
        rocketGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = rocketGradient;
        ctx.fillRect(shipX - rocketSize - 10, shipY - rocketSize - 10, (rocketSize + 10) * 2, (rocketSize + 10) * 2);
        
        // Draw the GIF rocket
        ctx.drawImage(img, shipX - gifWidth/2, shipY - gifHeight/2, gifWidth, gifHeight);
        
        // Enhanced engine trails for GIF rocket
        const trailIntensity = rocketConfig.speed;
        ctx.fillStyle = rocketConfig.fireRate > 1 ? '#ff4757' : '#ff6b6b';
        ctx.shadowColor = rocketConfig.fireRate > 1 ? '#ff4757' : '#ff6b6b';
        ctx.shadowBlur = 10 * trailIntensity;
        
        const trailWidth = rocketSize/4 * trailIntensity;
        const trailHeight = rocketSize/2 * trailIntensity;
        ctx.fillRect(shipX - trailWidth, shipY + gifHeight/2, trailWidth * 0.8, trailHeight);
        ctx.fillRect(shipX + trailWidth * 0.2, shipY + gifHeight/2, trailWidth * 0.8, trailHeight);
        ctx.shadowBlur = 0;
      } else {
        // Original drawn rocket for other types
        // Rocket glow aura
        const rocketGradient = ctx.createRadialGradient(shipX, shipY, 0, shipX, shipY, rocketSize + 10);
        rocketGradient.addColorStop(0, `${rocketConfig.color}80`);
        rocketGradient.addColorStop(0.7, `${rocketConfig.color}40`);
        rocketGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = rocketGradient;
        ctx.fillRect(shipX - rocketSize - 10, shipY - rocketSize - 10, (rocketSize + 10) * 2, (rocketSize + 10) * 2);

        // Main rocket body
        ctx.fillStyle = rocketConfig.color;
        ctx.shadowColor = rocketConfig.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(shipX, shipY - rocketSize/2);
        ctx.lineTo(shipX - rocketSize/2, shipY + rocketSize);
        ctx.lineTo(shipX + rocketSize/2, shipY + rocketSize);
        ctx.closePath();
        ctx.fill();

        // Rocket-specific details
        if (gameState.selectedRocket === 'stealth') {
          // Stealth - angular design
          ctx.fillStyle = '#444444';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(shipX - rocketSize/3, shipY);
          ctx.lineTo(shipX + rocketSize/3, shipY);
          ctx.lineTo(shipX, shipY - rocketSize/3);
          ctx.closePath();
          ctx.fill();
        } else if (gameState.selectedRocket === 'tank') {
          // Tank - wider, more robust
          ctx.fillStyle = rocketConfig.color;
          ctx.shadowBlur = 12;
          ctx.fillRect(shipX - rocketSize/1.5, shipY, rocketSize * 1.3, rocketSize/3);
        } else if (gameState.selectedRocket === 'speed') {
          // Speed - sleek lines
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(shipX - rocketSize/4, shipY - rocketSize/4);
          ctx.lineTo(shipX + rocketSize/4, shipY - rocketSize/4);
          ctx.stroke();
        } else if (gameState.selectedRocket === 'plasma') {
          // Plasma - energy effects
          const time = Date.now() * 0.01;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(time) * 0.3 + 0.7})`;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 20;
          ctx.fillRect(shipX - 3, shipY - rocketSize/3, 6, rocketSize/2);
        }

        // Enhanced engine trails based on rocket type
        const trailIntensity = rocketConfig.speed;
        ctx.fillStyle = rocketConfig.fireRate > 1 ? '#ff4757' : '#ff6b6b';
        ctx.shadowColor = rocketConfig.fireRate > 1 ? '#ff4757' : '#ff6b6b';
        ctx.shadowBlur = 10 * trailIntensity;
        
        const trailWidth = rocketSize/4 * trailIntensity;
        const trailHeight = rocketSize/2 * trailIntensity;
        ctx.fillRect(shipX - trailWidth, shipY + rocketSize/2, trailWidth * 0.8, trailHeight);
        ctx.fillRect(shipX + trailWidth * 0.2, shipY + rocketSize/2, trailWidth * 0.8, trailHeight);
        
        // Cockpit
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 5;
        ctx.fillRect(shipX - rocketSize/8, shipY + rocketSize/4, rocketSize/4, rocketSize/3);
        ctx.shadowBlur = 0;
      }
    }

    // Enhanced problems with personality-based styling
    const isMobile = canvasSize.width < 768;
    const baseFontSize = Math.min(20, canvasSize.width / 40) * (isMobile ? 2 : 1);
    
    gameState.problems.forEach(problem => {
      const isTarget = problem === gameState.targetProblem;
      const time = Date.now() * 0.005;
      
      // Get personality-based appearance
      const getProblemAppearance = (personality: string, size: string) => {
        const sizeMultiplier = 
          size === 'giant' ? 1.8 :
          size === 'large' ? 1.4 :
          size === 'medium' ? 1.1 : 1.0;
        
        switch (personality) {
          case 'friendly':
            return {
              color: '#22c55e', // Green
              shadowColor: '#22c55e',
              bgColor: 'rgba(34, 197, 94, 0.2)',
              sizeMultiplier,
              pulseIntensity: 0.3
            };
          case 'aggressive':
            return {
              color: '#ef4444', // Red
              shadowColor: '#ef4444',
              bgColor: 'rgba(239, 68, 68, 0.3)',
              sizeMultiplier,
              pulseIntensity: 0.8
            };
          case 'boss':
            return {
              color: '#a855f7', // Purple
              shadowColor: '#a855f7',
              bgColor: 'rgba(168, 85, 247, 0.4)',
              sizeMultiplier: sizeMultiplier * 1.5,
              pulseIntensity: 1.0
            };
          default: // neutral
            return {
              color: '#3b82f6', // Blue
              shadowColor: '#3b82f6',
              bgColor: 'rgba(59, 130, 246, 0.2)',
              sizeMultiplier,
              pulseIntensity: 0.5
            };
        }
      };
      
      const appearance = getProblemAppearance(problem.personality, problem.size);
      const fontSize = baseFontSize * appearance.sizeMultiplier;
      ctx.font = `bold ${fontSize}px system-ui`;
      
      const textWidth = ctx.measureText(problem.text).width;
      const bgPadding = 15 * appearance.sizeMultiplier;
      const bgHeight = 35 * appearance.sizeMultiplier;
      
      // Background only for hard difficulty boss problems with special animations
      if (problem.personality === 'boss' && problem.difficulty === 'hard') {
        // Boss problems get special animated background
        const pulse = Math.sin(time + problem.x * 0.01) * 0.3 + 0.7;
        const bossGradient = ctx.createRadialGradient(
          problem.x + textWidth/2, problem.y - 15, 0,
          problem.x + textWidth/2, problem.y - 15, textWidth + 40
        );
        bossGradient.addColorStop(0, `rgba(168, 85, 247, ${pulse * 0.6})`);
        bossGradient.addColorStop(0.5, `rgba(239, 68, 68, ${pulse * 0.4})`);
        bossGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = bossGradient;
        ctx.fillRect(problem.x - bgPadding, problem.y - bgHeight, textWidth + bgPadding * 2, bgHeight + 10);
      }
      // No background for other problems
      
      // Target highlighting (overrides personality color when targeted)
      if (isTarget) {
        const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
        
        // Enhanced target effect
        const targetGradient = ctx.createRadialGradient(
          problem.x + textWidth/2, problem.y - 15, 0,
          problem.x + textWidth/2, problem.y - 15, textWidth + 30
        );
        targetGradient.addColorStop(0, `rgba(255, 193, 7, ${pulse * 0.6})`);
        targetGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = targetGradient;
        ctx.fillRect(problem.x - 15, problem.y - 40, textWidth + 30, 50);
        
        // Target text
        ctx.fillStyle = '#ffc107';
        ctx.shadowColor = '#ffc107';
        ctx.shadowBlur = 20 + pulse * 10;
      } else {
        // Simple white text for most problems, special effects only for hard boss/aggressive
        if (problem.difficulty === 'hard' && (problem.personality === 'boss' || problem.personality === 'aggressive')) {
          ctx.fillStyle = appearance.color;
          ctx.shadowColor = appearance.shadowColor;
          ctx.shadowBlur = 8 + Math.sin(time + problem.x * 0.02) * appearance.pulseIntensity * 5;
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 2;
        }
      }
      
      // Draw the problem text
      ctx.fillText(problem.text, problem.x, problem.y);
      ctx.shadowBlur = 0;
      
      // Extra effects only for hard boss problems
      if (problem.personality === 'boss' && problem.difficulty === 'hard' && !isTarget) {
        // Boss problems get floating sparkles
        for (let i = 0; i < 3; i++) {
          const sparkleX = problem.x + textWidth/2 + Math.sin(time + i) * 20;
          const sparkleY = problem.y - 20 + Math.cos(time + i * 2) * 10;
          ctx.fillStyle = `rgba(255, 215, 0, ${Math.sin(time + i) * 0.5 + 0.5})`;
          ctx.shadowColor = '#ffd700';
          ctx.shadowBlur = 5;
          ctx.fillRect(sparkleX - 1, sparkleY - 1, 2, 2);
        }
        ctx.shadowBlur = 0;
      }
    });

    // Laser targeting system
    if (gameState.targetProblem && !isGameOver) {
      const targetProblem = gameState.targetProblem;
      const targetX = targetProblem.x + ctx.measureText(targetProblem.text).width / 2;
      const targetY = targetProblem.y;
      const shipX = gameState.rocketX || canvasSize.width / 2;
      const shipY = canvasSize.height - (canvasSize.width < 768 ? 120 : 25);
      
      // Animated laser beam
      const time = Date.now() * 0.01;
      const intensity = Math.sin(time) * 0.3 + 0.7;
      
      // Main laser beam
      ctx.strokeStyle = `rgba(0, 255, 150, ${intensity})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00ff96';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(shipX, shipY - 10);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
      
      // Laser particles along the beam
      const beamLength = Math.sqrt((targetX - shipX) ** 2 + (targetY - shipY + 10) ** 2);
      const particleCount = Math.floor(beamLength / 20);
      
      for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount;
        const particleX = shipX + (targetX - shipX) * t + (Math.random() - 0.5) * 4;
        const particleY = shipY - 10 + (targetY - shipY + 10) * t + (Math.random() - 0.5) * 4;
        
        ctx.fillStyle = `rgba(0, 255, 150, ${intensity * 0.8})`;
        ctx.shadowColor = '#00ff96';
        ctx.shadowBlur = 8;
        ctx.fillRect(particleX - 1, particleY - 1, 2, 2);
      }
      
      // Target crosshair
      ctx.strokeStyle = `rgba(255, 255, 0, ${intensity})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ffff00';
      ctx.shadowBlur = 10;
      
      // Crosshair lines
      const crosshairSize = 15;
      ctx.beginPath();
      ctx.moveTo(targetX - crosshairSize, targetY);
      ctx.lineTo(targetX + crosshairSize, targetY);
      ctx.moveTo(targetX, targetY - crosshairSize);
      ctx.lineTo(targetX, targetY + crosshairSize);
      ctx.stroke();
      
      // Crosshair circle
      ctx.beginPath();
      ctx.arc(targetX, targetY, crosshairSize, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.shadowBlur = 0;
    }

    // Render power-ups
    gameState.powerUps?.forEach(powerUp => {
      if (powerUp.collected) return;
      
      const time = Date.now() * 0.01;
      const pulse = Math.sin(time + powerUp.x * 0.05) * 0.3 + 0.7;
      const config = powerUpConfigs[powerUp.type];
      
      // Power-up glow aura
      const powerUpGradient = ctx.createRadialGradient(
        powerUp.x, powerUp.y, 0,
        powerUp.x, powerUp.y, 40 * pulse
      );
      powerUpGradient.addColorStop(0, `${config.color}60`);
      powerUpGradient.addColorStop(0.5, `${config.color}30`);
      powerUpGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = powerUpGradient;
      ctx.fillRect(powerUp.x - 40, powerUp.y - 40, 80, 80);
      
      // Power-up background
      ctx.fillStyle = `${config.color}40`;
      ctx.shadowColor = config.color;
      ctx.shadowBlur = 15 * pulse;
      ctx.fillRect(powerUp.x - 20, powerUp.y - 20, 40, 40);
      
      // Power-up icon
      ctx.font = 'bold 24px system-ui';
      ctx.fillStyle = config.color;
      ctx.textAlign = 'center';
      ctx.shadowBlur = 10;
      ctx.fillText(config.icon, powerUp.x, powerUp.y + 8);
      
      // Floating particles around power-up
      for (let i = 0; i < 3; i++) {
        const particleAngle = time + i * (Math.PI * 2 / 3);
        const particleX = powerUp.x + Math.cos(particleAngle) * 25;
        const particleY = powerUp.y + Math.sin(particleAngle) * 25;
        const particleAlpha = Math.sin(time + i) * 0.5 + 0.5;
        
        ctx.fillStyle = `${config.color}${Math.floor(particleAlpha * 255).toString(16).padStart(2, '0')}`;
        ctx.shadowBlur = 8;
        ctx.fillRect(particleX - 2, particleY - 2, 4, 4);
      }
      
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
