
import React from 'react';
import { Difficulty, GameStatistics } from '../types/game';

interface GameMenuProps {
  onStartGame: (difficulty: Difficulty) => void;
  onShowStatistics: () => void;
  onShowSettings: () => void;
  statistics: GameStatistics;
}

const GameMenu: React.FC<GameMenuProps> = ({ 
  onStartGame, 
  onShowStatistics, 
  onShowSettings,
  statistics 
}) => {
  return (
    <div className="text-center text-cyan-400">
      <div className="mb-8">
        <h1 className="text-6xl font-bold mb-4 text-cyan-300 animate-pulse">MATHFALL</h1>
        <p className="text-xl">Destroy falling math problems by typing the answers!</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Choose Difficulty</h2>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => onStartGame('easy')}
            className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg text-xl font-bold transition-colors"
          >
            EASY
            <div className="text-sm font-normal mt-1">Simple operations, slower speed</div>
          </button>
          <button
            onClick={() => onStartGame('medium')}
            className="bg-yellow-600 hover:bg-yellow-700 px-8 py-4 rounded-lg text-xl font-bold transition-colors"
          >
            MEDIUM
            <div className="text-sm font-normal mt-1">Mixed operations, moderate speed</div>
          </button>
          <button
            onClick={() => onStartGame('hard')}
            className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg text-xl font-bold transition-colors"
          >
            HARD
            <div className="text-sm font-normal mt-1">Complex problems, fast speed</div>
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="bg-gray-800 rounded-lg p-4 inline-block">
          <h3 className="text-lg font-bold mb-2">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>High Score: <span className="text-yellow-400">{statistics.highScore}</span></div>
            <div>Best Streak: <span className="text-green-400">{statistics.bestStreak}</span></div>
            <div>Accuracy: <span className="text-blue-400">{statistics.accuracy}%</span></div>
            <div>Questions: <span className="text-purple-400">{statistics.totalQuestionsAnswered}</span></div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={onShowStatistics}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition-colors"
        >
          STATISTICS
        </button>
        <button
          onClick={onShowSettings}
          className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded transition-colors"
        >
          SETTINGS
        </button>
      </div>
    </div>
  );
};

export default GameMenu;
