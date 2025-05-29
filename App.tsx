
import React, { useState, useEffect, useCallback } from 'react';
import { Exercise, Feedback as FeedbackType, ExplanationLanguage, AppMode, Achievement, AchievementsState, AchievementId, AchievementStats } from './types';
import { PAST_SIMPLE_PRESENT_PERFECT_EXERCISES, MIXED_TENSES_EXERCISES, PAST_SIMPLE_PAST_CONTINUOUS_EXERCISES } from './constants';
import { initialAchievementsState, initialAchievementsList } from './achievementsData';
import ExerciseDisplay from './components/ExerciseDisplay';
import FeedbackModal from './components/FeedbackModal';
import AchievementsModal from './components/AchievementsModal';
import AchievementNotification from './components/AchievementNotification'; // Import notification component
import { getExplanationFromGemini, getExplanationPlaceholder } from './services/geminiService';

// Icons (existing icons remain the same)
const SunIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591" />
  </svg>
);
const MoonIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);
const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75l-1.25-1.75L14 12.25l1.25.5L16 14.25l.75-1.25L18.25 12z" />
  </svg>
);
const AcademicCapIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
</svg>
);
const TrophyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-4.5A3.375 3.375 0 0 0 12.75 9.75H11.25A3.375 3.375 0 0 0 7.5 13.125V18.75m9 0h1.5a2.25 2.25 0 1 0 0-4.5h-1.5m-9 0H6a2.25 2.25 0 1 0 0 4.5h1.5M12 9.75V7.5m0 2.25A3.375 3.375 0 0 0 9.75 6.375a3.375 3.375 0 0 0-3.375 3.375M12 9.75A3.375 3.375 0 0 1 14.25 6.375a3.375 3.375 0 0 1 3.375 3.375" />
  </svg>
);

const initialAchievementStats: AchievementStats = {
  totalCorrectAnswersGlobal: 0,
  currentCorrectStreakGlobal: 0,
  maxCorrectStreakGlobal: 0,
  speakFunctionUses: 0,
  successfulApiExplanations: 0,
  usedLanguages: new Set(),
  usedThemes: new Set(),
  playedModes: new Set(),
  quizCompletionsPerMode: { simple_perfect: 0, mixed_tenses: 0, past_simple_continuous: 0 },
  highScoresPerMode: { simple_perfect: 0, mixed_tenses: 0, past_simple_continuous: 0 },
  perfectScoresPerMode: { simple_perfect: 0, mixed_tenses: 0, past_simple_continuous: 0 },
  lastAnswerTimestamp: 0,
  quickCorrectStreak: 0,
  exerciseAttemptState: {},
};


