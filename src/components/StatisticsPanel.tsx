
import React from 'react';
import { GameStatistics } from '../types/game';

interface StatisticsPanelProps {
  statistics: GameStatistics;
  onBack: () => void;
  onResetStats: () => void;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ 
  statistics, 
  onBack, 
  onResetStats 
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="text-center text-cyan-400 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">STATISTICS</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">SCORES</h3>
          <div className="space-y-2 text-lg">
            <div>High Score: <span className="text-white font-bold">{statistics.highScore}</span></div>
            <div>Total Questions: <span className="text-white font-bold">{statistics.totalQuestionsAnswered}</span></div>
            <div>Correct Answers: <span className="text-green-400 font-bold">{statistics.correctAnswers}</span></div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-green-400 mb-4">ACCURACY</h3>
          <div className="space-y-2 text-lg">
            <div>Overall: <span className="text-white font-bold">{statistics.accuracy}%</span></div>
            <div>Current Streak: <span className="text-yellow-400 font-bold">{statistics.currentStreak}</span></div>
            <div>Best Streak: <span className="text-yellow-400 font-bold">{statistics.bestStreak}</span></div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">TIME</h3>
          <div className="space-y-2 text-lg">
            <div>Total Played: <span className="text-white font-bold">{formatTime(statistics.timePlayedSeconds)}</span></div>
            <div>Questions/Min: <span className="text-white font-bold">
              {statistics.timePlayedSeconds > 0 ? 
                Math.round((statistics.totalQuestionsAnswered / (statistics.timePlayedSeconds / 60)) * 10) / 10 : 0}
            </span></div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-purple-400 mb-4">ACHIEVEMENTS</h3>
          <div className="space-y-2 text-sm">
            <div className={statistics.bestStreak >= 10 ? 'text-yellow-400' : 'text-gray-500'}>
              🏆 Streak Master (10+): {statistics.bestStreak >= 10 ? '✓' : '✗'}
            </div>
            <div className={statistics.totalQuestionsAnswered >= 100 ? 'text-yellow-400' : 'text-gray-500'}>
              📚 Scholar (100+ questions): {statistics.totalQuestionsAnswered >= 100 ? '✓' : '✗'}
            </div>
            <div className={statistics.accuracy >= 90 ? 'text-yellow-400' : 'text-gray-500'}>
              🎯 Sharpshooter (90%+ accuracy): {statistics.accuracy >= 90 ? '✓' : '✗'}
            </div>
            <div className={statistics.highScore >= 1000 ? 'text-yellow-400' : 'text-gray-500'}>
              ⭐ High Scorer (1000+ points): {statistics.highScore >= 1000 ? '✓' : '✗'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-xl font-bold transition-colors"
        >
          BACK TO MENU
        </button>
        <button
          onClick={onResetStats}
          className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg text-xl font-bold transition-colors"
        >
          RESET STATS
        </button>
      </div>
    </div>
  );
};

export default StatisticsPanel;
