
import React, { useState } from 'react';
import { RocketType, rocketConfigs } from '../utils/rocketConfigs';
import { setMusicVolume, getMusicVolume, toggleMusic, getMusicEnabled } from '../utils/audio';
import { Volume2, VolumeX, Rocket, Settings as SettingsIcon } from 'lucide-react';

interface SettingsPanelProps {
  onBack: () => void;
  selectedRocket: RocketType;
  onRocketChange: (rocket: RocketType) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  onBack, 
  selectedRocket, 
  onRocketChange
}) => {
  const [volume, setVolume] = useState(getMusicVolume() * 100);
  const [musicEnabled, setMusicEnabled] = useState(getMusicEnabled());
  const [effects, setEffects] = useState(true);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setMusicVolume(newVolume / 100);
  };

  const handleMusicToggle = () => {
    const enabled = toggleMusic();
    setMusicEnabled(enabled);
  };

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-neon-pulse">
            <SettingsIcon className="w-12 h-12 inline-block mr-4 text-cyan-400" />
            ⚙️ GAME SETTINGS ⚙️
          </h1>
          <p className="text-cyan-200 text-lg font-medium">Customize your gaming experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Rocket Selection */}
          <div className="bg-gradient-to-br from-gray-900/80 via-blue-900/60 to-purple-900/70 backdrop-blur-md border-2 border-cyan-400/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20">
            <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <Rocket className="w-6 h-6 text-cyan-400" />
              🚀 SELECT ROCKET 🚀
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {Object.values(rocketConfigs).map((rocket) => {
                const isSelected = selectedRocket === rocket.id;
                return (
                  <div
                    key={rocket.id}
                    onClick={() => onRocketChange(rocket.id)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                      isSelected 
                        ? 'border-cyan-400/70 bg-cyan-400/20 scale-105 shadow-lg shadow-cyan-400/30' 
                        : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: rocket.color + '40', border: `2px solid ${rocket.color}` }}
                      >
                        🚀
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg" style={{ color: rocket.color }}>
                          {rocket.name}
                        </h4>
                        <p className="text-sm text-gray-300">{rocket.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-400">
                          <span>Speed: {rocket.speed}x</span>
                          <span>Fire Rate: {rocket.fireRate}x</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="text-cyan-400 text-xl animate-pulse">✓</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audio & Voice Settings */}
          <div className="space-y-6">
            {/* Audio Settings */}
            <div className="bg-gradient-to-br from-gray-900/80 via-green-900/60 to-blue-900/70 backdrop-blur-md border-2 border-green-400/30 rounded-2xl p-6 shadow-2xl shadow-green-500/20">
              <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-300 to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
                <Volume2 className="w-6 h-6 text-green-400" />
                🎵 AUDIO SETTINGS 🎵
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-lg font-semibold text-green-200">Music Volume</label>
                    <button
                      onClick={handleMusicToggle}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        musicEnabled 
                          ? 'bg-green-500/30 text-green-300 hover:bg-green-500/50' 
                          : 'bg-red-500/30 text-red-300 hover:bg-red-500/50'
                      }`}
                    >
                      {musicEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    disabled={!musicEnabled}
                    className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-sm text-gray-400 mt-2 text-center">{Math.round(volume)}%</div>
                </div>
                
                <div>
                  <label className="flex items-center justify-between text-lg font-semibold text-green-200">
                    Visual Effects
                    <input
                      type="checkbox"
                      checked={effects}
                      onChange={(e) => setEffects(e.target.checked)}
                      className="w-6 h-6 ml-4 accent-green-400"
                    />
                  </label>
                  <div className="text-sm text-gray-400 mt-1">Particle effects and animations</div>
                </div>
              </div>
            </div>

            {/* Future Features */}
            <div className="bg-gradient-to-br from-gray-900/80 via-purple-900/60 to-pink-900/70 backdrop-blur-md border-2 border-purple-400/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/20">
              <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
                🚀 COMING SOON 🚀
              </h3>
              
              <div className="space-y-4">
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-200 mb-2">🎤 Voice Input System:</h4>
                  <div className="text-sm text-purple-300 space-y-1">
                    <div>• Speak math answers instead of typing</div>
                    <div>• Natural language processing</div>
                    <div>• Multi-language support</div>
                    <div>• Voice commands for power-ups</div>
                  </div>
                </div>
                
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-200 mb-2">🎮 More Features:</h4>
                  <div className="text-sm text-purple-300 space-y-1">
                    <div>• Multiplayer battles</div>
                    <div>• Custom problem sets</div>
                    <div>• Achievement system</div>
                    <div>• Leaderboards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 w-full max-w-6xl">
          {/* Controls Section */}
          <div className="bg-gradient-to-br from-gray-900/80 via-orange-900/60 to-red-900/70 backdrop-blur-md border-2 border-orange-400/30 rounded-2xl p-6 shadow-2xl shadow-orange-500/20">
            <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">🎮 GAME CONTROLS 🎮</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold min-w-24">0-9:</span>
                  <span className="text-orange-200">Type math answers</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold min-w-24">Backspace:</span>
                  <span className="text-orange-200">Delete last digit</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold min-w-24">Space:</span>
                  <span className="text-orange-200">Start game / Restart</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold min-w-24">ESC:</span>
                  <span className="text-orange-200">Return to menu</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold min-w-24">Arrow Keys:</span>
                  <span className="text-orange-200">Move rocket to collect power-ups</span>
                </div>
              </div>
            </div>
          </div>

          {/* Credits Section */}
          <div className="bg-gradient-to-br from-gray-900/80 via-indigo-900/60 to-purple-900/70 backdrop-blur-md border-2 border-indigo-400/30 rounded-2xl p-6 shadow-2xl shadow-indigo-500/20">
            <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">✨ CREDITS ✨</h3>
            <div className="space-y-4 text-center">
              <div className="bg-indigo-900/30 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-200 mb-2">⚡ Powered by</h4>
                <div className="text-lg font-bold text-indigo-100">Fluence</div>
              </div>
              
              <div className="bg-indigo-900/30 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-200 mb-2">👨‍💻 Created by</h4>
                <div className="text-lg font-bold text-indigo-100">Aman Raj Yadav</div>
              </div>
              
              <div className="bg-indigo-900/30 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-200 mb-2">🎮 Game Features</h4>
                <div className="text-sm text-indigo-300 space-y-1">
                  <div>• Dynamic difficulty scaling</div>
                  <div>• Power-ups system</div>
                  <div>• Multiple rocket types</div>
                  <div>• Personality-based math problems</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mt-8 px-12 py-4 bg-gradient-to-r from-blue-600/80 to-purple-600/80 border-2 border-blue-400/50 hover:border-blue-400/70 text-white hover:text-blue-50 font-bold text-xl rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-400/40 animate-pulse-glow backdrop-blur-sm"
        >
          🔙 BACK TO MENU
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
