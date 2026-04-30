import {Component, input} from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [
  ],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {

  backgroundImage = input<string>('');
  backgroundBlur = input<number>(0);

}
