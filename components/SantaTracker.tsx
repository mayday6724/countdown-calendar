import React from 'react';

interface SantaTrackerProps {
  currentDay: number;
}

const SantaTracker: React.FC<SantaTrackerProps> = ({ currentDay }) => {
  // Cap at 25
  const day = Math.min(currentDay, 25);
  const percentage = Math.min(100, (day / 25) * 100);

  return (
    <div className="w-full max-w-md mx-auto mb-8 px-4">
      <div className="flex justify-between items-end mb-2">
        <h3 className="font-display text-[#1a4c33] text-sm tracking-wider font-bold">
          SANTA'S WORKSHOP
        </h3>
        <span className="font-mono text-xs text-[#8b0000]">
          {percentage.toFixed(0)}% READY
        </span>
      </div>
      
      <div className="relative h-3 bg-[#e5e5e5] rounded-full overflow-hidden shadow-inner">
        {/* Background Stripes */}
        <div className="absolute inset-0 opacity-20" 
             style={{
               backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)'
             }}
        ></div>
        
        {/* Progress Bar */}
        <div 
          className="h-full bg-gradient-to-r from-[#1a4c33] to-[#2d8a5b] transition-all duration-1000 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Sleigh Icon on the tip */}
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-lg leading-none filter drop-shadow-md">
            🛷
          </div>
        </div>
      </div>
      
      <div className="text-center mt-2">
        <p className="text-[10px] text-gray-500 font-jp tracking-widest">
          {day === 25 ? "配送完了！メリークリスマス！" : "プレゼント準備中..."}
        </p>
      </div>
    </div>
  );
};

export default SantaTracker;