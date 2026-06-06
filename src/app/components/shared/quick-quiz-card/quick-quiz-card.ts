import {Component, computed, input, output, signal, ChangeDetectionStrategy, effect, OnDestroy} from '@angular/core';
import {Button} from 'primeng/button';
import {NgClass} from '@angular/common';
import {Answer, QuizCardData} from '../../../webservices/contract';

@Component({
  selector: 'app-quick-quiz-card',
  imports: [
    Button,
    NgClass
  ],
  templateUrl: './quick-quiz-card.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './quick-quiz-card.css',
})
export class QuickQuizCard implements OnDestroy {

  private _feedbackTime = 3000
  private _submitTimeout: ReturnType<typeof setTimeout> | null = null;

  data = input.required<QuizCardData>()
  cardSubmitted = output<Answer[]>()
  feedbackDone = output<void>()

  timeLeft = signal<number | null>(null)
  private _timerInterval: ReturnType<typeof setInterval> | null = null;

  selectedAnswers = signal<Answer[]>([])
  isCardSubmitted = signal(false)

  emptyAnswer = computed(() => this.selectedAnswers().length === 0)

  constructor() {
    effect(() => {
      const limit = this.data().timeLimitSeconds;
      this.resetTimer();
      if (limit) {
        this.timeLeft.set(limit);
        this._timerInterval = setInterval(() => {
          this.timeLeft.update(t => {
            if (t === null || t <= 0) return 0;
            return t - 1;
          });
          if (this.timeLeft() === 0) {
            this.resetTimer();
            this.submitCard();
          }
        }, 1000);
      }
    });
  }

  private resetCard() {
    this.isCardSubmitted.set(false);
    this.selectedAnswers.set([]);
  }

  private resetTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
    this.timeLeft.set(null);
  }

  answerIsSelected(answer: Answer) {
    return this.selectedAnswers().includes(answer)
  }

  toggleSelectAnswer(answer: Answer) {

    if (this.isCardSubmitted())
      return;

    const answers = this.selectedAnswers();
    const hasMultiple = this.data().multipleCorrectAnswers;

    if (!hasMultiple) {
      answers.includes(answer)
        ? this.selectedAnswers.set([])
        : this.selectedAnswers.set([answer])
      return;
    }

    answers.includes(answer)
      ? this.selectedAnswers.set(answers.filter(a => a !== answer))
      : this.selectedAnswers.set([...answers, answer])

  }

  submitCard() {
    this.resetTimer();
    this.isCardSubmitted.set(true)
    this.cardSubmitted.emit(this.selectedAnswers())
    this._submitTimeout = setTimeout(() => this.resetCard(), this._feedbackTime)
  }

  ngOnDestroy() {
    this.resetTimer();
    if (this._submitTimeout) {
      clearTimeout(this._submitTimeout);
      this._submitTimeout = null;
    }
  }

}
