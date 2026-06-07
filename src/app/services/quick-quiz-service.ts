import {computed, inject, Injectable, signal} from '@angular/core';
import {QuizCardData, UserQuickQuizData, UserTraining} from '../webservices/contract';
import {quickQuizDataMock} from '../webservices/quickQuizDataMock';
import {AuthService} from './auth-service';
import {generateId} from '../utils/uuid.utils';
import {QuickQuiz} from '../components/quick-quiz/quick-quiz';

@Injectable({
  providedIn: 'root',
})
export class QuickQuizService {

  private _mock = quickQuizDataMock

  private feedbackTime = 1500

  private _score = signal(0)
  score = this._score.asReadonly()

  private _quizId = signal<string>('')

  private _currentIndex = signal(0);

  private _isQuizDone = signal<boolean>(false);
  isQuizDone = this._isQuizDone.asReadonly()

  private _quizCardData = signal<QuizCardData>(this._mock[0])
  quizCardData = this._quizCardData.asReadonly()

  private _seenCardsIds = signal<string[]>([])
  private _species = signal<string | undefined>(undefined)
  private _breed = signal<string | null>(null)

  userQuiz = computed<UserQuickQuizData>(() => ({
    id: this._quizId(),
    type: "quick-quiz",
    isDone: this._isQuizDone(),
    score: this._score(),
    seenCardsIds : this._seenCardsIds(),
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

  persistResultView() {
    sessionStorage.setItem(this._UI_KEY, JSON.stringify({
      score: this._score(), species: this._species(), breed: this._breed()
    }))
  }

  restoreResultView(): { species: string, breed: string | null } | null {
    const restore = sessionStorage.getItem(this._UI_KEY);

    if (restore) {
      const { score, ...rest } = JSON.parse(restore)
      this._score.set(score);
      return { ...rest }
    }

    return null;
  }

  clearResultView() {
    sessionStorage.removeItem(this._UI_KEY);
  }

  initQuiz(species: string, breed: string | null, onCreate: (t: UserTraining) => void) {
    this.initScore()
    this._breed.set(breed)
    this._species.set(species)
    this._currentIndex.set(0);
    this._quizCardData.set(this._mock[0]);
    this._seenCardsIds.set([this._quizCardData().id])
    this._quizId.set(generateId())

    onCreate(this.userQuiz())

    this.saveState();
  }

  resumeQuiz(species: string): QuizState | null {
    const raw = sessionStorage.getItem(this.getStateKey(species));
    if (!raw) return null;
    const state: QuizState = JSON.parse(raw);

    this._quizId.set(state.quizId)
    this._currentIndex.set(state.currentIndex);
    this._species.set(state.species)
    this._breed.set(state.breed)
    this._score.set(state.score);
    this._quizCardData.set(this._mock[state.currentIndex]);

    return state;
  }

  endQuiz(onDelete: (t: UserTraining) => void) {
    this.persistResultView();

    setTimeout(() => {
      this._isQuizDone.set(true)
      onDelete(this.userQuiz())
    }, this.feedbackTime);

    if (this._score() >= 80) this.getCertificate()

    this.clearState();
  }

  getCertificate() {
    console.log('Vous avez reçu un certificat')
  }

  saveState() {
    const state: QuizState = { score: this._score(), species: this._species()!,
      breed: this._breed(), currentIndex: this._currentIndex(), quizId: this._quizId()
    }
    sessionStorage.setItem(this.getStateKey(this._species()!), JSON.stringify(state));
  }

  restoreState(quiz: UserQuickQuizData) {
    const state: QuizState = { quizId: quiz.id, score: quiz.score, species: quiz.species,
      breed: quiz.breed, currentIndex: quiz.seenCardsIds.length - 1
    }
    sessionStorage.setItem(this.getStateKey(quiz.species), JSON.stringify(state));
  }

  clearState() {
    sessionStorage.removeItem(this.getStateKey(this._species()!));
  }

  hasSavedState(species: string, breed: string | null): boolean {
    const savedState = sessionStorage.getItem(this.getStateKey(species));
    if (!savedState) return false;
    const state: QuizState = JSON.parse(savedState);
    return state.breed === breed;
  }

  private getStateKey(species: string): string {
    return `quizState_${species}`;
  }

  hasNext = computed(() => this._currentIndex() + 1 < this._mock.length)

  getNextQuiz(onUpdate: (t: UserTraining) => void) {
    if (this.hasNext()) {
      const nextIndex = this._currentIndex() + 1;
      this._currentIndex.set(nextIndex);

      setTimeout(() => {
        this._quizCardData.set(this._mock[nextIndex])
        this._seenCardsIds.update(ids => [...ids, this._quizCardData().id])
        onUpdate(this.userQuiz());
      }, this.feedbackTime);

      this.saveState();
    }
  }

}

export type QuizState = {
  quizId: string;
  currentIndex: number;
  score: number;
  species: string;
  breed: string | null;
}
