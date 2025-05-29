
import React, { useEffect, useState, useCallback } from 'react';
import { Exercise } from '../types';

// Icons
const SpeakerWaveIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 17.648a10.523 10.523 0 0 0-1.138-1.904c-.064-.07-.132-.136-.204-.204-.752-.752-1.628-1.364-2.586-1.846A10.495 10.495 0 0 0 12 13.5c-.838 0-1.648.12-2.422.348-.958.482-1.834 1.094-2.586 1.846-.072.068-.14.134-.204.204a10.523 10.523 0 0 0-1.138 1.904M12 21a8.997 8.997 0 0 1-7.071-15.071A8.997 8.997 0 0 1 12 3a8.997 8.997 0 0 1 7.071 2.929A8.997 8.997 0 0 1 12 21Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.75.75 0 0 1 0 1.061l-3.182 3.182a.75.75 0 0 1-1.061 0l-3.182-3.182a.75.75 0 1 1 1.061-1.061L12 12.268l2.849-2.849a.75.75 0 0 1 1.061 0Z" />
  </svg>
);


const StopCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.254 9.254 9 9.563 9h4.874c.309 0 .563.254.563.563v4.874c0 .309-.254.563-.563.563H9.563C9.254 15 9 14.746 9 14.437V9.564Z" />
  </svg>
);


interface ExerciseDisplayProps {
  exercise: Exercise;
  onSubmit: (answer: string) => void;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  instructionText: string;
  onSpeakInitiated: () => void; // Callback for when speech is initiated
}

const ExerciseDisplay: React.FC<ExerciseDisplayProps> = ({ exercise, onSubmit, userAnswer, setUserAnswer, instructionText, onSpeakInitiated }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setUserAnswer('');
    // Cancel any ongoing speech when the exercise changes
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [exercise, setUserAnswer]);

  // Cleanup speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, []);

  const handleSpeak = useCallback(() => {
    if (!exercise || typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn("Speech synthesis not available or exercise not loaded.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      // setIsSpeaking(false); // onend or onerror should handle this.
      return;
    }

    onSpeakInitiated(); // Notify App component that speech was initiated for achievement tracking

    const placeholder = "blank"; // Word to say for the blank
    const textToSpeak = `${exercise.sentenceTemplate.replace(/______\s*\({verb}\)/, placeholder)}. Verb to use: ${exercise.verb}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US'; // Ensure English pronunciation
    utterance.pitch = 1;
    utterance.rate = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      // Common non-error reasons for speech stopping are 'interrupted' or 'canceled' by user/app actions.
      // We only want to log actual unexpected errors.
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error(`Speech synthesis utterance error: ${event.error}`);
      }
      setIsSpeaking(false); // Always reset speaking state on any error/end.
    };
    
    window.speechSynthesis.speak(utterance);
  }, [exercise, isSpeaking, onSpeakInitiated]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.speechSynthesis && isSpeaking) {
        window.speechSynthesis.cancel(); // Stop speech on submit
        setIsSpeaking(false);
    }
    if (userAnswer.trim()) {
      onSubmit(userAnswer.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      if (typeof window !== 'undefined' && window.speechSynthesis && isSpeaking) {
        window.speechSynthesis.cancel(); // Stop speech on submit
        setIsSpeaking(false);
      }
      if (userAnswer.trim()) {
        onSubmit(userAnswer.trim());
      }
    }
  };

  const sentenceParts = exercise.sentenceTemplate.split(/______\s*\({verb}\)/);

  return (
    <div className="bg-surface dark:bg-surfaceDark p-6 md:p-8 rounded-xl shadow-xl w-full max-w-2xl transition-colors duration-300">
      <p className="text-sm text-primary dark:text-primaryDark font-semibold mb-3">
        {instructionText}
      </p>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex items-center gap-x-2 sm:gap-x-3">
            <div className="text-xl md:text-2xl text-textPrimary dark:text-textPrimaryDark leading-relaxed flex flex-wrap items-center gap-y-2 flex-grow">
            <span>{sentenceParts[0]}</span>
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={exercise.verb}
                className="mx-2 px-3 py-2 border-b-2 border-primary dark:border-primaryDark focus:border-accent dark:focus:border-accentDark outline-none text-xl md:text-2xl text-center font-medium text-accent dark:text-accentDark min-w-[100px] sm:min-w-[120px] max-w-[280px] flex-grow bg-transparent transition-colors duration-300"
                aria-label={`Verb input for ${exercise.verb}`}
                autoFocus
            />
            <span>{sentenceParts[1]}</span>
            </div>
            <button
                type="button"
                onClick={handleSpeak}
                className="p-2 rounded-full text-textSecondary dark:text-textSecondaryDark hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primaryDark transition-colors duration-200"
                aria-label={isSpeaking ? "Stop speaking" : "Speak exercise sentence"}
                title={isSpeaking ? "Stop speaking" : "Speak exercise sentence"}
            >
                {isSpeaking ? <StopCircleIcon className="w-6 h-6 sm:w-7 sm:h-7 text-accent dark:text-accentDark" /> : <SpeakerWaveIcon className="w-6 h-6 sm:w-7 sm:h-7" />}
            </button>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-accent dark:bg-accentDark text-white font-semibold rounded-lg hover:bg-orange-700 dark:hover:bg-orange-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent/50 dark:focus:ring-accentDark/50 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-95"
            disabled={!userAnswer.trim()}
          >
            Check Answer
          </button>
        </div>
      </form>
      <div className="mt-6 text-xs text-textSecondary dark:text-textSecondaryDark">
        <p><strong>Hint:</strong> Pay attention to keywords like "<em>{exercise.keywordHint}</em>".</p>
      </div>
    </div>
  );
};

export default ExerciseDisplay;