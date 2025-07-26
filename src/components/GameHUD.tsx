
import React, { useState } from 'react';
import { GameState } from '../types/game';
import { useIsMobile } from '../hooks/use-mobile';
import { powerUpConfigs } from '../utils/powerUpConfigs';
import { getVoiceInputManager } from '../utils/voiceInput';

interface GameHUDProps {
  gameState: GameState;
  onVoiceInput?: (input: string) => void;
}

const GameHUD: React.FC<GameHUDProps> = ({ gameState, onVoiceInput }) => {
  const isMobile = useIsMobile();
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const voiceManager = getVoiceInputManager({
    useGemini: true,
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY
  });

  // Debug API key loading
  React.useEffect(() => {
    console.log('VITE_GEMINI_API_KEY loaded:', !!import.meta.env.VITE_GEMINI_API_KEY);
    console.log('Voice manager using Gemini:', voiceManager.isSupported());
  }, []);

  const toggleVoiceInput = async () => {
    if (!isVoiceEnabled) {
      // Enable voice input
      setIsVoiceEnabled(true);
      setIsListening(true);
      
      const success = await voiceManager.startListening(
        (text: string) => {
          console.log('GameHUD: Voice input received:', text);
          if (onVoiceInput) {
            console.log('GameHUD: Calling onVoiceInput with:', text);
            onVoiceInput(text);
          } else {
            console.log('GameHUD: No onVoiceInput callback provided');
          }
          // Continue listening for next input
          setTimeout(() => {
            if (isVoiceEnabled) {
              voiceManager.startListening(
                (text: string) => {
                  if (onVoiceInput) onVoiceInput(text);
                },
                (error: string) => console.error('Voice input error:', error)
              );
            }
          }, 100);
        },
        (error: string) => {
          console.error('Voice input error:', error);
          setIsListening(false);
        }
      );
      
      if (!success) {
        setIsVoiceEnabled(false);
        setIsListening(false);
      }
    } else {
      // Disable voice input
      voiceManager.stopListening();
      setIsVoiceEnabled(false);
      setIsListening(false);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = Math.floor((Date.now() - gameState.gameStartTime) / 1000);

  return (
    <>
      {/* Top HUD - responsive */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-10">
        <div className="flex justify-between items-center px-2 sm:px-4">
          <div className="text-white font-mono">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1 drop-shadow-lg">
              {gameState.score.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-white flex items-center gap-1 sm:gap-2 drop-shadow-md">
              <span className={isMobile ? 'hidden' : ''}>Streak:</span>
              <span className={`font-bold px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                gameState.statistics.currentStreak > 5 
                  ? 'text-yellow-300 bg-yellow-400/20 border border-yellow-400/30' 
                  : 'text-emerald-300 bg-emerald-400/20 border border-emerald-400/30'
              }`}>
                {isMobile ? `🔥${gameState.statistics.currentStreak}` : gameState.statistics.currentStreak}
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-white font-mono text-lg sm:text-xl md:text-2xl font-bold mb-1 flex items-center gap-1 sm:gap-3 drop-shadow-lg">
              <span className="text-xl sm:text-2xl md:text-3xl">🌊</span>
              <span className={isMobile ? 'text-sm' : ''}>{isMobile ? `W${gameState.wave}` : `Wave ${gameState.wave}`}</span>
            </div>
            <div className="text-xs sm:text-sm text-white uppercase tracking-wider font-semibold px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full border border-white/20 backdrop-blur-sm">
              {isMobile ? gameState.difficulty.charAt(0).toUpperCase() : gameState.difficulty}
            </div>
          </div>
          
          <div className="text-right text-white font-mono flex items-center gap-2 sm:gap-4">
            {/* Voice Input Toggle Button */}
            <button
              onClick={toggleVoiceInput}
              className={`
                flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-200 transform hover:scale-110
                ${isVoiceEnabled 
                  ? 'bg-red-500/80 border-red-400 shadow-lg shadow-red-500/40' 
                  : 'bg-blue-500/80 border-blue-400 shadow-lg shadow-blue-500/40'
                }
                ${isListening ? 'animate-pulse' : ''}
              `}
              title={isVoiceEnabled ? 'Disable Voice Input' : 'Enable Voice Input'}
            >
              <span className="text-white text-lg sm:text-xl">
                {isVoiceEnabled ? '🔴' : '🎤'}
              </span>
            </button>
            
            <div>
              <div className="text-sm sm:text-lg md:text-xl font-bold flex items-center gap-1 sm:gap-3 drop-shadow-lg">
                <span className="text-lg sm:text-xl md:text-2xl">⏱️</span>
                <span className={isMobile ? 'text-xs' : ''}>{formatTime(currentTime)}</span>
              </div>
              <div className="text-xs sm:text-sm text-white drop-shadow-md">
                <span className="text-emerald-300 font-bold">{gameState.statistics.accuracy}%</span>
                {!isMobile && ' Accuracy'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD - responsive for mobile */}
      {!isMobile && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex justify-between items-center px-6">
            <div className="text-white font-mono flex-1">
              <div className="text-2xl mb-3 flex items-center gap-4">
                <span className="text-white drop-shadow-lg">Input:</span>
                <div className="bg-slate-800/70 border border-slate-500/50 px-6 py-3 rounded-xl font-bold text-yellow-300 min-w-[140px] text-center shadow-lg backdrop-blur-sm">
                  {gameState.currentInput || '_'}
                </div>
              </div>
              {gameState.targetProblem && (
                <div className="text-lg text-white flex items-center gap-3 drop-shadow-md">
                  <span className="text-cyan-300">→</span>
                  <span className="text-cyan-300 font-semibold bg-cyan-400/20 px-4 py-2 rounded-lg border border-cyan-400/30 backdrop-blur-sm">
                    {gameState.targetProblem.text}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 ml-8">
              <span className="text-white text-xl font-mono font-semibold flex items-center gap-3 drop-shadow-lg">
                <span className="text-3xl">❤️</span>
                Lives:
              </span>
              <div className="flex gap-2">
                {Array.from({ length: gameState.lives }, (_, i) => (
                  <div key={i} className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 transform hover:scale-110 transition-all duration-200 border-2 border-white/30">
                      <div className="text-white text-xl">♥</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/60 to-pink-500/60 rounded-full blur-md -z-10"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom HUD - compact version */}
      {isMobile && (
        <div className="absolute bottom-48 left-2 right-2 z-10">
          <div className="flex justify-between items-center px-2">
            <div className="text-white font-mono text-center">
              {gameState.targetProblem && (
                <div className="text-sm flex items-center gap-2 justify-center bg-cyan-400/20 px-3 py-1 rounded-lg border border-cyan-400/30 backdrop-blur-sm">
                  <span className="text-cyan-300">→</span>
                  <span className="text-cyan-300 font-semibold">
                    {gameState.targetProblem.text}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-mono font-semibold flex items-center gap-1">
                <span className="text-lg">❤️</span>
                {gameState.lives}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Power-ups Display */}
      {gameState.activePowerUps && gameState.activePowerUps.length > 0 && (
        <div className="absolute top-16 sm:top-20 right-2 sm:right-4 z-20">
          <div className="flex flex-col gap-2">
            {gameState.activePowerUps.map((powerUp, index) => {
              const config = powerUpConfigs[powerUp.type];
              const timePercentage = (powerUp.remainingTime / config.duration) * 100;
              
              return (
                <div key={`${powerUp.type}-${index}`} className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg p-2 sm:p-3 min-w-[100px] sm:min-w-[140px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg" style={{ color: config.color }}>
                      {config.icon}
                    </span>
                    <span className="text-xs sm:text-sm text-white font-semibold truncate">
                      {isMobile ? config.name.split(' ')[1] || config.name : config.name}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        backgroundColor: config.color,
                        width: `${timePercentage}%`,
                        boxShadow: `0 0 8px ${config.color}60`
                      }}
                    />
                  </div>
                  <div className="text-xs text-white/70 mt-1 text-center">
                    {Math.ceil(powerUp.remainingTime)}s
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
