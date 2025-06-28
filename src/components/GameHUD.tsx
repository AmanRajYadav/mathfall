
import React from 'react';
import { GameState } from '../types/game';

interface GameHUDProps {
  gameState: GameState;
  onPause: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({ gameState, onPause }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = Math.floor((Date.now() - gameState.gameStartTime) / 1000);

  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-10">
        <div className="text-cyan-400 font-mono">
          <div className="text-2xl font-bold">Score: {gameState.score}</div>
          <div className="text-sm">
            Streak: <span className={`${gameState.statistics.currentStreak > 5 ? 'text-yellow-400' : 'text-white'}`}>
              {gameState.statistics.currentStreak}
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-cyan-400 font-mono text-xl">Wave {gameState.wave}</div>
          <div className="text-sm text-gray-300">
            {gameState.difficulty.toUpperCase()}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-cyan-400 font-mono">
            <div className="text-lg">Time: {formatTime(currentTime)}</div>
            <div className="text-sm">
              Accuracy: <span className="text-green-400">{gameState.statistics.accuracy}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none z-10">
        <div className="text-yellow-400 font-mono text-xl">
          Input: {gameState.currentInput}
          {gameState.targetProblem && (
            <div className="text-sm text-gray-300">
              → {gameState.targetProblem.text}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Lives as ship icons */}
          {Array.from({ length: gameState.lives }, (_, i) => (
            <svg key={i} width="20" height="20" className="text-cyan-400 fill-current">
              <polygon points="10,2 18,18 10,14 2,18" />
            </svg>
          ))}
        </div>
      </div>

      {/* Pause Button */}
      <button
        onClick={onPause}
        className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded pointer-events-auto z-20 transition-colors"
      >
        PAUSE
      </button>

      {/* Streak Indicator */}
      {gameState.statistics.currentStreak > 3 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <div className="text-yellow-400 font-bold text-4xl animate-pulse">
            {gameState.statistics.currentStreak} STREAK!
          </div>
        </div>
      )}
    </>
  );
};

export default GameHUD;
