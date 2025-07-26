import { PowerUpConfig, PowerUpType } from '../types/game';

export const powerUpConfigs: Record<PowerUpType, PowerUpConfig> = {
  timeSlowdown: {
    id: 'timeSlowdown',
    name: '⏰ Time Warp',
    description: 'Slows down all falling problems for 30 seconds',
    color: '#00ffff',
    icon: '⏰',
    duration: 30,
    rarity: 0.3
  },
  destroyAll: {
    id: 'destroyAll',
    name: '💥 Nuclear Strike',
    description: 'Instantly destroys all problems on screen',
    color: '#ff4444',
    icon: '💥',
    duration: 0, // Instant effect
    rarity: 0.1
  },
  shield: {
    id: 'shield',
    name: '🛡️ Force Shield',
    description: 'Protects rocket from missed problems for 45 seconds',
    color: '#44ff44',
    icon: '🛡️',
    duration: 45,
    rarity: 0.25
  },
  rapidFire: {
    id: 'rapidFire',
    name: '⚡ Rapid Fire',
    description: 'Allows solving problems instantly for 20 seconds',
    color: '#ffff00',
    icon: '⚡',
    duration: 20,
    rarity: 0.2
  },
  multiplier: {
    id: 'multiplier',
    name: '💎 Score Multiplier',
    description: 'Double score for all problems solved in 60 seconds',
    color: '#ff00ff',
    icon: '💎',
    duration: 60,
    rarity: 0.4
  },
  freeze: {
    id: 'freeze',
    name: '❄️ Freeze Ray',
    description: 'Freezes all problems in place for 15 seconds',
    color: '#88ddff',
    icon: '❄️',
    duration: 15,
    rarity: 0.15
  }
};

export const shouldSpawnPowerUp = (wave: number, problemsSolved: number): boolean => {
  // Higher chance in later waves - increased by 30% from original values
  const baseChance = ((0.02 + (wave * 0.005)) * 0.1) * 1.3;
  
  // Bonus chance for solving difficult problems - increased by 30%
  const difficultyBonus = ((problemsSolved * 0.001) * 0.1) * 1.3;
  
  // Special power-ups drop from boss problems - increased final chance by 30%
  const finalChance = Math.min(baseChance + difficultyBonus, 0.0195); // Increased from 0.015 to 0.0195 (30% more)
  
  return Math.random() < finalChance;
};

export const getRandomPowerUpType = (wave: number): PowerUpType => {
  const availablePowerUps = Object.values(powerUpConfigs);
  
  // Filter by rarity - later waves can get rarer power-ups
  const filteredPowerUps = availablePowerUps.filter(config => {
    const waveModifier = Math.min(wave * 0.1, 0.5);
    return Math.random() < (config.rarity + waveModifier);
  });
  
  if (filteredPowerUps.length === 0) {
    return 'multiplier'; // Fallback
  }
  
  return filteredPowerUps[Math.floor(Math.random() * filteredPowerUps.length)].id;
};

export const createPowerUp = (type: PowerUpType, x: number, y: number): import('../types/game').PowerUp => {
  return {
    id: `powerup_${Date.now()}_${Math.random()}`,
    type,
    x,
    y,
    speed: 0.5 + Math.random() * 0.3,
    collected: false,
    duration: powerUpConfigs[type].duration
  };
};