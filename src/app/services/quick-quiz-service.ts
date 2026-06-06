import {computed, inject, Injectable, signal} from '@angular/core';
import {QuizCardData, UserQuickQuizData} from '../webservices/contract';
import {quickQuizDataMock} from '../webservices/quickQuizDataMock';
import {AuthService} from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class QuickQuizService {

  private _mock = quickQuizDataMock

  private authService = inject(AuthService)

  private _score = signal(0)
  private _currentIndex = signal(0);
  private _quizCardData = signal<QuizCardData>(this._mock[0])

  score = this._score.asReadonly()
  private _species = signal<string | undefined>(undefined)
  private _breed = signal<string | undefined>(undefined)


  quizCardData = this._quizCardData.asReadonly();

  userQuiz = computed<UserQuickQuizData>(() => ({
    type: "quick-quiz",
    isPassed: false,
    score: this._score(),
    seenCards : [],
    species: this._species() ?? "",
    breed: this._breed()
  }))

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
    this._breed.set(breed)
    this._species.set(species)
    this._currentIndex.set(0);
    this._quizCardData.set(this._mock[0]);

    this.authService.createUserTraining(this.userQuiz())

    this.saveState(species, breed);
  }

  resumeQuiz(species: string): QuizState | null {
    const raw = sessionStorage.getItem(this.getStateKey(species));
    if (!raw) return null;
    const state: QuizState = JSON.parse(raw);

    this._currentIndex.set(state.currentIndex);
    this._score.set(state.score);
    this._quizCardData.set(this._mock[state.currentIndex]);

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
      setTimeout(() => this._quizCardData.set(this._mock[nextIndex]), 3000);

      this.authService.updateUserTraining(this.userQuiz())
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
