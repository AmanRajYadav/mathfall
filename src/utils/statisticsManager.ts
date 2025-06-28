
import { GameStatistics } from '../types/game';

const STORAGE_KEY = 'mathfall-statistics';

export const getStoredStatistics = (): GameStatistics => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
  
  return {
    currentStreak: 0,
    bestStreak: 0,
    totalQuestionsAnswered: 0,
    correctAnswers: 0,
    accuracy: 0,
    highScore: 0,
    timePlayedSeconds: 0
  };
};

export const saveStatistics = (statistics: GameStatistics): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statistics));
  } catch (error) {
    console.error('Error saving statistics:', error);
  }
};

export const updateStatistics = (
  currentStats: GameStatistics,
  updates: Partial<GameStatistics>
): GameStatistics => {
  const newStats = { ...currentStats, ...updates };
  
  // Calculate accuracy
  if (newStats.totalQuestionsAnswered > 0) {
    newStats.accuracy = Math.round((newStats.correctAnswers / newStats.totalQuestionsAnswered) * 100);
  }
  
  // Update best streak
  if (newStats.currentStreak > newStats.bestStreak) {
    newStats.bestStreak = newStats.currentStreak;
  }
  
  return newStats;
};
