import { Achievement, AchievementId } from './types';

export const initialAchievementsList: Achievement[] = [
  // Score & Performance
  { id: 'FIRST_STEP', name: 'Eerste Stap', description: 'Behaal je allereerste goede antwoord!', icon: '🎉', unlocked: false },
  { id: 'MASTER_SIMPLE_PERFECT', name: 'Meester: Simpel & Perfect', description: 'Beantwoord alle vragen correct in één sessie van de modus \'Past Simple / Present Perfect\'.', icon: '🏆', unlocked: false },
  { id: 'MASTER_MIXED_TENSES', name: 'Meester: Gemengde Tijden', description: 'Beantwoord alle vragen correct in één sessie van de modus \'Mixed Tenses\'.', icon: '🏆', unlocked: false },
  { id: 'MASTER_PAST_SIMPLE_CONTINUOUS', name: 'Meester: Verleden Tijden Duel', description: 'Beantwoord alle vragen correct in één sessie van de modus \'Past Simple / Past Continuous\'.', icon: '🏆', unlocked: false },
  { id: 'COMPLETE_SIMPLE_PERFECT', name: 'Voltooid: Simpel & Perfect', description: 'Voltooi alle oefeningen in de modus \'Past Simple / Present Perfect\'.', icon: '🏁', unlocked: false },
  { id: 'COMPLETE_MIXED_TENSES', name: 'Voltooid: Gemengde Tijden', description: 'Voltooi alle oefeningen in de modus \'Mixed Tenses\'.', icon: '🏁', unlocked: false },
  { id: 'COMPLETE_PAST_SIMPLE_CONTINUOUS', name: 'Voltooid: Verleden Tijden Duel', description: 'Voltooi alle oefeningen in de modus \'Past Simple / Past Continuous\'.', icon: '🏁', unlocked: false },
  { id: 'STREAK_BRONZE', name: 'Streak Ster (Brons)', description: 'Beantwoord 5 vragen achter elkaar correct.', icon: '🥉', unlocked: false },
  { id: 'STREAK_SILVER', name: 'Streak Ster (Zilver)', description: 'Beantwoord 10 vragen achter elkaar correct.', icon: '🥈', unlocked: false },
  { id: 'STREAK_GOLD', name: 'Streak Ster (Goud)', description: 'Beantwoord 20 vragen achter elkaar correct.', icon: '🥇', unlocked: false },
  { id: 'SCORE_TOPPER_SIMPLE_PERFECT', name: 'Scorer: Simpel & Perfect', description: 'Behaal 90%+ score in \'Past Simple / Present Perfect\'.', icon: '🎯', unlocked: false },
  { id: 'SCORE_TOPPER_MIXED_TENSES', name: 'Scorer: Gemengde Tijden', description: 'Behaal 90%+ score in \'Mixed Tenses\'.', icon: '🎯', unlocked: false },
  { id: 'SCORE_TOPPER_PAST_SIMPLE_CONTINUOUS', name: 'Scorer: Verleden Tijden Duel', description: 'Behaal 90%+ score in \'Past Simple / Past Continuous\'.', icon: '🎯', unlocked: false },
  
  // Usage & Engagement
  { id: 'LANGUAGE_EXPLORER', name: 'Talenknobbel', description: 'Gebruik de uitlegfunctie in zowel Engels als Nederlands.', icon: '🌍', unlocked: false },
  { id: 'GOOD_LISTENER', name: 'Luisterend Oor', description: 'Gebruik de \'Spreek uit\' functie 15 keer.', icon: '🎧', unlocked: false },
  { id: 'AI_ADEPT', name: 'AI-Adept', description: 'Ontvang 10 keer succesvol een uitleg via de AI.', icon: '🤖', unlocked: false },
  { id: 'CLASSIC_CONNOISSEUR', name: 'Klassieke Kenner', description: 'Voltooi een modus met AI-uitleg uitgeschakeld.', icon: '🧐', unlocked: false },
  { id: 'NIGHT_OWL', name: 'Nachtuil', description: 'Voltooi een oefening tussen 20:00 en 21:59 uur.', icon: '🦉', unlocked: false },
  { id: 'EARLY_BIRD', name: 'Vroege Vogel', description: 'Voltooi een oefening tussen 07:00 en 08:59 uur.', icon: '🐦', unlocked: false },

  // Exploration & Creative
  { id: 'MODE_HOPPER', name: 'Modus Verkenner', description: 'Probeer alle drie de quizmodi minstens één keer.', icon: '🗺️', unlocked: false },
  { id: 'STYLE_SWITCHER', name: 'Stijlwisselaar', description: 'Voltooi een oefening in zowel lichte als donkere modus.', icon: '🎨', unlocked: false },
  { id: 'COMEBACK_KID', name: 'Comeback Kid', description: 'Verbeter een eerder fout antwoord op dezelfde vraag correct.', icon: '💪', unlocked: false },
  { id: 'QUICK_LEARNER', name: 'Snelle Leerling', description: 'Beantwoord 5 vragen op rij correct, elk binnen 10 seconden.', icon: '⚡', unlocked: false },

  // Funny Mistake Achievements
  { id: 'BARE_BONES', name: 'De Kale Kip Award', description: "Oeps! Je bent het hulpwerkwoord vergeten, maar de kern was er bijna! (Bijv. 'gezien' i.p.v. 'heb gezien')", icon: '🍗', unlocked: false },
  { id: 'DEJA_WRONG', name: 'Déjà Fout!', description: "Deze fout komt je bekend voor, hè? Precies dezelfde fout nog een keer gemaakt op dezelfde vraag.", icon: '🔄', unlocked: false },
  { id: 'PERFECTLY_IMPERFECT', name: 'Perfect Onvolmaakt', description: "Wow, 0% score in een volledige quizronde! Dat is ook een prestatie op zich.", icon: '🙈', unlocked: false },
];

export const initialAchievementsState: Record<AchievementId, Achievement> = 
  initialAchievementsList.reduce((acc, ach) => {
    acc[ach.id] = ach;
    return acc;
  }, {} as Record<AchievementId, Achievement>);