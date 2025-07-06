
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
      {/* Top HUD with modern glassmorphism */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl shadow-cyan-500/10">
          <div className="flex justify-between items-center">
            <div className="text-white font-mono">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
                {gameState.score.toLocaleString()}
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <span>Streak:</span>
                <span className={`font-bold px-2 py-1 rounded-full text-xs ${
                  gameState.statistics.currentStreak > 5 
                    ? 'text-yellow-400 bg-yellow-400/10' 
                    : 'text-emerald-400 bg-emerald-400/10'
                }`}>
                  {gameState.statistics.currentStreak}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-white font-mono text-xl font-bold mb-1 flex items-center gap-2">
                <span className="text-2xl">🌊</span>
                Wave {gameState.wave}
              </div>
              <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-white/10">
                {gameState.difficulty}
              </div>
            </div>
            
            <div className="text-right text-white font-mono">
              <div className="text-lg font-bold flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-slate-300">
                <span className="text-emerald-400 font-bold">{gameState.statistics.accuracy}%</span> Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD with enhanced styling */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl shadow-blue-500/10">
          <div className="flex justify-between items-center">
            <div className="text-white font-mono flex-1">
              <div className="text-2xl mb-3 flex items-center gap-3">
                <span className="text-slate-400">Input:</span>
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 px-4 py-2 rounded-xl font-bold text-yellow-400 min-w-[120px] text-center shadow-inner">
                  {gameState.currentInput || '_'}
                </div>
              </div>
              {gameState.targetProblem && (
                <div className="text-base text-slate-300 flex items-center gap-2">
                  <span className="text-cyan-400">→</span>
                  <span className="text-cyan-400 font-semibold bg-cyan-400/10 px-3 py-1 rounded-lg">
                    {gameState.targetProblem.text}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 ml-8">
              <span className="text-white text-lg font-mono font-semibold flex items-center gap-2">
                <span className="text-2xl">❤️</span>
                Lives:
              </span>
              <div className="flex gap-2">
                {Array.from({ length: gameState.lives }, (_, i) => (
                  <div key={i} className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 transform hover:scale-110 transition-all duration-200 border-2 border-white/20">
                      <div className="text-white text-lg">♥</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/50 to-pink-500/50 rounded-full blur-sm -z-10"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced streak indicator */}
      {gameState.statistics.currentStreak > 3 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
          <div className="streak-overlay text-center animate-pulse">
            <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-3 drop-shadow-2xl">
              {gameState.statistics.currentStreak} STREAK!
            </div>
            <div className="text-3xl font-bold text-white drop-shadow-lg">
              🔥 ON FIRE! 🔥
            </div>
          </div>
        </div>
      )}

      <style>{`
        .streak-overlay {
          animation: streakFade 1.2s ease-out forwards;
          filter: drop-shadow(0 0 20px rgba(255, 193, 7, 0.8));
        }
        
        @keyframes streakFade {
          0% {
            opacity: 1;
            transform: scale(1.3) translate(-50%, -50%);
          }
          60% {
            opacity: 1;
            transform: scale(1) translate(-50%, -50%);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
};

export default GameHUD;
