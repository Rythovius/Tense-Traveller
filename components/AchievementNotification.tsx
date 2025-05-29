import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';

interface AchievementNotificationProps {
  achievement: Achievement | null;
}

const CheckBadgeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.746 3.746 0 0 1-5.334 0 3.746 3.746 0 0 1-5.334 0A3.746 3.746 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 5.334 0 3.746 3.746 0 0 1 5.334 0A3.746 3.746 0 0 1 21 12Z" />
</svg>
);


const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3800); // Notification visible for slightly less than the reset timer in App.tsx
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [achievement]);

  if (!achievement || !visible) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 bg-surface dark:bg-surfaceDark text-textPrimary dark:text-textPrimaryDark p-4 rounded-lg shadow-2xl border-l-4 border-accent dark:border-accentDark w-full max-w-sm sm:max-w-md z-[100] transition-all duration-500 ease-in-out transform"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
      }}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <span className="text-accent dark:text-accentDark text-3xl">{achievement.icon}</span>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-semibold text-accent dark:text-accentDark">
            Prestatie ontgrendeld!
          </p>
          <p className="text-base font-bold mt-0.5">
            {achievement.name}
          </p>
          <p className="text-xs text-textSecondary dark:text-textSecondaryDark mt-1">
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;