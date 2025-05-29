import React from 'react';

interface AchievementIconProps {
  icon: string;
  unlocked: boolean;
  className?: string;
}

const AchievementIcon: React.FC<AchievementIconProps> = ({ icon, unlocked, className = "text-3xl md:text-4xl" }) => {
  return (
    <div className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-200 dark:bg-slate-700 ${!unlocked ? 'opacity-50 grayscale' : ''} transition-all duration-300`}>
      <span className={className} role="img" aria-label="achievement icon">{icon}</span>
    </div>
  );
};

export default AchievementIcon;