import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Exercise, ExplanationLanguage, AppMode } from '../types';
import { GEMINI_MODEL_TEXT } from '../constants';

// IMPORTANT: API_KEY is expected to be set in the environment variables.
// For this frontend-only sandbox, process.env.API_KEY might be undefined
// unless specifically provided by the execution environment.
// The application logic in App.tsx handles potential errors if API_KEY is missing.
const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    // ai remains null, and calls using it will be skipped or fail gracefully.
  }
} else {
  console.warn("API_KEY for GoogleGenAI is not set. AI explanations will not be available.");
}

export const getExplanationFromGemini = async (
  exercise: Exercise,
  userAnswer: string,
  language: ExplanationLanguage,
  currentMode: AppMode
): Promise<string> => {
  if (!ai) {
    throw new Error("GoogleGenAI client is not initialized (API_KEY may be missing or invalid).");
  }

  const { correctAnswer, tense, keywordHint, sentenceTemplate, verb } = exercise;
  const filledSentenceCorrect = sentenceTemplate.replace(/______\s*\({verb}\)/, `__${correctAnswer}__ (${verb})`);
  const filledSentenceUser = sentenceTemplate.replace(/______\s*\({verb}\)/, `__${userAnswer}__ (${verb})`);
  const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

  const langInstructions = language === 'nl' ? 
    "Geef de uitleg in het Nederlands. Wees beknopt en helder, gericht op een middelbare scholier (mavo/havo/vwo niveau)." : 
    "Provide the explanation in English. Be concise and clear, targeting a high school student.";

  let modeContext = "";
  if (currentMode === 'simple_perfect') {
    modeContext = language === 'nl' ?
      "De leerling oefent specifiek het verschil tussen de Past Simple en de Present Perfect." :
      "The student is specifically practicing the difference between Past Simple and Present Perfect.";
  } else if (currentMode === 'past_simple_continuous') {
    modeContext = language === 'nl' ?
      "De leerling oefent specifiek het verschil tussen de Past Simple en de Past Continuous." :
      "The student is specifically practicing the difference between Past Simple and Past Continuous.";
  } else { // mixed_tenses
    modeContext = language === 'nl' ?
      "De leerling oefent verschillende Engelse werkwoordstijden." :
      "The student is practicing various English verb tenses.";
  }

  const prompt = `
    ${langInstructions}
    ${modeContext}

    De oefening was:
    Zin template: "${sentenceTemplate}" (werkwoord: ${verb})
    Signaalwoord/hint: "${keywordHint}"
    De te oefenen tijd in deze zin is: ${tense}.
    Het juiste antwoord is: "${correctAnswer}".
    De leerling antwoordde: "${userAnswer}".

    ${isCorrect ? 
      `Het antwoord van de leerling is correct. Geef een korte bevestiging en leg uit WAAROM "${correctAnswer}" (de ${tense}) hier correct is, verwijzend naar het signaalwoord "${keywordHint}" en de structuur/gebruik van de ${tense}. De correct ingevulde zin is: "${filledSentenceCorrect}".` :
      `Het antwoord van de leerling is incorrect. Leg uit WAAROM "${userAnswer}" niet correct is en waarom "${correctAnswer}" (de ${tense}) wel correct is. Verwijs naar het signaalwoord "${keywordHint}" en de structuur/gebruik van de ${tense}. De correct ingevulde zin zou zijn: "${filledSentenceCorrect}".`
    }
    Focus op de grammaticale redenen. Vermijd direct te zeggen "Jouw antwoord was goed/fout" aan het begin van je uitleg; start direct met de grammaticale verklaring.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let errorMessage = "Failed to get explanation from AI.";
    if (error instanceof Error) {
        errorMessage += ` Details: ${error.message}`;
    }
    // Check for specific error types if the SDK provides them, e.g., rate limits
    // For now, a generic error is thrown.
    throw new Error(errorMessage);
  }
};


export const getExplanationPlaceholder = async (
  exercise: Exercise,
  userAnswer: string | undefined,
  language: ExplanationLanguage,
  currentMode: AppMode 
): Promise<string> => {
  const { correctAnswer, tense, keywordHint, sentenceTemplate, verb } = exercise;
  const filledSentence = sentenceTemplate.replace(/______\s*\({verb}\)/, `__${correctAnswer}__ (${verb})`);
  const isCorrect = userAnswer?.trim().toLowerCase() === correctAnswer.toLowerCase();

  let explanation = "";
  let tenseFocus = "";

  if (currentMode === 'simple_perfect') {
    tenseFocus = language === 'nl' ? "de Past Simple of Present Perfect" : "the Past Simple or Present Perfect";
  } else if (currentMode === 'past_simple_continuous') {
    tenseFocus = language === 'nl' ? "de Past Simple of Past Continuous" : "the Past Simple or Past Continuous";
  } else { // mixed_tenses
    tenseFocus = language === 'nl' ? `de ${tense}` : `the ${tense}`;
  }


  if (language === 'nl') {
    if (isCorrect) {
      explanation = `Goed gedaan! Jouw antwoord "${userAnswer}" is correct.\n\nDe zin is: "${filledSentence}".\n`;
    } else if (userAnswer) {
      explanation = `Helaas, jouw antwoord "${userAnswer}" is niet correct. Het juiste antwoord is "${correctAnswer}".\n\nDe correcte zin is: "${filledSentence}".\n`;
    } else {
      explanation = `Het juiste antwoord is "${correctAnswer}".\n\nDe correcte zin is: "${filledSentence}".\n`;
    }
    explanation += `De relevante tijd in deze oefening is ${tenseFocus}. Let op de signaalwoorden of context zoals "${keywordHint}".`;
  } else { // English
    if (isCorrect) {
      explanation = `Well done! Your answer "${userAnswer}" is correct.\n\nThe sentence is: "${filledSentence}".\n`;
    } else if (userAnswer) {
      explanation = `Unfortunately, your answer "${userAnswer}" is not correct. The correct answer is "${correctAnswer}".\n\nThe correct sentence is: "${filledSentence}".\n`;
    } else {
      explanation = `The correct answer is "${correctAnswer}".\n\nThe sentence is: "${filledSentence}".\n`;
    }
    explanation += `The relevant tense in this exercise is ${tenseFocus}. Pay attention to keywords or context like "${keywordHint}".`;
  }

  // Simulate async behavior slightly, though it's essentially synchronous
  return Promise.resolve(explanation);
};