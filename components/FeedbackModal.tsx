
import React from 'react';
import { Feedback } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface FeedbackModalProps {
  feedback: Feedback | null;
  isLoadingExplanation: boolean;
  onClose: () => void;
  onNext: () => void;
  isLastExercise: boolean;
}

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);


const FeedbackModal: React.FC<FeedbackModalProps> = ({ feedback, isLoadingExplanation, onClose, onNext, isLastExercise }) => {
  // If not loading and no feedback data, don't render anything.
  // Allows the modal to render its shell for the spinner if isLoadingExplanation is true, even if feedback is null.
  if (!isLoadingExplanation && !feedback) return null;

  const { isCorrect, explanation, errorMessage, apiErrorOccurred } = feedback || {}; // Use default {} if feedback is null but loading

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-surface dark:bg-surfaceDark p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-pop-in">
        
        {isLoadingExplanation ? (
          <div className="my-6 text-center">
            <LoadingSpinner />
            <p className="text-textSecondary dark:text-textSecondaryDark mt-3">Fetching explanation...</p>
          </div>
        ) : feedback ? ( // Only render feedback content if feedback object exists and not loading
          <>
            <div className="flex items-center mb-4">
              {isCorrect ? (
                <CheckCircleIcon className="w-10 h-10 text-secondary dark:text-secondaryDark mr-3" />
              ) : (
                <XCircleIcon className="w-10 h-10 text-red-500 dark:text-red-400 mr-3" />
              )}
              <h2 className={`text-2xl font-bold ${isCorrect ? 'text-secondary dark:text-secondaryDark' : 'text-red-600 dark:text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Not Quite!'}
              </h2>
            </div>

            {errorMessage && !explanation ? ( 
              <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-4 my-4 rounded-md">
                <p className="font-bold">Error</p>
                <p>{errorMessage}</p>
              </div>
            ) : null}

            {apiErrorOccurred && explanation && (
                <div className="my-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-400/50 dark:border-yellow-500/50 rounded-md text-sm text-yellow-700 dark:text-yellow-300">
                    <p>Could not retrieve AI explanation. Showing standard explanation instead. If this persists, you can turn off AI explanations in the header.</p>
                </div>
            )}
            
            {explanation ? (
              <div className="my-4 p-4 bg-primary/10 dark:bg-primaryDark/10 border border-primary/30 dark:border-primaryDark/30 rounded-md max-h-80 overflow-y-auto">
                <h3 className="text-lg font-semibold text-primary dark:text-primaryDark mb-2">Explanation:</h3>
                <p className="text-textPrimary dark:text-textPrimaryDark whitespace-pre-wrap text-sm leading-relaxed">{explanation}</p>
              </div>
            ) : !errorMessage ? ( 
               <p className="text-textSecondary dark:text-textSecondaryDark my-4">No explanation available for this answer.</p>
            ) : null}
            
            <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-200 dark:bg-slate-600 text-textPrimary dark:text-textPrimaryDark rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition duration-200 font-medium"
                aria-label={isCorrect ? 'Close feedback modal' : 'Try exercise again'}
              >
                {isCorrect ? 'Close' : 'Try Again'}
              </button>
              {(isCorrect || (isLastExercise && !isCorrect )) && (
                 <button
                    onClick={onNext}
                    className="px-5 py-2.5 bg-primary dark:bg-primaryDark text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition duration-200 font-semibold"
                    aria-label={isLastExercise ? 'Finish quiz' : 'Go to next exercise'}
                 >
                   {isLastExercise ? 'Finish' : 'Next Exercise'}
                 </button>
              )}
            </div>
          </>
        ) : null} 
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
        `}
      </style>
    </div>
  );
};

export default FeedbackModal;
