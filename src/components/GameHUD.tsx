
import React from 'react';
import { GameState } from '../types/game';

interface GameHUDProps {
  gameState: GameState;
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
      {/* Reduced height top HUD */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="text-white font-mono">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
                {gameState.score.toLocaleString()}
              </div>
              <div className="text-xs text-slate-300">
                Streak: <span className={`font-bold ${gameState.statistics.currentStreak > 5 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  {gameState.statistics.currentStreak}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-white font-mono text-xl font-bold mb-1">Wave {gameState.wave}</div>
              <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold px-2 py-1 bg-white/10 rounded-full">
                {gameState.difficulty}
              </div>
            </div>
            
            <div className="text-right text-white font-mono">
              <div className="text-lg font-bold">{formatTime(currentTime)}</div>
              <div className="text-xs text-slate-300">
                <span className="text-emerald-400 font-bold">{gameState.statistics.accuracy}%</span> Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="text-white font-mono flex-1">
              <div className="text-2xl mb-2">
                Input: <span className="text-yellow-400 font-bold bg-slate-800/50 px-3 py-1 rounded-xl">{gameState.currentInput || '_'}</span>
              </div>
              {gameState.targetProblem && (
                <div className="text-base text-slate-300">
                  → <span className="text-cyan-400 font-semibold">{gameState.targetProblem.text}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 ml-6">
              <span className="text-white text-lg font-mono font-semibold">Lives:</span>
              <div className="flex gap-2">
                {Array.from({ length: gameState.lives }, (_, i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                    <svg width="16" height="16" className="text-white fill-current">
                      <polygon points="8,2 13,13 8,10 3,13" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Streak Indicator with fade animation */}
      {gameState.statistics.currentStreak > 3 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <div className="streak-overlay text-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-3 animate-pulse">
              {gameState.statistics.currentStreak} STREAK!
            </div>
            <div className="text-3xl text-white font-bold">
              🔥 ON FIRE! 🔥
            </div>
          </div>
        </div>
      )}

      <style>{`
        .streak-overlay {
          animation: streakFade 0.8s ease-out forwards;
        }
        
        @keyframes streakFade {
          0% {
            opacity: 1;
            transform: scale(1.2) translate(-50%, -50%);
          }
          70% {
            opacity: 1;
            transform: scale(1) translate(-50%, -50%);
          }
          100% {
            opacity: 0;
            transform: scale(0.9) translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
};

export default GameHUD;
