import {Component, computed, inject, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {QuickQuizCard} from '../shared/quick-quiz-card/quick-quiz-card';
import {NavBarService} from '../../services/nav-bar-service';
import {Answer, QuickQuizService} from '../../services/quick-quiz-service';
import {SplitCard} from '../shared/split-card/split-card';

@Component({
  selector: 'app-quick-quiz',
  imports: [
    Button,
    Select,
    FormsModule,
    QuickQuizCard,
    SplitCard
  ],
  templateUrl: './quick-quiz.html',
  styleUrl: './quick-quiz.css',
})
export class QuickQuiz {

  private navBarService = inject(NavBarService);
  private quickQuizService = inject(QuickQuizService);

  protected quizData = this.quickQuizService.quizData;

  protected headerBackground = 'images/qq-header-bg.jpg';

  protected score = signal(100)
  protected isQuizPassed = computed(() => this.score() >= 80);

  protected quizDoneButtons = computed(() =>
    this.isQuizPassed() ? quizPassedButtons : quizFailedButtons
  );

  private _quizPassedBackground = 'images/qq-passed-bg.jpg';
  private  _quizFailedBackground = 'images/qq-failed-bg.jpg';

  protected quizBackground = computed(() =>
    this.isQuizPassed() ? this._quizPassedBackground : this._quizFailedBackground
  );

  private _quizPassedIcon = 'pi pi-check-circle';
  private _quizFailedIcon = 'pi pi-times-circle';

  protected quizIcon = computed(() =>
    this.isQuizPassed() ? this._quizPassedIcon : this._quizFailedIcon
  );

  infoQuiz = signal<InfoQuiz>({ ...infoQuizFailed, infoScore: '' });

  constructor() {
    this.navBarService.links.set([
      { label: 'Contact', fragment: 'contact' },
      { label: 'Se former', pathURL: 'learn' },
      { label: 'Aide au choix', pathURL: 'choice-assist' },
    ])
  }

  species: string[] = animals.map(a => a.species)

  breeds = computed(() =>
    animals.find(a => a.species === this.selectedSpecies())?.breeds ?? []
  );

  selectedSpecies = signal<string>(animals[0].species)

  selectedBreed = signal<string | undefined>(undefined)

  choiceSubmitted = signal(false)

  startQuiz() {
    this.choiceSubmitted.set(true)
  }

  isQuizDone = signal(false)

  updateScore(isCorrect: boolean) {
    if (!isCorrect)
      this.score.update(s => s - 10);

    if (this.score() < 0)
      this.score.set(0);

  }

  submitSelectedAnswers(selectedAnswers: Answer[]) {

    const correctAnswers = this.quizData().answers
      .filter(a => a.isCorrect);

    const isCorrect = selectedAnswers
      .every(a => correctAnswers.includes(a))
      && selectedAnswers.length === correctAnswers.length;

    this.updateScore(isCorrect)

    const hasNext = this.quickQuizService.getNextQuiz()

    if (!hasNext) {
      this.isQuizDone.set(true)

      const infoQuizScore = `Votre score est de ${this.score()}%`

      this.isQuizPassed() ? this.infoQuiz.set({ ...infoQuizPassed, infoScore: infoQuizScore })
        : this.infoQuiz.set({ ...infoQuizFailed, infoScore: infoQuizScore })
    }

  }

}

export interface Animal {
  species: string,
  breeds: string[]
}

export type InfoButton = {
  label: string,
  icon: string,
  redirectLink: string
}

export type QuizDoneButtons = {
  left: InfoButton,
  right: InfoButton
}

export type InfoQuiz = {
  title: string,
  infoScore: string,
  outcome: string
}

export const quizPassedButtons: QuizDoneButtons = {
  left : {
    label: 'Voir mon certificat',
    icon: 'pi pi-eye',
    redirectLink: '/certificate'
  },
  right : {
    label: 'Accéder au catalogue',
    icon: 'pi pi-book',
    redirectLink: '/catalog'
  }
}

export const quizFailedButtons: QuizDoneButtons = {
  left : {
    label: 'Refaire le quiz',
    icon: 'pi pi-replay',
    redirectLink: '/quick-quiz'
  },
  right : {
    label: 'Suivre une formation',
    icon: 'pi pi-graduation-cap',
    redirectLink: '/learn'
  }
}

export const infoQuizPassed: Omit<InfoQuiz, 'infoScore'> = {
  title: 'Félicitations !',
  outcome: 'Un certificat vous a été délivré et vous pouvez accéder au catalogue des annonces.',
}

export const infoQuizFailed: Omit<InfoQuiz, 'infoScore'> = {
  title: 'Oups, ça n\'a pas marché !',
  outcome: 'Vous pouvez refaire le quiz ou suivre notre parcours de formation.'
}

export const animals: Animal[] = [
  { species: 'Chat',
    breeds:
      [
        'Bengale',
        'Siamois',
        'Ragdoll',
        'Savannah',
        'British Shorthair',
        'Sacré de Birmaine',
        'Maine Coon'
      ]
  },
  { species: 'Chien',
    breeds:
      [
        'Berger Allemand',
        'Labrador',
        'Golden Retriever',
        'Bulldog',
        'Beagle',
        'Poodle',
        'Rottweiler',
        'Yorkshire Terrier',
        'Boxer',
        'Dachshund'
      ]
  },
  { species: 'Lapin' ,
    breeds:
      [
        'Blanc danois',
        'Géant des Flandres',
        'Bélier français',
        'Bélier anglais',
        'Fauve de Bourgogne',
      ]
  },
]
