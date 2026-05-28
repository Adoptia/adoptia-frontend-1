import {Component, computed, input, output, signal, ChangeDetectionStrategy} from '@angular/core';
import {Answer, QuickQuizData} from '../../../services/quick-quiz-service';
import {Button} from 'primeng/button';
import {NgClass} from '@angular/common';

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
export class QuickQuizCard {

  data = input.required<QuickQuizData>()
  cardSubmitted = output<Answer[]>()

  selectedAnswers = signal<Answer[]>([])
  isCardSubmitted = signal(false)

  emptyAnswer = computed(() => this.selectedAnswers().length === 0)

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
    this.isCardSubmitted.set(true)

    setTimeout(() => {
      this.isCardSubmitted.set(false)
      this.selectedAnswers.set([])
    }, 3200)

    setTimeout(() => this.cardSubmitted.emit(this.selectedAnswers()), 3000)
  }

}
