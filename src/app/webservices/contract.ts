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
  type: 'quick-quiz'
  score: number
  isPassed: boolean
  certificateId?: string
  species: string
  breed?: string
  seenCardsIds: string[]
}

export interface UserChoiceAssistData {
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
