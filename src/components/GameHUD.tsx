
import React from 'react';
import { GameState } from '../types/game';

interface GameHUDProps {
  gameState: GameState;
  onPause: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({ gameState }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = Math.floor((Date.now() - gameState.gameStartTime) / 1000);

  return (
    <>
      {/* Modern Top HUD with glassmorphism effect */}
      <div className="absolute top-6 left-6 right-6 z-10">
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <div className="text-white font-mono">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {gameState.score.toLocaleString()}
              </div>
              <div className="text-sm text-gray-300">
                Streak: <span className={`font-bold ${gameState.statistics.currentStreak > 5 ? 'text-yellow-400' : 'text-white'}`}>
                  {gameState.statistics.currentStreak}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-white font-mono text-2xl font-bold">Wave {gameState.wave}</div>
              <div className="text-sm text-gray-300 uppercase tracking-wider">
                {gameState.difficulty}
              </div>
            </div>
            
            <div className="text-right text-white font-mono">
              <div className="text-xl font-bold">{formatTime(currentTime)}</div>
              <div className="text-sm text-gray-300">
                <span className="text-green-400 font-bold">{gameState.statistics.accuracy}%</span> Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Bottom HUD */}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <div className="text-white font-mono">
              <div className="text-xl">
                Input: <span className="text-yellow-400 font-bold">{gameState.currentInput}</span>
              </div>
              {gameState.targetProblem && (
                <div className="text-sm text-gray-300 mt-1">
                  → <span className="text-cyan-400">{gameState.targetProblem.text}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-mono">Lives:</span>
              {Array.from({ length: gameState.lives }, (_, i) => (
                <div key={i} className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <svg width="12" height="12" className="text-white fill-current">
                    <polygon points="6,1 11,11 6,8 1,11" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Streak Indicator with fade animation */}
      {gameState.statistics.currentStreak > 3 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <div className="streak-overlay text-yellow-400 font-bold text-5xl text-center animate-pulse">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {gameState.statistics.currentStreak} STREAK!
            </div>
            <div className="text-2xl mt-2 text-white">
              🔥 ON FIRE! 🔥
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .streak-overlay {
          animation: streakFade 0.8s ease-out forwards;
        }
        
        @keyframes streakFade {
          0% {
            opacity: 1;
            transform: scale(1.2);
          }
          70% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.9);
          }
        }
      `}</style>
    </>
  );
};

export default GameHUD;
