import {Component, input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  borderSize = input<string | undefined>(undefined);
  borderColor = input<string | undefined>(undefined);
  backgroundImage = input<string>('');
  backgroundBlur = input<number>(0);
}
