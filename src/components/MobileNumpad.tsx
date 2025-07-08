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
    ['1', '2'],
    ['3', '4'],
    ['5', '6'],
    ['7', '8'],
    ['9', '0'],
    ['.', '⌫']
  ];

  const handleKeyPress = (key: string) => {
    if (key === '⌫') {
      onKeyPress('Backspace');
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-cyan-400/30 shadow-2xl shadow-cyan-400/20">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {keys.map((row, rowIndex) => 
            row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`w-12 h-12 rounded-xl font-bold text-lg transition-all duration-200 transform active:scale-95 border ${
                  key === '⌫'
                    ? 'bg-red-600/80 hover:bg-red-500/80 text-white border-red-400/50 shadow-lg shadow-red-500/25'
                    : 'bg-gradient-to-br from-cyan-600/80 to-blue-600/80 hover:from-cyan-500/80 hover:to-blue-500/80 text-white border-cyan-400/50 shadow-lg shadow-cyan-500/25'
                }`}
              >
                {key}
              </button>
            ))
          )}
        </div>
        
        {/* Current input display */}
        <div className="bg-slate-800/70 border border-slate-500/50 px-4 py-2 rounded-lg text-center">
          <span className="text-yellow-300 font-mono font-bold">
            {currentInput || '_'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileNumpad;