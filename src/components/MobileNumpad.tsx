import React from 'react';
import { useIsMobile } from '../hooks/use-mobile';

interface MobileNumpadProps {
  onKeyPress: (key: string) => void;
  currentInput: string;
}

const MobileNumpad: React.FC<MobileNumpadProps> = ({ onKeyPress, currentInput }) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const keys = [
    ['1', '2', '3', '4', '5'],
    ['6', '7', '8', '9', '0', '.', '⌫']
  ];

  const handleKeyPress = (key: string) => {
    if (key === '⌫') {
      onKeyPress('Backspace');
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="absolute bottom-2 left-2 right-2 z-50">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-xl p-2 border border-cyan-400/30 shadow-2xl shadow-cyan-400/20">
        {/* Current input display */}
        <div className="bg-slate-800/70 border border-slate-500/50 px-2 py-1 rounded-lg text-center mb-2">
          <span className="text-yellow-300 font-mono font-bold text-sm">
            {currentInput || '_'}
          </span>
        </div>
        
        {/* Horizontal numpad */}
        <div className="space-y-1">
          {keys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1 justify-center">
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`w-10 h-10 rounded-lg font-bold text-lg transition-all duration-200 transform active:scale-95 border ${
                    key === '⌫'
                      ? 'bg-red-600/80 hover:bg-red-500/80 text-white border-red-400/50 shadow-lg shadow-red-500/25'
                      : 'bg-gradient-to-br from-cyan-600/80 to-blue-600/80 hover:from-cyan-500/80 hover:to-blue-500/80 text-white border-cyan-400/50 shadow-lg shadow-cyan-500/25'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileNumpad;