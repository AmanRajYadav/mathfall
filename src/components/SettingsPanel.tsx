
import React, { useState } from 'react';

interface SettingsPanelProps {
  onBack: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onBack }) => {
  const [volume, setVolume] = useState(50);
  const [effects, setEffects] = useState(true);

  return (
    <div className="text-center text-cyan-400 max-w-lg mx-auto">
      <h1 className="text-4xl font-bold mb-8">SETTINGS</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-xl font-bold mb-3">Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-sm text-gray-400 mt-1">{volume}%</div>
          </div>
          
          <div>
            <label className="flex items-center justify-between text-xl font-bold">
              Visual Effects
              <input
                type="checkbox"
                checked={effects}
                onChange={(e) => setEffects(e.target.checked)}
                className="w-6 h-6 ml-4"
              />
            </label>
            <div className="text-sm text-gray-400 mt-1">Particle effects and animations</div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-2xl font-bold mb-4">CONTROLS</h3>
        <div className="text-left space-y-2">
          <div><span className="text-yellow-400">Numbers (0-9):</span> Type answers</div>
          <div><span className="text-yellow-400">Backspace:</span> Delete last digit</div>
          <div><span className="text-yellow-400">Space:</span> Start game / Restart</div>
          <div><span className="text-yellow-400">P:</span> Pause game</div>
        </div>
      </div>
      
      <button
        onClick={onBack}
        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-xl font-bold transition-colors"
      >
        BACK TO MENU
      </button>
    </div>
  );
};

export default SettingsPanel;
