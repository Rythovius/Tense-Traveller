import React from 'react';
import { Achievement } from '../types';
import AchievementItem from './AchievementItem';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
  isOpen: boolean;
}

const XMarkIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AchievementsModal: React.FC<AchievementsModalProps> = ({ achievements, onClose, isOpen }) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 flex items-center justify-center p-4 z-50 transition-opacity duration-300" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="achievements-title">
      <div 
        className="bg-surface dark:bg-surfaceDark p-5 sm:p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-xl md:max-w-2xl transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-pop-in max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 id="achievements-title" className="text-2xl sm:text-3xl font-bold text-primary dark:text-primaryDark">
            Trofeeënkast
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-textSecondary dark:text-textSecondaryDark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Sluit trofeeënkast"
          >
            <XMarkIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </div>

        <p className="mb-4 text-textSecondary dark:text-textSecondaryDark text-sm sm:text-base">
          Behaald: {unlockedCount} van de {totalCount} prestaties. Blijf oefenen om ze allemaal te ontgrendelen!
        </p>

        <div className="overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
          {achievements.length > 0 ? (
            achievements.map(ach => <AchievementItem key={ach.id} achievement={ach} />)
          ) : (
            <p className="text-textSecondary dark:text-textSecondaryDark py-4 text-center">Er zijn momenteel geen prestaties gedefinieerd.</p>
          )}
        </div>
        
        <div className="mt-6 sm:mt-8 text-right">
            <button
                onClick={onClose}
                className="px-5 py-2.5 bg-primary dark:bg-primaryDark text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition duration-200 font-semibold"
            >
                Sluiten
            </button>
        </div>
      </div>
      <style>
        {`
          @keyframes modal-pop-in {
            0% {
              opacity: 0;
              transform: scale(0.95) translateY(10px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .animate-modal-pop-in {
            animation: modal-pop-in 0.3s ease-out forwards;
          }
          /* Simple scrollbar styling for webkit browsers */
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #cbd5e1; /* slate-300 */
            border-radius: 3px;
          }
          .dark .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #475569; /* slate-600 */
          }
        `}
      </style>
    </div>
  );
};

export default AchievementsModal;