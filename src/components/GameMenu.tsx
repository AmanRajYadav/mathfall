
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
    <div className="text-center text-cyan-400 max-w-4xl mx-auto px-4 sm:px-8">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse drop-shadow-2xl">
          MATHFALL
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-1 sm:mb-2">🚀 Destroy falling math problems by typing the answers! 🔢</p>
        <p className="text-xs sm:text-sm text-slate-400">Use your keyboard to save the universe from mathematical chaos</p>
      </div>
      
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 md:mb-6 text-white font-bold">Choose Your Challenge</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          <button
            onClick={() => onStartGame('easy')}
            className="group bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 rounded-2xl text-base sm:text-lg md:text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 border border-green-400/20"
          >
            <div className="text-2xl mb-2">🟢 EASY</div>
            <div className="text-sm font-normal text-green-100">
              Simple operations<br/>
              Relaxed pace<br/>
              Perfect for beginners
            </div>
          </button>
          
          <button
            onClick={() => onStartGame('medium')}
            className="group bg-gradient-to-br from-yellow-600 to-orange-700 hover:from-yellow-500 hover:to-orange-600 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 rounded-2xl text-base sm:text-lg md:text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 border border-yellow-400/20"
          >
            <div className="text-2xl mb-2">🟡 MEDIUM</div>
            <div className="text-sm font-normal text-yellow-100">
              Mixed operations<br/>
              Moderate speed<br/>
              Balanced challenge
            </div>
          </button>
          
          <button
            onClick={() => onStartGame('hard')}
            className="group bg-gradient-to-br from-red-600 to-pink-700 hover:from-red-500 hover:to-pink-600 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 rounded-2xl text-base sm:text-lg md:text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 border border-red-400/20"
          >
            <div className="text-2xl mb-2">🔴 HARD</div>
            <div className="text-sm font-normal text-red-100">
              Complex problems<br/>
              High speed<br/>
              Expert level
            </div>
          </button>
        </div>
      </div>
      
      <div className="mb-4 sm:mb-6">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-6 border border-white/10 shadow-2xl">
          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-white flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl">📊</span>
            Your Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 p-4 rounded-xl border border-yellow-400/20">
              <div className="text-yellow-400 font-bold text-lg">{statistics.highScore.toLocaleString()}</div>
              <div className="text-slate-300">🏆 High Score</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/20 p-4 rounded-xl border border-green-400/20">
              <div className="text-green-400 font-bold text-lg">{statistics.bestStreak}</div>
              <div className="text-slate-300">🔥 Best Streak</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 p-4 rounded-xl border border-blue-400/20">
              <div className="text-blue-400 font-bold text-lg">{statistics.accuracy}%</div>
              <div className="text-slate-300">🎯 Accuracy</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 p-4 rounded-xl border border-purple-400/20">
              <div className="text-purple-400 font-bold text-lg">{statistics.totalQuestionsAnswered}</div>
              <div className="text-slate-300">📝 Questions</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-6">
        <button
          onClick={onShowStatistics}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25"
        >
          <span className="text-xl">📈</span>
          STATISTICS
        </button>
        <button
          onClick={onShowSettings}
          className="bg-gradient-to-r from-gray-600 to-slate-700 hover:from-gray-500 hover:to-slate-600 px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-gray-500/25"
        >
          <span className="text-xl">⚙️</span>
          SETTINGS
        </button>
      </div>
    </div>
  );
};

export default GameMenu;
