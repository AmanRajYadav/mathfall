
import React from 'react';
import { Difficulty, GameStatistics } from '../types/game';
import { Play, BarChart3, Settings, Trophy, Target, Zap, BookOpen } from 'lucide-react';
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
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
          MATHFALL
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Destroy falling math problems by typing the answers
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-xl font-semibold text-center mb-6 text-foreground">Choose Your Challenge</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Easy */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-emerald-200/20 bg-gradient-to-br from-emerald-50/5 to-emerald-100/10">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-emerald-600">EASY</h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Simple operations • Relaxed pace
              </p>
              <Button 
                onClick={() => onStartGame('easy')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
              >
                <Play className="w-3 h-3 mr-2" />
                Start Easy
              </Button>
            </CardContent>
          </Card>

          {/* Medium */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-amber-200/20 bg-gradient-to-br from-amber-50/5 to-amber-100/10">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-amber-600">MEDIUM</h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Mixed operations • Moderate speed
              </p>
              <Button 
                onClick={() => onStartGame('medium')}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm"
              >
                <Play className="w-3 h-3 mr-2" />
                Start Medium
              </Button>
            </CardContent>
          </Card>

          {/* Hard */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-red-200/20 bg-gradient-to-br from-red-50/5 to-red-100/10">
            <CardContent className="p-6 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">HARD</h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Complex problems • High speed
              </p>
              <Button 
                onClick={() => onStartGame('hard')}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                <Play className="w-3 h-3 mr-2" />
                Start Hard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistics */}
      <Card className="w-full max-w-4xl mb-6 border-border/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Your Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-yellow-100 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-xl font-bold text-yellow-600 mb-1">{statistics.highScore.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">High Score</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-xl font-bold text-orange-600 mb-1">{statistics.bestStreak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-xl font-bold text-blue-600 mb-1">{statistics.accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-xl font-bold text-purple-600 mb-1">{statistics.totalQuestionsAnswered}</div>
              <div className="text-xs text-muted-foreground">Questions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onShowStatistics}
          variant="outline"
          className="px-6"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Statistics
        </Button>
        <Button
          onClick={onShowSettings}
          variant="outline"
          className="px-6"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default GameMenu;
