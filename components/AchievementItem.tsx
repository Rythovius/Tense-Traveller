import React from 'react';
import { Achievement } from '../types';
import AchievementIcon from './AchievementIcon';

interface AchievementItemProps {
  achievement: Achievement;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
  return (
    <div 
      className={`p-4 rounded-lg flex items-start space-x-4 transition-all duration-300
                  ${achievement.unlocked 
                    ? 'bg-green-50 dark:bg-green-900/50 border border-green-500/50' 
                    : 'bg-surface dark:bg-surfaceDark border border-borderLight dark:border-borderDark'}`}
      role="listitem"
      aria-label={`${achievement.name}: ${achievement.description}. Status: ${achievement.unlocked ? 'Unlocked' : 'Locked'}`}
    >
      <AchievementIcon icon={achievement.icon} unlocked={achievement.unlocked} />
      <div className="flex-1">
        <h3 className={`font-semibold text-lg ${achievement.unlocked ? 'text-green-700 dark:text-green-300' : 'text-textPrimary dark:text-textPrimaryDark'}`}>
          {achievement.name}
        </h3>
        <p className={`text-sm ${achievement.unlocked ? 'text-green-600 dark:text-green-400' : 'text-textSecondary dark:text-textSecondaryDark'}`}>
          {achievement.description}
        </p>
        {!achievement.unlocked && (
          <span className="mt-1 inline-block px-2 py-0.5 text-xs font-medium bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full">
            Vergrendeld
          </span>
        )}
      </div>
    </div>
  );
};

export default AchievementItem;