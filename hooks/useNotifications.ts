import { useEffect, useState, useCallback } from 'react';

const NOTIFICATION_MESSAGES = [
  "🎄✨ おはようございます。今日の素敵な言葉が届いていますよ。",
  "🎅🎁 サンタさんの準備が進んでいます。あなたのカードも到着しました。",
  "❄️☃️ 寒い朝ですね。心温まるメッセージを読んでみませんか？",
  "🕯️🌟 7時30分のお知らせです。新しい扉を開く時間ですよ。",
  "🦌🔔 リンリン！トナカイが今日のカードを運んできました。",
  "🍪🥛 クリスマスの足音が聞こえてきます。今日の一枚をどうぞ。",
  "🎁🧣 あなたへの特別なメッセージがポストに入っています。",
  "⭐👼 聖なる季節の輝きを、今日のカードから感じてください。",
  "🎼🎹 静かな朝に、あなたへの励ましの言葉を贈ります。",
  "🎄🕯️ 今日も一日頑張るあなたへ。サンタからの応援メッセージです。"
];

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    Notification.permission
  );

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      new Notification("🎄 Xmas Whisper", {
        body: "通知設定が完了しました。毎朝7:30にお届けします。",
        icon: "/favicon.ico" 
      });
    }
  }, []);

  useEffect(() => {
    if (permission !== 'granted') return;

    const checkAndNotify = () => {
      const now = new Date();
      const todayStr = now.toDateString(); // e.g. "Fri Dec 01 2023"
      
      // Check if already notified today
      const lastNotified = localStorage.getItem('xmas_last_notification');
      if (lastNotified === todayStr) return;

      // Logic: 
      // 1. Is it 7:30 AM or later?
      // 2. Is it currently December? (Optional, but fits the app theme)
      // Note: We allow it anytime after 7:30 to ensure if user opens app at 8:00, they get the "morning delivery" feel.
      const hours = now.getHours();
      const minutes = now.getMinutes();

      const isAfterSevenThirty = (hours === 7 && minutes >= 30) || hours > 7;
      
      if (isAfterSevenThirty) {
        // Select message based on the day of the month to be deterministic but varied
        const day = now.getDate();
        const messageIndex = day % NOTIFICATION_MESSAGES.length;
        const message = NOTIFICATION_MESSAGES[messageIndex];

        // Send Notification
        new Notification("Xmas Whisper Calendar", {
          body: message,
          icon: "https://cdn-icons-png.flaticon.com/512/3697/3697263.png" // Generic pleasant icon fallback
        });

        // Mark as done for today
        localStorage.setItem('xmas_last_notification', todayStr);
      }
    };

    // Check immediately on mount (in case user opens app at 8am)
    checkAndNotify();

    // Check every minute (in case user keeps tab open overnight)
    const interval = setInterval(checkAndNotify, 60000);

    return () => clearInterval(interval);
  }, [permission]);

  return { permission, requestPermission };
};
