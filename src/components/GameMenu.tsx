
import React, { useState, useEffect } from 'react';
import { Difficulty, GameStatistics } from '../types/game';
import { Play, BarChart3, Settings, Trophy, Target, Zap, BookOpen, Star, Award, Clock, Brain, Gamepad2, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

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
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [showModeDetails, setShowModeDetails] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setTimeout(() => {
      onStartGame(difficulty);
    }, 300);
  };

  const difficultyData = {
    easy: {
      color: 'emerald',
      icon: BookOpen,
      title: 'EASY MODE',
      subtitle: 'Perfect for Beginners',
      description: 'Simple arithmetic • Relaxed pace • Basic operations',
      features: ['Addition & Subtraction', 'Numbers 1-50', 'Slower falling speed', 'More lives'],
      gradient: 'from-emerald-500/20 via-emerald-400/10 to-emerald-600/20'
    },
    medium: {
      color: 'amber',
      icon: Target,
      title: 'MEDIUM MODE',
      subtitle: 'Balanced Challenge',
      description: 'Mixed operations • Moderate speed • Strategic thinking',
      features: ['All four operations', 'Numbers 1-100', 'Medium speed', 'Standard lives'],
      gradient: 'from-amber-500/20 via-amber-400/10 to-amber-600/20'
    },
    hard: {
      color: 'red',
      icon: Zap,
      title: 'HARD MODE',
      subtitle: 'Ultimate Challenge',
      description: 'Complex problems • High speed • Expert level',
      features: ['Advanced operations', 'Large numbers', 'Fast falling speed', 'Fewer lives'],
      gradient: 'from-red-500/20 via-red-400/10 to-red-600/20'
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto relative">
      {/* Dynamic animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 animate-gradient bg-300" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.1),transparent_70%)] animate-pulse-glow" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.08),transparent_70%)]" />
      
      <div className="min-h-full flex flex-col items-center justify-center p-6 max-w-6xl mx-auto relative z-10">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Regular particles */}
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className={`absolute rounded-full animate-particle-float ${
                i % 4 === 0 ? 'w-2 h-2 bg-cyan-400/40' :
                i % 4 === 1 ? 'w-1 h-1 bg-blue-500/30' :
                i % 4 === 2 ? 'w-1.5 h-1.5 bg-purple-400/35' :
                'w-0.5 h-0.5 bg-pink-400/25'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
          
          {/* Firefly particles with glow */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={`firefly-${i}`}
              className={`absolute rounded-full animate-firefly-float ${
                i % 3 === 0 ? 'w-3 h-3 bg-yellow-300/80 shadow-firefly-yellow' :
                i % 3 === 1 ? 'w-2.5 h-2.5 bg-cyan-300/70 shadow-firefly-cyan' :
                'w-2 h-2 bg-green-300/75 shadow-firefly-green'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            >
              <div className={`absolute inset-0 rounded-full animate-firefly-pulse ${
                i % 3 === 0 ? 'bg-yellow-200/60' :
                i % 3 === 1 ? 'bg-cyan-200/50' :
                'bg-green-200/55'
              }`} />
            </div>
          ))}
          {/* Moving gradient orbs */}
          {[...Array(5)].map((_, i) => (
            <div 
              key={`orb-${i}`}
              className="absolute w-40 h-40 rounded-full opacity-15 animate-float blur-2xl"
              style={{
                background: i === 0 ? 'radial-gradient(circle, rgba(34,211,238,0.4), transparent)' :
                           i === 1 ? 'radial-gradient(circle, rgba(168,85,247,0.3), transparent)' :
                           i === 2 ? 'radial-gradient(circle, rgba(59,130,246,0.3), transparent)' :
                           i === 3 ? 'radial-gradient(circle, rgba(236,72,153,0.25), transparent)' :
                           'radial-gradient(circle, rgba(34,197,94,0.2), transparent)',
                left: `${10 + i * 20}%`,
                top: `${15 + i * 15}%`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${5 + i * 0.5}s`
              }}
            />
          ))}
          
        </div>

        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <div className="relative inline-block">
            <h1 className={`text-6xl md:text-8xl font-bold mb-4 transition-all duration-1000 animate-float drop-shadow-2xl ${
              animationPhase === 0 ? 'bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500' :
              animationPhase === 1 ? 'bg-gradient-to-r from-purple-500 via-pink-400 to-red-400' :
              animationPhase === 2 ? 'bg-gradient-to-r from-green-300 via-cyan-400 to-blue-500' :
              'bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500'
            } bg-clip-text text-transparent bg-300 animate-gradient animate-neon-pulse`} style={{ filter: 'drop-shadow(0 0 30px rgba(34, 211, 238, 0.5))' }}>
              MATHFALL
            </h1>
            <div className={`absolute -inset-2 blur-xl rounded-lg opacity-70 animate-pulse-glow ${
              animationPhase === 0 ? 'bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-purple-600/30' :
              animationPhase === 1 ? 'bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-red-500/30' :
              animationPhase === 2 ? 'bg-gradient-to-r from-green-400/30 via-cyan-500/30 to-blue-600/30' :
              'bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-red-600/30'
            }`} />
          </div>
          <p className="text-cyan-200 text-xl font-bold mb-3 tracking-wide animate-pulse drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.6)' }}>
            🚀 DESTROY FALLING MATH PROBLEMS 🚀
          </p>
          <p className="text-cyan-100/90 text-base max-w-md mx-auto leading-relaxed font-medium">
            Type the answers to eliminate problems before they reach the bottom
          </p>
        </div>

        {/* Mode Selection */}
        <div className="w-full max-w-5xl mb-12 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ⚡ SELECT YOUR CHALLENGE ⚡
            </h2>
            <p className="text-muted-foreground mb-4">Choose your difficulty and prove your math skills</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowModeDetails(!showModeDetails)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {showModeDetails ? (
                <><ChevronUp className="w-4 h-4 mr-2" />Hide Details</>
              ) : (
                <><ChevronDown className="w-4 h-4 mr-2" />Show Details</>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.entries(difficultyData) as [Difficulty, typeof difficultyData.easy][]).map(([difficulty, data], index) => {
              const IconComponent = data.icon;
              const isSelected = selectedDifficulty === difficulty;
              
              return (
                <Card 
                  key={difficulty}
                  className={`group relative overflow-hidden border-2 transition-all duration-500 cursor-pointer animate-slide-up
                    ${isSelected 
                      ? 'scale-105 shadow-2xl border-cyan-400/50 animate-scale-bounce' 
                      : 'hover:scale-102 hover:shadow-xl border-white/10 hover:border-white/20'
                    }
                    bg-gradient-to-br ${data.gradient} backdrop-blur-sm
                  `}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  onClick={() => handleDifficultySelect(difficulty)}
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardContent className="p-8 text-center relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-${data.color}-500/20 to-${data.color}-600/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 text-${data.color}-400 group-hover:text-${data.color}-300 transition-colors`} />
                    </div>
                    
                    {/* Title */}
                    <h3 className={`text-xl font-bold mb-1 text-${data.color}-400 group-hover:text-${data.color}-300 transition-colors`}>
                      {data.title}
                    </h3>
                    <p className="text-xs text-muted-foreground/80 mb-4 font-medium">
                      {data.subtitle}
                    </p>
                    
                    {/* Description */}
                    <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
                      {data.description}
                    </p>
                    
                    {/* Features (shown when details are expanded) */}
                    {showModeDetails && (
                      <div className="mb-6 text-left">
                        <h4 className="text-xs font-semibold text-foreground/60 mb-2 uppercase tracking-wide">Features:</h4>
                        <ul className="text-xs text-foreground/50 space-y-1">
                          {data.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <Star className="w-3 h-3 mr-2 text-yellow-400" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Play Button */}
                    <Button 
                      className={`w-full bg-gradient-to-r from-${data.color}-600 to-${data.color}-700 hover:from-${data.color}-500 hover:to-${data.color}-600 text-white font-semibold py-3 text-sm transition-all duration-300 group-hover:shadow-lg`}
                      disabled={isSelected}
                    >
                      {isSelected ? (
                        <><Gamepad2 className="w-4 h-4 mr-2 animate-spin" />Starting...</>
                      ) : (
                        <><Play className="w-4 h-4 mr-2" />Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</>
                      )}
                    </Button>
                  </CardContent>
                  
                  {/* Hover glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r from-${data.color}-600/20 to-${data.color}-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
                </Card>
              );
            })}
          </div>
        </div>

        {/* Enhanced Statistics Panel */}
        <Card className="w-full max-w-5xl mb-8 border-2 border-cyan-400/30 bg-gradient-to-br from-gray-900/80 via-blue-900/60 to-purple-900/70 backdrop-blur-md relative overflow-hidden animate-slide-up shadow-2xl shadow-cyan-500/20" style={{ animationDelay: '0.6s' }}>
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.2),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.1),transparent_50%)]" />
          </div>
          
          <CardContent className="p-8 relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-3 animate-neon-pulse">
                <Award className="w-7 h-7 text-yellow-300 animate-pulse-glow" />
                🏆 YOUR ACHIEVEMENTS 🏆
                <Award className="w-7 h-7 text-yellow-300 animate-pulse-glow" />
              </h3>
              <p className="text-cyan-200/80 text-base font-medium">Track your progress and celebrate your victories</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* High Score */}
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500/40 to-yellow-600/60 flex items-center justify-center group-hover:scale-110 transition-all duration-300 border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/30 animate-pulse-glow animate-stats-breathe" style={{ '--glow-color': '253, 224, 71' } as React.CSSProperties}>
                  <Trophy className="w-8 h-8 text-yellow-200 group-hover:text-yellow-100 transition-colors drop-shadow-lg" />
                </div>
                <div className="text-3xl font-bold text-yellow-200 mb-2 group-hover:text-yellow-100 transition-colors drop-shadow-lg">
                  {statistics.highScore.toLocaleString()}
                </div>
                <div className="text-sm text-yellow-300/90 font-semibold uppercase tracking-wide">High Score</div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent mt-3 rounded-full" />
              </div>
              
              {/* Best Streak */}
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/40 to-orange-600/60 flex items-center justify-center group-hover:scale-110 transition-all duration-300 border-2 border-orange-400/50 shadow-lg shadow-orange-400/30 animate-pulse-glow animate-stats-breathe" style={{ '--glow-color': '251, 146, 60' } as React.CSSProperties}>
                  <Zap className="w-8 h-8 text-orange-200 group-hover:text-orange-100 transition-colors drop-shadow-lg" />
                </div>
                <div className="text-3xl font-bold text-orange-200 mb-2 group-hover:text-orange-100 transition-colors drop-shadow-lg">
                  {statistics.bestStreak}
                </div>
                <div className="text-sm text-orange-300/90 font-semibold uppercase tracking-wide">Best Streak</div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-orange-400/70 to-transparent mt-3 rounded-full" />
              </div>
              
              {/* Accuracy */}
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/40 to-blue-600/60 flex items-center justify-center group-hover:scale-110 transition-all duration-300 border-2 border-blue-400/50 shadow-lg shadow-blue-400/30 animate-pulse-glow animate-stats-breathe" style={{ '--glow-color': '59, 130, 246' } as React.CSSProperties}>
                  <Target className="w-8 h-8 text-blue-200 group-hover:text-blue-100 transition-colors drop-shadow-lg" />
                </div>
                <div className="text-3xl font-bold text-blue-200 mb-2 group-hover:text-blue-100 transition-colors drop-shadow-lg">
                  {statistics.accuracy}%
                </div>
                <div className="text-sm text-blue-300/90 font-semibold uppercase tracking-wide">Accuracy</div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-400/70 to-transparent mt-3 rounded-full" />
              </div>
              
              {/* Questions Answered */}
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/40 to-purple-600/60 flex items-center justify-center group-hover:scale-110 transition-all duration-300 border-2 border-purple-400/50 shadow-lg shadow-purple-400/30 animate-pulse-glow animate-stats-breathe" style={{ '--glow-color': '168, 85, 247' } as React.CSSProperties}>
                  <Brain className="w-8 h-8 text-purple-200 group-hover:text-purple-100 transition-colors drop-shadow-lg" />
                </div>
                <div className="text-3xl font-bold text-purple-200 mb-2 group-hover:text-purple-100 transition-colors drop-shadow-lg">
                  {statistics.totalQuestionsAnswered.toLocaleString()}
                </div>
                <div className="text-sm text-purple-300/90 font-semibold uppercase tracking-wide">Questions</div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400/70 to-transparent mt-3 rounded-full" />
              </div>
            </div>
            
            {/* Additional Stats Row */}
            <div className="grid grid-cols-2 gap-8 mt-10 pt-8 border-t border-cyan-400/20">
              <div className="text-center group">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-green-300 animate-pulse" />
                  <span className="text-base font-semibold text-green-200">Time Played</span>
                </div>
                <div className="text-2xl font-bold text-green-100 drop-shadow-lg group-hover:text-green-50 transition-colors">
                  {Math.floor(statistics.timePlayedSeconds / 60)}m {statistics.timePlayedSeconds % 60}s
                </div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Star className="w-5 h-5 text-pink-300 animate-pulse" />
                  <span className="text-base font-semibold text-pink-200">Current Streak</span>
                </div>
                <div className="text-2xl font-bold text-pink-100 drop-shadow-lg group-hover:text-pink-50 transition-colors">
                  {statistics.currentStreak || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 relative z-10 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <Button
            onClick={onShowStatistics}
            variant="outline"
            className="px-10 py-4 bg-gradient-to-r from-cyan-500/80 to-blue-500/80 border-2 border-cyan-300/80 hover:border-cyan-200 text-white hover:text-cyan-50 font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/60 group backdrop-blur-md hover:bg-gradient-to-r hover:from-cyan-400/90 hover:to-blue-400/90"
            style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.8)' }}
          >
            <BarChart3 className="w-6 h-6 mr-3 group-hover:scale-125 transition-transform drop-shadow-2xl" />
            📊 Detailed Statistics
          </Button>
          <Button
            onClick={onShowSettings}
            variant="outline"
            className="px-10 py-4 bg-gradient-to-r from-purple-500/80 to-pink-500/80 border-2 border-purple-300/80 hover:border-purple-200 text-white hover:text-purple-50 font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-400/60 group backdrop-blur-md hover:bg-gradient-to-r hover:from-purple-400/90 hover:to-pink-400/90"
            style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.8)' }}
          >
            <Settings className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300 drop-shadow-2xl" />
            ⚙️ Game Settings
          </Button>
          <Button
            variant="outline"
            className="px-10 py-4 bg-gradient-to-r from-green-500/80 to-emerald-500/80 border-2 border-green-300/80 hover:border-green-200 text-white hover:text-green-50 font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-green-400/60 group backdrop-blur-md hover:bg-gradient-to-r hover:from-green-400/90 hover:to-emerald-400/90"
            onClick={() => window.open('https://github.com/mathfall-game', '_blank')}
            style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}
          >
            <Volume2 className="w-6 h-6 mr-3 group-hover:scale-125 transition-transform drop-shadow-2xl" />
            🎵 Sound Test
          </Button>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-xs text-muted-foreground/60 relative z-10">
          <p>🎮 Made with ❤️ for math enthusiasts • Press ESC anytime to return to menu 🎮</p>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
