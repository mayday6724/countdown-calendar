import React, { useState } from 'react';
import { CardContent } from '../types';

interface PostcardProps {
  content: CardContent | null;
  day: number;
  loading: boolean;
  onClose: () => void;
}

const Postcard: React.FC<PostcardProps> = ({ content, day, loading, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Auto flip when content loads
  React.useEffect(() => {
    if (content && !loading) {
      const timer = setTimeout(() => setIsFlipped(true), 600);
      return () => clearTimeout(timer);
    }
  }, [content, loading]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      {/* Container for 3D space */}
      <div className="relative w-full max-w-[380px] aspect-[3/4] perspective-1000 group">
        
        {/* The Card Itself */}
        <div 
          className={`relative w-full h-full duration-1000 preserve-3d transition-transform ease-in-out cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => !loading && setIsFlipped(!isFlipped)}
        >
          
          {/* FRONT SIDE (Envelope/Closed) */}
          <div className="absolute inset-0 backface-hidden rounded-sm overflow-hidden bg-[#f4f1ea] border border-[#e0dcd0]">
            {/* Hard Card Thickness Simulation (Shadows) */}
            <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8),inset_0_0_20px_rgba(0,0,0,0.05)]"></div>
             
             {/* Paper Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none paper-texture z-10 opacity-60 mix-blend-multiply" />
            
            <div className="h-full w-full flex flex-col items-center justify-center p-8 relative z-20">
              
               {/* Decorative Lines */}
               <div className="absolute top-4 bottom-4 left-4 right-4 border border-[#8b0000]/10 pointer-events-none"></div>
               <div className="absolute top-5 bottom-5 left-5 right-5 border border-[#8b0000]/10 pointer-events-none"></div>

               {/* Stamp */}
              <div className="absolute top-8 right-8 w-20 h-24 border-4 border-double border-[#8b0000]/30 flex items-center justify-center transform rotate-6 bg-[#fffdf5] shadow-sm">
                 <div className="text-center opacity-80">
                    <span className="block text-[10px] font-display text-[#8b0000] tracking-widest">DEC</span>
                    <span className="block text-3xl font-bold font-display text-[#8b0000]">{day}</span>
                 </div>
              </div>

              <div className="text-center mt-10">
                <p className="font-display text-xs tracking-[0.3em] text-[#8b0000] mb-4">ADVENT CALENDAR</p>
                <h2 className="text-7xl font-display text-[#1a4c33] mb-6 drop-shadow-sm opacity-90">{day}</h2>
                <div className="w-8 h-1 bg-[#8b0000]/20 mx-auto mb-8"></div>
                
                <p className="text-sm font-jp tracking-widest text-gray-500 bg-white/50 px-4 py-1 inline-block rounded-full">
                   {loading ? "手紙を書いています..." : "お手紙が届きました"}
                </p>
              </div>

               {loading && (
                 <div className="absolute bottom-12 left-0 right-0 flex justify-center">
                    <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-[#1a4c33] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-[#1a4c33] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-[#1a4c33] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* BACK SIDE (Actual Content) */}
          <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-sm overflow-hidden bg-[#fffdf9]">
            {/* Hard Card Thickness (Right side shadow for depth when flipped) */}
            <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-black/10 z-50"></div>
            
            {/* Fine Paper Texture */}
            <div className="absolute inset-0 pointer-events-none paper-texture z-30 opacity-40 mix-blend-multiply" />
            
            {content && (
              <div className="h-full w-full flex flex-col relative z-20">
                {/* Photo Area - Takes up more space for impact */}
                <div className="h-[60%] w-full relative overflow-hidden">
                   {/* White border frame inside the photo area for magazine look */}
                   <div className="absolute inset-3 border-[0.5px] border-white/30 z-10 pointer-events-none"></div>
                  <img 
                    src={content.imageUrl} 
                    alt="Atmospheric Christmas" 
                    className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-105"
                  />
                  {/* Subtle gradient overlay for text readability at intersection */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#fffdf9] to-transparent"></div>
                </div>

                {/* Text Area */}
                <div className="h-[40%] px-8 py-6 flex flex-col justify-between text-[#2c2c2c]">
                  <div className="flex-1 flex flex-col justify-center space-y-4">
                    {/* Japanese Text - Vertical rhythm */}
                    <p className="font-jp text-sm leading-relaxed tracking-widest text-gray-800 text-justify">
                      {content.quoteJp}
                    </p>
                    {/* Chinese Text */}
                    <p className="text-base font-serif leading-relaxed text-gray-600 font-normal tracking-wide">
                      {content.quoteZh}
                    </p>
                  </div>

                  <div className="text-right mt-2 border-t border-[#8b0000]/10 pt-3">
                    <p className="text-[10px] font-display tracking-[0.2em] text-gray-400 uppercase mb-1">
                      {content.workTitle}
                    </p>
                    <p className="text-sm font-jp text-[#8b0000]">
                      {content.source}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Postcard;