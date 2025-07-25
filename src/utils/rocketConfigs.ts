import { RocketConfig, RocketType } from '../types/game';

export const rocketConfigs: Record<RocketType, RocketConfig> = {
  classic: {
    id: 'classic',
    name: '🚀 Classic Rocket',
    description: 'The original animated rocket with balanced stats',
    color: '#70a1ff',
    size: 1.0,
    laserColor: '#00ff96',
    engineColor: '#ff6b6b',
    speed: 1.0,
    fireRate: 1.0,
    useGif: true,
    gifPath: '/rocket-moving.gif'
  },
  stealth: {
    id: 'stealth',
    name: '🥷 Stealth Fighter',
    description: 'Fast and agile with purple energy beams',
    color: '#8e44ad',
    size: 0.8,
    laserColor: '#9b59b6',
    engineColor: '#e74c3c',
    speed: 1.3,
    fireRate: 1.2
  },
  tank: {
    id: 'tank',
    name: '🛡️ Tank Destroyer',
    description: 'Heavy armor, powerful orange lasers, slower movement',
    color: '#f39c12',
    size: 1.4,
    laserColor: '#ff8c00',
    engineColor: '#e67e22',
    speed: 0.7,
    fireRate: 0.8
  },
  speed: {
    id: 'speed',
    name: '⚡ Speed Demon',
    description: 'Ultra-fast cyan rocket with rapid-fire capabilities',
    color: '#00d2d3',
    size: 0.9,
    laserColor: '#00ffff',
    engineColor: '#ff00ff',
    speed: 1.5,
    fireRate: 1.5
  },
  plasma: {
    id: 'plasma',
    name: '🌟 Plasma Cruiser',
    description: 'Advanced ship with rainbow energy and special effects',
    color: '#ff0080',
    size: 1.1,
    laserColor: '#ffffff',
    engineColor: '#00ff00',
    speed: 1.1,
    fireRate: 1.3
  }
};

export const getRandomRocket = (): RocketType => {
  const rockets = Object.keys(rocketConfigs) as RocketType[];
  return rockets[Math.floor(Math.random() * rockets.length)];
};

export const getRocketConfig = (type: RocketType): RocketConfig => {
  return rocketConfigs[type];
};