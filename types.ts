export type Tense = string; // Was 'Past Simple' | 'Present Perfect'

export interface Exercise {
  id: number;
  sentenceTemplate: string; // e.g., "I ______ ({verb}) to the cinema {time_adverb}."
  verb: string; // "go"
  correctAnswer: string; // The full correct verb phrase, e.g., "went" or "have gone"
  tense: Tense; // The specific tense that is correct for this sentence, e.g., "Past Simple", "Present Continuous"
  keywordHint: string; // e.g., "yesterday", "for three years", "now"
}

export interface Feedback {
  isCorrect: boolean;
  explanation: string | null;
  errorMessage?: string;
  apiErrorOccurred?: boolean; // Added to indicate AI explanation fallback
}

export type ExplanationLanguage = 'en' | 'nl';

export type AppMode = 'simple_perfect' | 'mixed_tenses' | 'past_simple_continuous';

// Achievement System Types
export type AchievementId =
  | 'FIRST_STEP'
  | 'MASTER_SIMPLE_PERFECT'
  | 'MASTER_MIXED_TENSES'
  | 'MASTER_PAST_SIMPLE_CONTINUOUS'
  | 'COMPLETE_SIMPLE_PERFECT'
  | 'COMPLETE_MIXED_TENSES'
  | 'COMPLETE_PAST_SIMPLE_CONTINUOUS'
  | 'STREAK_BRONZE'
  | 'STREAK_SILVER'
  | 'STREAK_GOLD'
  | 'SCORE_TOPPER_SIMPLE_PERFECT'
  | 'SCORE_TOPPER_MIXED_TENSES'
  | 'SCORE_TOPPER_PAST_SIMPLE_CONTINUOUS'
  | 'LANGUAGE_EXPLORER'
  | 'GOOD_LISTENER'
  | 'AI_ADEPT'
  | 'CLASSIC_CONNOISSEUR'
  | 'NIGHT_OWL'
  | 'EARLY_BIRD'
  | 'MODE_HOPPER'
  | 'STYLE_SWITCHER'
  | 'COMEBACK_KID'
  | 'QUICK_LEARNER'
  // Funny Mistake Achievements
  | 'BARE_BONES'
  | 'DEJA_WRONG'
  | 'PERFECTLY_IMPERFECT';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string; // Emoji or SVG path
  unlocked: boolean;
}

export type AchievementsState = Record<AchievementId, Achievement>;

export interface AchievementStats {
  totalCorrectAnswersGlobal: number;
  currentCorrectStreakGlobal: number;
  maxCorrectStreakGlobal: number;
  speakFunctionUses: number;
  successfulApiExplanations: number;
  usedLanguages: Set<ExplanationLanguage>;
  usedThemes: Set<'light' | 'dark'>;
  playedModes: Set<AppMode>;
  quizCompletionsPerMode: Record<AppMode, number>;
  highScoresPerMode: Record<AppMode, number>; // Stores highest percentage
  perfectScoresPerMode: Record<AppMode, number>; // Counts times all questions correct
  lastAnswerTimestamp: number;
  quickCorrectStreak: number;
  // For Comeback Kid & Deja Wrong: track if the immediate previous attempt on the *same exercise id* was wrong
  exerciseAttemptState: Record<number, { previouslyIncorrect: boolean; lastIncorrectAnswer?: string }>;
}

export type AchievementUnlockHandler = (achievementId: AchievementId) => void;