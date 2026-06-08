export interface User {
  id: string
  basics: UserBasics
  context?: UserContext
  trainings: UserTraining[]
}

export interface Login {
  email: string
  password: string
}

export interface Register {
  name: string
  email: string
  password: string
  phoneNumber: string
}

export interface UserBasics {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthDate?: string;
}

export interface UserContext {
  residence: {
    type?: 'maison'
      | 'appartement',
    address?: string,
    surface?: number,
    hasGarden?: boolean,
    hasBalcony?: boolean
  },
  household: {
    hasPartner?: boolean,
    liveTogether?: boolean,
    childrenCount?: number
  }
}

export interface ChoiceAssistContext {
  isOnFloor?: boolean
  hasLift?: boolean
  speciesPreference?: 'chat' | 'chien'
  petBudget?: number
  otherSpecies?: string
  childrenAgeRange?: string
  activityLevel?: 'sedentaire' | 'modere' | 'actif'
  spareTime?: number
  petExperience?: 'aucune' | 'debutant' | 'experimente'
  petSizePreference?: 'petite' | 'moyenne' | 'grande'
  userFreeTextInput?: string
}

export interface Recommendation {
  adId: number;
  petId: number;
  name: string;
  species: string;
  breed: string | null;
  sex?: 'M' | 'F';
  photos?: string;
  score: number;
  reason: string;
  confidence: 'haute' | 'moyenne' | 'faible';
  description?: string;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  analysisCount: number;
  message?: string;
}

export type UserTraining = UserLearnData |
  UserQuickQuizData | UserChoiceAssistData

export interface UserLearnData {
  id: string
  type: 'learn'
  progression: number
  isDone: boolean
  certificateId?: string
  species: string
  breed?: string
  modules: LearnModuleData[]
}

export interface UserQuickQuizData {
  id: string,
  type: 'quick-quiz'
  score: number
  isDone: boolean
  certificateId?: string
  species: string
  breed: string | null
  seenCardsIds: string[]
}

export interface UserChoiceAssistData {
  id: string
  type: 'choice-assist'
  species: string
  breed?: string
}

export interface LearnModuleData {
  isDone: boolean
  progression: number
  type: LearnModuleType
  topicsLearned: LearnCardData[]
  quizzesTaken: QuizCardData[]
}

export interface LearnCardData {

}

export interface QuizCardData {
  id: string
  question: string;
  answers: Answer[];
  multipleCorrectAnswers: boolean;
  timeLimitSeconds?: number;
}

export type LearnModuleType = 'health'

export type Answer = {
  text: string;
  isCorrect: boolean;
}
