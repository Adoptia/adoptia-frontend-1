import {Component, computed, inject, input} from '@angular/core';
import {UserTraining} from '../../webservices/contract';
import {Carousel} from 'primeng/carousel';
import {Router} from '@angular/router';

@Component({
  selector: 'user-trainings',
  imports: [
    Carousel
  ],
  templateUrl: './user-trainings.html',
  styleUrl: './user-trainings.css',
})
export class UserTrainings {

  private router = inject(Router)

  trainings = input<UserTraining[]>([])

  quickQuizzes = computed(() => this.trainings().filter(t => t.type === 'quick-quiz'))
  learnings = computed(() => this.trainings().filter(t => t.type === 'learn'))
  choiceAssists = computed(() => this.trainings().filter(t => t.type === 'choice-assist'))


  carouselResponsiveOptions = [
    { breakpoint: '1920px', numVisible: 2, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 },
  ];


  protected openQuickQuiz(species: string, breed: string | null = null) {
    this.router.navigate(['/quick-quiz'], {
      queryParams: { species, breed }
    })
  }
}
