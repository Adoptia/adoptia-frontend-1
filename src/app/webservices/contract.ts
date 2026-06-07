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
    type: 'maison'
      | 'appartement',
    address: string,
    surface: number,
    garden: boolean,
    balcony: boolean
  },
  household: {
    hasPartner: boolean,
    liveTogether: boolean,
    childrenCount: number
  }
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

export interface ProfilAdoptant {
  espece: 'chien' | 'chat';
  type_habitat?: 'appartement' | 'maison';
  has_jardin?: boolean;
  has_enfants?: boolean;
  age_enfants?: 'jeunes' | 'grands';
  nb_enfants?: number;
  niveau_activite?: 'sedentaire' | 'modere' | 'sportif';
  heures_seul?: number;
  experience?: 'aucune' | 'debutant' | 'experimente';
  autres_animaux?: string;
  taille_preferee?: 'petite' | 'moyenne' | 'grande';
  tolerance_poils?: boolean;
  allergie?: boolean;
  budget?: number;
  situation_libre?: string;
}

export interface Recommandation {
  id_annonce: number;
  id_animal: number;
  nom: string;
  espece: string;
  race?: string;
  sexe?: string;
  photos?: string;
  score: number;
  raison: string;
  confiance: 'haute' | 'moyenne' | 'faible';
  description?: string;
}

export interface RecommandationsResponse {
  recommandations: Recommandation[];
  total_analyses: number;
  message?: string;
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
