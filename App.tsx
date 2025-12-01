import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import SantaTracker from './components/SantaTracker';
import Postcard from './components/Postcard';
import InstallPrompt from './components/InstallPrompt';
import { generateCardContent } from './services/geminiService';
import { AppState, CardContent } from './types';
import { useNotifications } from './hooks/useNotifications';

// Helper to get current day of December (Simulated for Demo flexibility)
// In a real app, this would be `new Date().getDate()` constrained to December.
const getInitialDay = () => {
    const now = new Date();
    if (now.getMonth() === 11) { // December (0-indexed)
        return Math.min(now.getDate(), 25);
    }
    // If not December, let's simulate it's December 10th for demo purposes
    return 5; 
};

const App: React.FC = () => {
  // 1. Initialize State from LocalStorage (Persistence)
  const [userDesc, setUserDesc] = useState<string>(() => {
    return localStorage.getItem('xmas_user_desc') || '';
  });

  const [appState, setAppState] = useState<AppState>(() => {
    // If we have a description saved, skip onboarding
    return localStorage.getItem('xmas_user_desc') ? AppState.CALENDAR : AppState.ONBOARDING;
  });

  const [cardHistory, setCardHistory] = useState<Record<number, CardContent>>(() => {
    try {
      const saved = localStorage.getItem('xmas_card_history');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to parse card history", e);
      return {};
    }
  });

  const [currentDay, setCurrentDay] = useState<number>(getInitialDay());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isLoadingCard, setIsLoadingCard] = useState<boolean>(false);

  // Notification Hook
  const { permission, requestPermission } = useNotifications();

  // 2. Save Card History whenever it changes
  useEffect(() => {
    localStorage.setItem('xmas_card_history', JSON.stringify(cardHistory));
  }, [cardHistory]);

  const handleOnboardingComplete = (desc: string) => {
    // Save to storage
    localStorage.setItem('xmas_user_desc', desc);
    setUserDesc(desc);
    setAppState(AppState.CALENDAR);
    
    // Optionally prompt for permission right after onboarding
    if (permission === 'default') {
       requestPermission();
    }
  };

  const handleResetProfile = () => {
    if (window.confirm("プロフィールをリセットしますか？ (これまでのカードは保持されます)")) {
      localStorage.removeItem('xmas_user_desc');
      setAppState(AppState.ONBOARDING);
      setUserDesc('');
    }
  };

  const openCard = async (day: number) => {
    if (day > currentDay) return; // Locked
    
    setSelectedDay(day);
    setAppState(AppState.VIEWING_CARD);

    // If we already have content, don't re-generate
    if (cardHistory[day]) {
      return;
    }

    setIsLoadingCard(true);
    try {
      const content = await generateCardContent(day, userDesc);
      setCardHistory(prev => ({ ...prev, [day]: content }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingCard(false);
    }
  };

  const closeCard = () => {
    setSelectedDay(null);
    setAppState(AppState.CALENDAR);
  };

  // Generate grid for days 1-25
  const daysGrid = Array.from({ length: 25 }, (_, i) => i + 1);

  if (appState === AppState.ONBOARDING) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#2c2c2c] overflow-x-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* PWA Install Prompt for iOS */}
      <InstallPrompt />

      {/* Texture Background */}
      <div className="fixed inset-0 paper-texture opacity-30 pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 pt-10 pb-6 text-center">
        {/* Notification Bell */}
        <div className="absolute top-4 right-4 md:right-8">
           <button 
             onClick={requestPermission}
             className={`p-2 rounded-full transition-all duration-300 ${permission === 'granted' ? 'text-gray-300 hover:text-[#1a4c33]' : 'text-[#8b0000] animate-pulse bg-red-50 hover:bg-red-100'}`}
             title={permission === 'granted' ? "通知は有効です (7:30 AM)" : "毎朝の通知を受け取る"}
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={permission === 'granted' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
             </svg>
             {permission !== 'granted' && (
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
             )}
           </button>
        </div>

        <div className="inline-block border-b-2 border-[#1a4c33] pb-2 mb-2">
           <h1 className="text-3xl font-display text-[#1a4c33]">DECEMBER</h1>
        </div>
        <p className="text-sm font-jp tracking-widest text-gray-500">
           あなたへのクリスマスカウントダウン
        </p>
      </header>

      {/* Tracker */}
      <div className="relative z-10">
        <SantaTracker currentDay={currentDay} />
      </div>

      {/* Calendar Grid */}
      <main className="relative z-10 max-w-4xl mx-auto p-4 pb-20">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {daysGrid.map((day) => {
            const isLocked = day > currentDay;
            const isToday = day === currentDay;
            const hasContent = !!cardHistory[day];

            return (
              <button
                key={day}
                onClick={() => openCard(day)}
                disabled={isLocked}
                className={`
                  relative aspect-[3/4] rounded-lg shadow-sm transition-all duration-300
                  flex flex-col items-center justify-center group
                  ${isLocked 
                    ? 'bg-gray-200 cursor-not-allowed opacity-50' 
                    : 'bg-white cursor-pointer hover:-translate-y-1 hover:shadow-md'
                  }
                  ${isToday && !isLocked ? 'ring-2 ring-[#8b0000] ring-offset-2' : ''}
                `}
              >
                {/* Visual decoration for card back */}
                {!isLocked && (
                  <div className="absolute inset-2 border border-gray-100 rounded flex items-center justify-center">
                      <div className="text-[#8b0000]/10 text-4xl font-display font-bold select-none">
                          {day}
                      </div>
                  </div>
                )}
                
                {/* Content Indicator (Stamp) */}
                {hasContent && (
                  <div className="absolute top-2 right-2 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Day Number */}
                <span className={`text-2xl font-display font-bold z-10 ${isLocked ? 'text-gray-400' : 'text-[#1a4c33]'}`}>
                  {day}
                </span>

                {/* Label */}
                <span className="text-[10px] uppercase tracking-widest mt-2 font-sans text-gray-500 z-10">
                  {isLocked ? 'LOCKED' : (hasContent ? 'OPENED' : 'OPEN')}
                </span>
                
                {/* Christmas Special Style */}
                {day === 25 && !isLocked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 to-transparent rounded-lg pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer / Reset Settings */}
      <footer className="relative z-10 text-center pb-10">
         <button 
           onClick={handleResetProfile}
           className="text-[10px] text-gray-400 font-jp tracking-widest border-b border-gray-300 hover:text-gray-600 pb-0.5"
         >
           プロフィール設定をリセット
         </button>
      </footer>

      {/* Card Modal */}
      {selectedDay !== null && (
        <Postcard 
          day={selectedDay}
          content={cardHistory[selectedDay] || null}
          loading={isLoadingCard}
          onClose={closeCard}
        />
      )}

      {/* Debug Control (Hidden in real app, useful for demo to test flow) */}
      <div className="fixed bottom-4 left-4 z-50 opacity-0 hover:opacity-100 transition-opacity bg-white p-2 text-xs border rounded shadow">
         Debug Day: 
         <input 
           type="number" 
           value={currentDay} 
           onChange={(e) => setCurrentDay(Number(e.target.value))}
           className="w-12 border ml-2"
           max={25}
           min={1}
         />
      </div>
    </div>
  );
};

export default App;