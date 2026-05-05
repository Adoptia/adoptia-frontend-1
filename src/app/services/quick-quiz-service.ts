import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuickQuizService {

  private _mock = dataMock

  private _currentIndex = signal(0);

  private _quizData = signal<QuickQuizData>(
    this._mock[this._currentIndex()]
  )

  quizData = this._quizData.asReadonly();

  getNextQuiz() {
    const nextIndex = this._currentIndex() + 1;

    if (nextIndex >= this._mock.length) {
      return false;
    }

    this._currentIndex.set(nextIndex);
    this._quizData.set(this._mock[nextIndex]);
    return true;
  }

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
    question: "Combien coûte en moyenne la première année avec un chien (hors achat) ?",
    answers: [
      { text: 'Moins de 200€', isCorrect: false },
      { text: 'Entre 200€ et 500€', isCorrect: false },
      { text: 'Entre 1000€ et 2000€', isCorrect: true },
      { text: 'Plus de 5000€', isCorrect: false }
    ]
  }
]
