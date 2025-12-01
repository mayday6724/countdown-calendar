import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: (desc: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (desc.trim().length > 0) {
      onComplete(desc);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fdfbf7]">
      <div className="max-w-lg w-full bg-white p-8 md:p-12 rounded-xl shadow-xl border border-stone-200 paper-texture">
        <div className="text-center mb-10">
          <div className="text-4xl mb-4">🦌</div>
          <h1 className="text-3xl md:text-4xl font-display text-[#1a4c33] mb-4">
            Xmas Whisper
          </h1>
          <p className="text-gray-600 font-serif leading-relaxed">
            ようこそ。ここはあなたのためのクリスマス・カレンダー。<br/>
            あなたについて少し教えてください。<br/>
            AIサンタが、毎日あなたへ特別な言葉を贈ります。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-widest text-[#8b0000] uppercase mb-2">
              About You
            </label>
            <textarea
              className="w-full h-32 p-4 bg-[#f8f8f8] border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4c33] focus:border-transparent outline-none transition-all font-serif resize-none text-gray-700"
              placeholder="Ex: I am a graphic designer striving to find my style. Sometimes I feel anxious about the future..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!desc.trim()}
            className="w-full py-4 bg-[#1a4c33] text-white font-display tracking-widest rounded-lg hover:bg-[#143a26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            START COUNTDOWN
          </button>
        </form>
        
        <p className="mt-6 text-center text-xs text-gray-400 font-jp">
          ※ 入力された情報は、カードの作成にのみ使用されます。
        </p>
      </div>
    </div>
  );
};

export default Onboarding;