import {Component, computed, inject, signal, ChangeDetectionStrategy, effect, OnDestroy} from '@angular/core';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {QuickQuizCard} from '../shared/quick-quiz-card/quick-quiz-card';
import {NavBarService} from '../../services/nav-bar-service';
import {QuickQuizService} from '../../services/quick-quiz-service';
import {SplitCard} from '../shared/split-card/split-card';
import {Router, RouterLink} from '@angular/router';
import {Answer} from '../../webservices/contract';

@Component({
  selector: 'app-quick-quiz',
  imports: [
    Button,
    Select,
    FormsModule,
    QuickQuizCard,
    SplitCard,
    RouterLink
  ],
  templateUrl: './quick-quiz.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './quick-quiz.css',
})
export class QuickQuiz implements OnDestroy {

  private router = inject(Router)
  private navBarService = inject(NavBarService);
  private quickQuizService = inject(QuickQuizService);

  private _quizPassedBackground = 'images/qq-passed-bg.jpg';
  private  _quizFailedBackground = 'images/qq-failed-bg.jpg';

  private _quizPassedIcon = 'pi pi-check-circle';
  private _quizFailedIcon = 'pi pi-times-circle';

  protected headerBackground = 'images/qq-header-bg.jpg';


  protected quizCardData = this.quickQuizService.quizCardData;

  hasSavedState = computed(() =>
    this.quickQuizService.hasSavedState(this.selectedSpecies(), this.selectedBreed())
  )

  protected score = this.quickQuizService.score;
  protected isQuizDone = this.quickQuizService.isQuizDone
  protected isQuizPassed = computed(() => this.score() >= 80);

  protected quizDoneButtons = computed(() =>
    this.isQuizPassed() ? quizPassedButtons : quizFailedButtons
  );

  protected quizBackground = computed(() =>
    this.isQuizPassed() ? this._quizPassedBackground : this._quizFailedBackground
  );

  protected quizIcon = computed(() =>
    this.isQuizPassed() ? this._quizPassedIcon : this._quizFailedIcon
  );

  protected infoQuiz = signal<InfoQuiz>({ ...infoQuizFailed, infoScore: '' });

  protected species: string[] = animals.map(a => a.species)

  protected breeds = computed(() =>
    animals.find(a => a.species === this.selectedSpecies())?.breeds ?? []
  );

  selectedSpecies = signal<string>(animals[0].species)
  selectedBreed = signal<string | undefined>(undefined)
  choiceSubmitted = signal(false)

  protected showResults = signal(false)

  startQuiz() {
    this.quickQuizService.initQuiz(this.selectedSpecies(), this.selectedBreed())
    this.choiceSubmitted.set(true)
  }

  resumeQuiz() {
    const state = this.quickQuizService.resumeQuiz(this.selectedSpecies());
    if (!state) return;
    this.selectedSpecies.set(state.species);
    this.selectedBreed.set(state.breed);
    this.choiceSubmitted.set(true);
  }

  submitSelectedAnswers(selectedAnswers: Answer[]) {

    const correctAnswers = this.quizCardData().answers
      .filter(a => a.isCorrect);

    const isCorrect = selectedAnswers
      .every(a => correctAnswers.includes(a))
      && selectedAnswers.length === correctAnswers.length;

    this.quickQuizService.updateScore(isCorrect)

    if ( !this.quickQuizService.hasNext() ) {
      this.quickQuizService.endQuiz()
      this.getResults()
      return
    }

    this.quickQuizService.getNextQuiz();

  }

  getResults() {
    const infoQuizScore = `Votre score est de ${ this.score() }%`;
    this.isQuizPassed()
      ? this.infoQuiz.set({ ...infoQuizPassed, infoScore: infoQuizScore })
      : this.infoQuiz.set({ ...infoQuizFailed, infoScore: infoQuizScore });
  }

  constructor() {
    const saved
      = this.quickQuizService.restoreResultView();

    if (saved) {
      this.selectedSpecies.set(saved.species)
      this.selectedBreed.set(saved.breed);

      this.showResults.set(true);
      this.getResults();
    }
  }

  ngOnDestroy() {
    this.quickQuizService.clearResultView();
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
