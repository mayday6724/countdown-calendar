import React, { useState, useEffect } from 'react';

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detect if iOS (iPhone/iPad)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // Detect if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    // Only show if iOS and NOT standalone
    if (isIOS && !isStandalone) {
      // Delay slightly so it doesn't appear instantly
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 bg-[#fdfbf7] border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] animate-slide-up">
      <div className="max-w-md mx-auto flex flex-col items-center text-center space-y-3">
        <div className="flex items-center space-x-3 mb-1">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3697/3697263.png" 
            alt="Icon" 
            className="w-10 h-10 rounded-lg shadow-sm" 
          />
          <div className="text-left">
            <h3 className="font-display font-bold text-[#1a4c33]">Install App</h3>
            <p className="text-xs text-gray-500 font-jp">ホーム画面に追加して通知を受け取る</p>
          </div>
          <button 
             onClick={() => setShowPrompt(false)}
             className="ml-auto text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <p className="text-sm text-gray-700 font-jp leading-relaxed">
           画面下の <span className="inline-block px-1"><svg className="w-5 h-5 inline text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></span> (シェア) をタップして、<br/>
           <span className="font-bold">「ホーム画面に追加」</span>を選択してください。
        </p>
      </div>
    </div>
  );
};

export default InstallPrompt;