const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('simple_perfect');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [score, setScore] = useState(0); // Score for the current quiz session
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [explanationLanguage, setExplanationLanguage] = useState<ExplanationLanguage>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('explanationLanguage') as ExplanationLanguage) || 'en';
    }
    return 'en';
  });
  
  const [useApiForExplanation, setUseApiForExplanation] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedApiPref = localStorage.getItem('useApiForExplanation');
      return savedApiPref === null ? true : savedApiPref === 'true';
    }
    return true;
  });

  // Achievements State
  const [achievements, setAchievements] = useState<AchievementsState>(() => {
    const storedAchievements = localStorage.getItem('tenseTravellerAchievements');
    if (storedAchievements) {
      try {
        const parsedStored = JSON.parse(storedAchievements) as AchievementsState;
        const currentAchievements = { ...initialAchievementsState }; 
        Object.keys(currentAchievements).forEach(idKey => { 
            const id = idKey as AchievementId;
            if (parsedStored[id]) { 
                currentAchievements[id] = { ...initialAchievementsState[id], unlocked: parsedStored[id].unlocked };
            } else { 
                currentAchievements[id] = { ...initialAchievementsState[id]};
            }
        });
        return currentAchievements;
      } catch (e) {
        console.error("Failed to parse achievements from localStorage", e);
      }
    }
    return { ...initialAchievementsState }; 
  });

  const [achievementStats, setAchievementStats] = useState<AchievementStats>(() => {
    const storedStats = localStorage.getItem('tenseTravellerAchievementStats');
    if (storedStats) {
        try {
            const parsed = JSON.parse(storedStats);
            // Ensure exerciseAttemptState is an object, even if it was empty or undefined in storage
            const validExerciseAttemptState = typeof parsed.exerciseAttemptState === 'object' && parsed.exerciseAttemptState !== null 
                                              ? parsed.exerciseAttemptState 
                                              : {};
            return {
                ...initialAchievementStats, 
                ...parsed, 
                usedLanguages: new Set(parsed.usedLanguages || []),
                usedThemes: new Set(parsed.usedThemes || []),
                playedModes: new Set(parsed.playedModes || []),
                exerciseAttemptState: validExerciseAttemptState,
            };
        } catch (e) {
            console.error("Failed to parse achievement stats, resetting.", e);
        }
    }
    return initialAchievementStats;
  });

  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [recentlyUnlockedAchievement, setRecentlyUnlockedAchievement] = useState<Achievement | null>(null);
  const [answeredCorrectlyFlags, setAnsweredCorrectlyFlags] = useState<boolean[]>(() => Array(exercises.length).fill(false));


  // --- Achievement Logic ---
  const unlockAchievement = useCallback((id: AchievementId) => {
    if (!achievements[id]?.unlocked) {
      const unlockedAch = { ...achievements[id], unlocked: true };
      setAchievements(prev => ({ ...prev, [id]: unlockedAch }));
      setRecentlyUnlockedAchievement(unlockedAch);
      setTimeout(() => setRecentlyUnlockedAchievement(null), 4000); // Notification display time
    }
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('tenseTravellerAchievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    // Custom serializer for Sets in achievementStats
    const statsToStore = {
        ...achievementStats,
        usedLanguages: Array.from(achievementStats.usedLanguages),
        usedThemes: Array.from(achievementStats.usedThemes),
        playedModes: Array.from(achievementStats.playedModes),
    };
    localStorage.setItem('tenseTravellerAchievementStats', JSON.stringify(statsToStore));
  }, [achievementStats]);


  // Shuffle and reset quiz
  const shuffleArray = useCallback((array: Exercise[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  useEffect(() => {
    let selectedExercises: Exercise[] = [];
    if (currentMode === 'simple_perfect') {
      selectedExercises = PAST_SIMPLE_PRESENT_PERFECT_EXERCISES;
    } else if (currentMode === 'mixed_tenses') {
      selectedExercises = MIXED_TENSES_EXERCISES;
    } else if (currentMode === 'past_simple_continuous') {
      selectedExercises = PAST_SIMPLE_PAST_CONTINUOUS_EXERCISES;
    }
    setExercises(shuffleArray(selectedExercises));
    setCurrentExerciseIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setShowFeedbackModal(false);
    setScore(0);
    setQuizCompleted(false);
    setAnsweredCorrectlyFlags(Array(selectedExercises.length).fill(false));
    setAchievementStats(prev => ({
      ...prev,
      exerciseAttemptState: {}, 
      lastAnswerTimestamp: Date.now(), 
      quickCorrectStreak: 0,
    }));
  }, [currentMode, shuffleArray]);
  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(isDarkMode));
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('explanationLanguage', explanationLanguage);
    }
  }, [explanationLanguage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('useApiForExplanation', String(useApiForExplanation));
    }
  }, [useApiForExplanation]);


  const currentExercise = exercises[currentExerciseIndex];

  const handleCheckAnswer = useCallback(async (answer: string) => {
    if (!currentExercise) return;

    setIsLoadingExplanation(true);
    setShowFeedbackModal(true);
    const submissionTime = Date.now();

    const isCorrect = answer.trim().toLowerCase() === currentExercise.correctAnswer.toLowerCase();
    
    let newStats = { ...achievementStats };
    const exerciseKey = currentExercise.id; 

    if (isCorrect) {
      if (!answeredCorrectlyFlags[currentExerciseIndex]) {
        setScore(prev => prev + 1);
        setAnsweredCorrectlyFlags(prevFlags => {
            const newFlags = [...prevFlags];
            newFlags[currentExerciseIndex] = true;
            return newFlags;
        });
      }

      newStats.totalCorrectAnswersGlobal = (newStats.totalCorrectAnswersGlobal || 0) + 1;
      newStats.currentCorrectStreakGlobal = (newStats.currentCorrectStreakGlobal || 0) + 1;
      if (newStats.currentCorrectStreakGlobal > (newStats.maxCorrectStreakGlobal || 0) ) {
        newStats.maxCorrectStreakGlobal = newStats.currentCorrectStreakGlobal;
      }
      unlockAchievement('FIRST_STEP');

      if (newStats.currentCorrectStreakGlobal >= 5) unlockAchievement('STREAK_BRONZE');
      if (newStats.currentCorrectStreakGlobal >= 10) unlockAchievement('STREAK_SILVER');
      if (newStats.currentCorrectStreakGlobal >= 20) unlockAchievement('STREAK_GOLD');
      
      if (newStats.exerciseAttemptState[exerciseKey]?.previouslyIncorrect) {
        unlockAchievement('COMEBACK_KID');
      }
      newStats.exerciseAttemptState[exerciseKey] = { previouslyIncorrect: false };


      const timeTaken = submissionTime - newStats.lastAnswerTimestamp;
      if (timeTaken < 10000) { 
        newStats.quickCorrectStreak = (newStats.quickCorrectStreak || 0) + 1;
        if (newStats.quickCorrectStreak >= 5) {
          unlockAchievement('QUICK_LEARNER');
        }
      } else {
        newStats.quickCorrectStreak = 0;
      }

    } else { // Incorrect answer
      newStats.currentCorrectStreakGlobal = 0;
      newStats.quickCorrectStreak = 0;

      // BARE_BONES achievement
      const userAnswerLower = answer.trim().toLowerCase();
      const correctAnswerLower = currentExercise.correctAnswer.toLowerCase();
      const mainVerbPart = correctAnswerLower.split(' ').pop();

      if (mainVerbPart && userAnswerLower === mainVerbPart) {
        if (currentExercise.tense === 'Present Perfect' && (correctAnswerLower.includes("have") || correctAnswerLower.includes("has"))) {
            unlockAchievement('BARE_BONES');
        } else if (currentExercise.tense === 'Past Continuous' && (correctAnswerLower.includes("was") || correctAnswerLower.includes("were"))) {
            unlockAchievement('BARE_BONES');
        }
      }
      
      // DEJA_WRONG achievement
      const previousAttempt = newStats.exerciseAttemptState[exerciseKey];
      if (previousAttempt?.previouslyIncorrect && previousAttempt?.lastIncorrectAnswer === answer.trim()) {
        unlockAchievement('DEJA_WRONG');
      }
      newStats.exerciseAttemptState[exerciseKey] = { previouslyIncorrect: true, lastIncorrectAnswer: answer.trim() };
    }
    newStats.lastAnswerTimestamp = submissionTime;

    const currentHour = new Date().getHours();
    if (currentHour >= 20 && currentHour < 22) unlockAchievement('NIGHT_OWL'); 
    if (currentHour >= 7 && currentHour < 9) unlockAchievement('EARLY_BIRD');  

    if (isCorrect) {
        const currentTheme = isDarkMode ? 'dark' : 'light';
        const updatedThemes = new Set(newStats.usedThemes).add(currentTheme);
        newStats.usedThemes = updatedThemes;
        if (newStats.usedThemes.has('light') && newStats.usedThemes.has('dark')) {
            unlockAchievement('STYLE_SWITCHER');
        }
    }
    const updatedPlayedModes = new Set(newStats.playedModes).add(currentMode);
    newStats.playedModes = updatedPlayedModes;
    if (newStats.playedModes.size >= 3) { 
        unlockAchievement('MODE_HOPPER');
    }


    let explanationText: string | null = null;
    let errorMsg: string | undefined = undefined;
    let apiErrorOccurred = false;

    if (useApiForExplanation) {
      try {
        explanationText = await getExplanationFromGemini(currentExercise, answer, explanationLanguage, currentMode);
        newStats.successfulApiExplanations = (newStats.successfulApiExplanations || 0) + 1;
        if (newStats.successfulApiExplanations >= 10) unlockAchievement('AI_ADEPT');
      } catch (error) {
        console.error("Error getting AI explanation:", error);
        apiErrorOccurred = true;
        errorMsg = error instanceof Error ? error.message : "Failed to fetch AI explanation.";
        try {
            explanationText = await getExplanationPlaceholder(currentExercise, answer, explanationLanguage, currentMode);
        } catch (placeholderError) {
            console.error("Error getting placeholder explanation after API fail:", placeholderError);
            explanationText = explanationLanguage === 'nl' ? "Kon geen uitleg ophalen." : "Could not retrieve explanation.";
        }
      }
    } else {
      try {
        explanationText = await getExplanationPlaceholder(currentExercise, answer, explanationLanguage, currentMode);
      } catch (error) {
         console.error("Error getting placeholder explanation:", error);
         explanationText = explanationLanguage === 'nl' ? "Kon geen standaarduitleg ophalen." : "Could not retrieve standard explanation.";
         errorMsg = error instanceof Error ? error.message : "Failed to fetch placeholder explanation.";
      }
    }

    const updatedUsedLanguages = new Set(newStats.usedLanguages).add(explanationLanguage);
    newStats.usedLanguages = updatedUsedLanguages;
    if (newStats.usedLanguages.has('en') && newStats.usedLanguages.has('nl')) {
        unlockAchievement('LANGUAGE_EXPLORER');
    }
    
    setAchievementStats(newStats); 

    const elapsedTime = Date.now() - submissionTime;
    const minSpinnerTime = 300; 

    if (elapsedTime < minSpinnerTime) {
      await new Promise(resolve => setTimeout(resolve, minSpinnerTime - elapsedTime));
    }

    setFeedback({ isCorrect, explanation: explanationText, errorMessage: errorMsg, apiErrorOccurred });
    setIsLoadingExplanation(false);

  }, [currentExercise, explanationLanguage, currentExerciseIndex, answeredCorrectlyFlags, currentMode, useApiForExplanation, exercises, achievements, achievementStats, unlockAchievement, isDarkMode]);

  const handleSubmit = (answer: string) => {
    // setUserAnswer(answer);  // User answer is already set by ExerciseDisplay's onChange
    handleCheckAnswer(answer);
  };

  const handleNextExercise = () => {
    setShowFeedbackModal(false);
    setTimeout(() => {
        setFeedback(null); 
    }, 300);
    setUserAnswer(''); 

    const isLast = currentExerciseIndex === exercises.length - 1;

    if (isLast) {
      setQuizCompleted(true);
      let newStats = { ...achievementStats };
      newStats.quizCompletionsPerMode[currentMode] = (newStats.quizCompletionsPerMode[currentMode] || 0) + 1;
      
      if (currentMode === 'simple_perfect') unlockAchievement('COMPLETE_SIMPLE_PERFECT');
      else if (currentMode === 'mixed_tenses') unlockAchievement('COMPLETE_MIXED_TENSES');
      else if (currentMode === 'past_simple_continuous') unlockAchievement('COMPLETE_PAST_SIMPLE_CONTINUOUS');

      const percentageScore = (score / exercises.length) * 100;
      if (percentageScore > (newStats.highScoresPerMode[currentMode] || 0)) {
        newStats.highScoresPerMode[currentMode] = percentageScore;
      }
      if (percentageScore >= 90) {
        if (currentMode === 'simple_perfect') unlockAchievement('SCORE_TOPPER_SIMPLE_PERFECT');
        else if (currentMode === 'mixed_tenses') unlockAchievement('SCORE_TOPPER_MIXED_TENSES');
        else if (currentMode === 'past_simple_continuous') unlockAchievement('SCORE_TOPPER_PAST_SIMPLE_CONTINUOUS');
      }

      if (score === exercises.length) { 
        newStats.perfectScoresPerMode[currentMode] = (newStats.perfectScoresPerMode[currentMode] || 0) + 1;
        if (currentMode === 'simple_perfect') unlockAchievement('MASTER_SIMPLE_PERFECT');
        else if (currentMode === 'mixed_tenses') unlockAchievement('MASTER_MIXED_TENSES');
        else if (currentMode === 'past_simple_continuous') unlockAchievement('MASTER_PAST_SIMPLE_CONTINUOUS');
      }

      // PERFECTLY_IMPERFECT
      if (score === 0) {
        unlockAchievement('PERFECTLY_IMPERFECT');
      }
      
      if (!useApiForExplanation) {
          unlockAchievement('CLASSIC_CONNOISSEUR');
      }
      setAchievementStats(newStats);

    } else {
      setCurrentExerciseIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleCloseModal = () => {
    if (feedback?.isCorrect && !isLoadingExplanation) { 
        handleNextExercise();
    } else { 
        setShowFeedbackModal(false);
    }
  };
  
  const restartQuiz = () => {
    const exercisesForMode = 
        currentMode === 'simple_perfect' ? PAST_SIMPLE_PRESENT_PERFECT_EXERCISES :
        currentMode === 'mixed_tenses' ? MIXED_TENSES_EXERCISES :
        PAST_SIMPLE_PAST_CONTINUOUS_EXERCISES;

    setExercises(shuffleArray(exercisesForMode)); 
    setCurrentExerciseIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setShowFeedbackModal(false);
    setScore(0);
    setQuizCompleted(false);
    setAnsweredCorrectlyFlags(Array(exercisesForMode.length).fill(false)); 
    setAchievementStats(prev => ({
      ...prev,
      exerciseAttemptState: {},
      lastAnswerTimestamp: Date.now(),
      quickCorrectStreak: 0,
    }));
  };

  const handleSpeakAchievement = () => {
    setAchievementStats(prev => {
        const newUses = (prev.speakFunctionUses || 0) + 1;
        if (newUses >= 15) {
            unlockAchievement('GOOD_LISTENER');
        }
        return { ...prev, speakFunctionUses: newUses };
    });
  };

  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode);
  const toggleLanguage = (lang: ExplanationLanguage) => setExplanationLanguage(lang);
  const toggleApiExplanations = () => setUseApiForExplanation(prev => !prev);
  const handleModeChange = (mode: AppMode) => setCurrentMode(mode); 

  const toggleAchievementsModal = () => setShowAchievementsModal(prev => !prev);

  const getAppSubtitle = () => {
    switch(currentMode) {
      case 'simple_perfect':
        return "Master Past Simple & Present Perfect";
      case 'mixed_tenses':
        return "Practice Various English Tenses";
      case 'past_simple_continuous':
        return "Practice Past Simple & Past Continuous";
      default:
        return "English Tense Practice";
    }
  };

  const getExerciseInstructionText = () => {
    switch(currentMode) {
      case 'simple_perfect':
        return "Fill in the blank with Past Simple or Present Perfect:";
      case 'mixed_tenses':
        return "Fill in the blank with the correct English tense:";
      case 'past_simple_continuous':
        return "Fill in the blank with Past Simple or Past Continuous:";
      default:
        return "Fill in the blank with the correct tense:";
    }
  };
  
  const getModeDisplayName = (mode: AppMode): string => {
    switch(mode) {
      case 'simple_perfect': return 'Past Simple / Present Perfect';
      case 'mixed_tenses': return 'Mixed Tenses';
      case 'past_simple_continuous': return 'Past Simple / Past Continuous';
      default: return 'Unknown Mode';
    }
  };


  if (quizCompleted) {
    const otherModes = (['simple_perfect', 'mixed_tenses', 'past_simple_continuous'] as AppMode[]).filter(m => m !== currentMode);
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-blue-600 dark:from-primaryDark dark:to-slate-800 flex flex-col items-center justify-center p-4 text-white transition-colors duration-300">
        <div className="bg-white/20 dark:bg-slate-700/50 backdrop-filter backdrop-blur-lg p-8 sm:p-12 rounded-xl shadow-2xl text-center max-w-md sm:max-w-lg w-full">
          <h1 className="text-4xl font-bold mb-6">Quiz Completed!</h1>
          <p className="text-xl sm:text-2xl mb-4">Mode: <span className="font-semibold">{getModeDisplayName(currentMode)}</span></p>
          <p className="text-xl sm:text-2xl mb-8">Your score: <span className="font-bold text-accent dark:text-accentDark">{score}</span> out of {exercises.length}</p>
          <button
            onClick={restartQuiz}
            className="block w-full mb-3 px-8 py-3 bg-accent dark:bg-accentDark text-white font-semibold rounded-lg hover:bg-orange-700 dark:hover:bg-orange-500 transition-all duration-200 text-lg transform active:scale-95 focus:ring-4 focus:ring-accent/50"
          >
            Restart This Mode
          </button>
          {otherModes.map(mode => (
             <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className="block w-full mt-3 px-8 py-3 bg-primary/80 dark:bg-primaryDark/80 text-white font-semibold rounded-lg hover:bg-primary dark:hover:bg-primaryDark transition-all duration-200 text-lg transform active:scale-95 focus:ring-4 focus:ring-primary/50"
             >
               Switch to {getModeDisplayName(mode)}
             </button>
          ))}
        </div>
        {recentlyUnlockedAchievement && <AchievementNotification achievement={recentlyUnlockedAchievement} />}
      </div>
    );
  }

  if (!currentExercise) { 
    return (
        <div className="min-h-screen bg-background dark:bg-backgroundDark flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary dark:border-primaryDark"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-backgroundDark text-textPrimary dark:text-textPrimaryDark flex flex-col items-center justify-start pt-6 sm:pt-10 p-4 transition-colors duration-300">
      <header className="w-full max-w-3xl mb-6 sm:mb-10">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div className="w-1/3 flex items-center space-x-1 sm:space-x-2">
             <button 
              onClick={toggleApiExplanations}
              className={`p-1.5 sm:p-2 rounded-md transition-colors duration-200 flex items-center text-xs sm:text-sm
                          ${useApiForExplanation ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700' 
                                                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'}`}
              aria-pressed={useApiForExplanation}
              title={useApiForExplanation ? "Switch to Standard Explanations" : "Switch to AI-Powered Explanations"}
            >
              {useApiForExplanation ? <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5"/> : <AcademicCapIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5"/>}
              AI: {useApiForExplanation ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="w-1/3 text-center">
             <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-primaryDark">Tense Traveller</h1>
          </div>
          <div className="w-1/3 flex justify-end items-center space-x-1 sm:space-x-2">
            <button 
              onClick={() => toggleLanguage('en')} 
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${explanationLanguage === 'en' ? 'bg-primary dark:bg-primaryDark text-white' : 'bg-surface dark:bg-surfaceDark hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              aria-pressed={explanationLanguage === 'en'}
              title="Set explanation language to English"
            >
              EN
            </button>
            <button 
              onClick={() => toggleLanguage('nl')} 
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${explanationLanguage === 'nl' ? 'bg-primary dark:bg-primaryDark text-white' : 'bg-surface dark:bg-surfaceDark hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              aria-pressed={explanationLanguage === 'nl'}
              title="Set explanation language to Dutch (Nederlands)"
            >
              NL
            </button>
            <button 
              onClick={toggleDarkMode} 
              className="p-1.5 sm:p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
        <p className="text-lg text-textSecondary dark:text-textSecondaryDark mt-1 text-center">{getAppSubtitle()}</p>
        
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {(['simple_perfect', 'past_simple_continuous', 'mixed_tenses'] as AppMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg font-semibold transition-all duration-200 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-backgroundDark focus:ring-primary
                ${currentMode === mode 
                  ? 'bg-primary dark:bg-primaryDark text-white shadow-md' 
                  : 'bg-surface dark:bg-surfaceDark text-textPrimary dark:text-textPrimaryDark hover:bg-slate-100 dark:hover:bg-slate-700 border border-borderLight dark:border-borderDark'}`}
              aria-pressed={currentMode === mode}
            >
              {getModeDisplayName(mode)}
            </button>
          ))}
        </div>
      </header>

      <main className="w-full max-w-2xl flex-grow">
        <div className="mb-6 flex justify-between items-center px-2 text-sm font-medium text-textSecondary dark:text-textSecondaryDark">
            <p>Exercise: {currentExerciseIndex + 1} of {exercises.length}</p>
            <p>Score: <span className="font-bold text-accent dark:text-accentDark">{score}</span></p>
        </div>
        <ExerciseDisplay 
            exercise={currentExercise} 
            onSubmit={handleSubmit}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            instructionText={getExerciseInstructionText()}
            onSpeakInitiated={handleSpeakAchievement}
        />
      </main>

      {showFeedbackModal && (
        <FeedbackModal
          feedback={feedback}
          isLoadingExplanation={isLoadingExplanation}
          onClose={handleCloseModal}
          onNext={handleNextExercise}
          isLastExercise={currentExerciseIndex === exercises.length - 1}
        />
      )}
      
      <AchievementsModal 
        achievements={Object.values(achievements)} 
        isOpen={showAchievementsModal} 
        onClose={toggleAchievementsModal} 
      />

       {recentlyUnlockedAchievement && <AchievementNotification achievement={recentlyUnlockedAchievement} />}


      <footer className="mt-12 mb-6 text-center text-textSecondary dark:text-textSecondaryDark text-sm">
        <button 
            onClick={toggleAchievementsModal}
            className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent dark:bg-accentDark hover:bg-orange-700 dark:hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-backgroundDark focus:ring-accent"
            title="Open Trofeeënkast"
            aria-label="Open Trofeeënkast"
        >
            <TrophyIcon className="w-5 h-5 mr-2 -ml-1" />
            Trofeeënkast
        </button>
        <p>&copy; {new Date().getFullYear()} Rythovius Tense Traveller. Sharpen your English grammar skills!</p>
         { !process.env.API_KEY && useApiForExplanation &&
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">AI explanations may not work as API_KEY is not configured.</p>
         }
      </footer>
    </div>
  );
};

export default App;