import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuickQuizService {

  private _mock = dataMock

  private _score = signal(0)
  private _currentIndex = signal(0);
  private _quizData = signal<QuickQuizData>(this._mock[0])

  score = this._score.asReadonly()
  quizData = this._quizData.asReadonly();

  private readonly _UI_KEY = 'quickQuizUI';

  initScore() {
    this._score.set(0);
  }

  updateScore(isCorrect: boolean) {
    if (isCorrect)
      this._score.update(s => s + 10);
  }

  persistResultView(score: number, species: string, breed: string | undefined) {
    sessionStorage.setItem(this._UI_KEY, JSON.stringify({ score, species, breed}))
  }

  restoreResultView(): { score: number, species: string, breed: string | undefined } | null {
    const restore = sessionStorage.getItem(this._UI_KEY);
    if (restore) return JSON.parse(restore);
    return null;
  }

  clearResultView() {
    sessionStorage.removeItem(this._UI_KEY);
  }

  initQuiz(species: string, breed: string | undefined) {
    this.initScore()
    this._currentIndex.set(0);
    this._quizData.set(this._mock[0]);
    this.saveState(species, breed);
  }

  resumeQuiz(species: string): QuizState | null {
    const raw = sessionStorage.getItem(this.getStateKey(species));
    if (!raw) return null;
    const state: QuizState = JSON.parse(raw);

    this._currentIndex.set(state.currentIndex);
    this._score.set(state.score);
    this._quizData.set(this._mock[state.currentIndex]);

    return state;
  }

  endQuiz(species: string) {
    this.clearState(species);
  }

  saveState(species: string, breed: string | undefined) {
    const state: QuizState = { species, breed, currentIndex: this._currentIndex(), score: this._score() };
    sessionStorage.setItem(this.getStateKey(species), JSON.stringify(state));
  }

  clearState(species: string) {
    sessionStorage.removeItem(this.getStateKey(species));
  }

  hasSavedState(species: string, breed: string | undefined): boolean {
    const savedState = sessionStorage.getItem(this.getStateKey(species));
    if (!savedState) return false;
    const state: QuizState = JSON.parse(savedState);
    return state.breed === breed;
  }

  private getStateKey(species: string): string {
    return `quizState_${species}`;
  }

  hasNext = computed(() => this._currentIndex() + 1 < this._mock.length)

  getNextQuiz(species: string, breed: string | undefined) {
    if (this.hasNext()) {
      const nextIndex = this._currentIndex() + 1;
      this._currentIndex.set(nextIndex);
      setTimeout(() => this._quizData.set(this._mock[nextIndex]), 3000);
      this.saveState(species, breed);
    }
  }

}

export type QuizState = {
  currentIndex: number;
  score: number;
  species: string;
  breed: string | undefined;
}

export type QuickQuizData = {
  question: string;
  answers: Answer[];
  multipleCorrectAnswers: boolean;
  timeLimitSeconds?: number;
}

export type Answer = {
  text: string;
  isCorrect: boolean;
}


const dataMock: QuickQuizData[] = [
  {
    multipleCorrectAnswers: false,
    timeLimitSeconds: 20,
    question: "Quelle est la durée de vie moyenne d'un chat domestique ?",
    answers: [
      { text: '5 à 8 ans', isCorrect: false },
      { text: '12 à 18 ans', isCorrect: true },
      { text: '20 à 25 ans', isCorrect: false },
      { text: '8 à 10 ans', isCorrect: false }
    ]
  },
  {
    multipleCorrectAnswers: true,
    timeLimitSeconds: 30,
    question: "Quels éléments sont indispensables avant d'adopter un chien ?",
    answers: [
      { text: 'Un espace extérieur adapté', isCorrect: true },
      { text: 'Du temps pour les sorties quotidiennes', isCorrect: true },
      { text: 'Un jardin obligatoirement', isCorrect: false },
      { text: 'Un budget pour les soins vétérinaires', isCorrect: true }
    ]
  },
  {
    multipleCorrectAnswers: false,
    timeLimitSeconds: 20,
    question: "À quelle fréquence un chien adulte doit-il être promené minimum ?",
    answers: [
      { text: 'Une fois par semaine', isCorrect: false },
      { text: 'Une fois par jour', isCorrect: false },
      { text: 'Deux à trois fois par jour', isCorrect: true },
      { text: 'Une fois tous les deux jours', isCorrect: false }
    ]
  },
  {
    multipleCorrectAnswers: false,
    timeLimitSeconds: 20,
    question: "Quel document est obligatoire pour identifier votre animal en France ?",
    answers: [
      { text: 'Un carnet de santé', isCorrect: false },
      { text: 'Une puce électronique ou un tatouage', isCorrect: true },
      { text: 'Un certificat de naissance', isCorrect: false },
      { text: 'Un passeport européen', isCorrect: false }
    ]
  },
  {
    multipleCorrectAnswers: true,
    timeLimitSeconds: 30,
    question: "Quelles sont les causes les plus fréquentes d'abandon animal ?",
    answers: [
      { text: 'Manque de temps', isCorrect: true },
      { text: 'Problèmes financiers', isCorrect: true },
      { text: 'Allergie', isCorrect: true },
      { text: 'Animal trop affectueux', isCorrect: false }
    ]
  },
  {
    multipleCorrectAnswers: false,
    timeLimitSeconds: 20,
    question: "À quel âge un chaton peut-il être séparé de sa mère ?",
    answers: [
      { text: '4 semaines', isCorrect: false },
      { text: '6 semaines', isCorrect: false },
      { text: '8 semaines minimum', isCorrect: true },
      { text: '3 mois', isCorrect: false }
    ]
  },
  {
    multipleCorrectAnswers: false,
    timeLimitSeconds: 20,
    question: "Qu'est-ce que la stérilisation apporte à votre animal ?",
    answers: [
      { text: 'Elle réduit les risques de certains cancers', isCorrect: true },
      { text: 'Elle rend l\'animal plus agressif', isCorrect: false },
      { text: 'Elle est uniquement esthétique', isCorrect: false },
      { text: 'Elle réduit l\'espérance de vie', isCorrect: false }
    ]
  },
  {
    multipleCorrectAnswers: true,
    timeLimitSeconds: 30,
    question: "Quels soins réguliers sont nécessaires pour un lapin domestique ?",
    answers: [
      { text: 'Brossage régulier', isCorrect: true },
      { text: 'Bains hebdomadaires', isCorrect: false },
      { text: 'Coupe des griffes', isCorrect: true },
      { text: 'Accès à du foin à volonté', isCorrect: true }
    ]
  },
  {
    multipleCorrectAnswers: false,
    timeLimitSeconds: 20,
    question: "Quelle est la meilleure façon d'éduquer un chien ?",
    answers: [
      { text: 'Le punir physiquement en cas d\'erreur', isCorrect: false },
      { text: 'Le renforcement positif avec récompenses', isCorrect: true },
      { text: 'L\'ignorer jusqu\'à ce qu\'il obéisse', isCorrect: false },
      { text: 'Crier fort pour le faire obéir', isCorrect: false }
    ]
  },
    {
      multipleCorrectAnswers: false,
      timeLimitSeconds: 20,
      question: "Combien coûte en moyenne la première année avec un chien (hors achat) ?",
      answers: [
        { text: 'Moins de 200€', isCorrect: false },
        { text: 'Entre 200€ et 500€', isCorrect: false },
        { text: 'Entre 1000€ et 2000€', isCorrect: true },
        { text: 'Plus de 5000€', isCorrect: false }
      ]
    }
]
