import {Component, computed, input} from '@angular/core';
import {UserTraining} from '../../webservices/contract';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {Carousel} from 'primeng/carousel';

@Component({
  selector: 'user-training-paths',
  imports: [
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    Carousel
  ],
  templateUrl: './user-training-paths.html',
  styleUrl: './user-training-paths.css',
})
export class UserTrainingPaths {

  trainings = input<UserTraining[]>([])

  quickQuizzes = computed(() => this.trainings().filter(t => t.type === 'quick-quiz'))
  learnings = computed(() => this.trainings().filter(t => t.type === 'learn'))
  choiceAssists = computed(() => this.trainings().filter(t => t.type === 'choice-assist'))


  carouselResponsiveOptions = [
    { breakpoint: '1920px', numVisible: 3, numScroll: 1 },
    { breakpoint: '1280px', numVisible: 2, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 },
  ];

}
