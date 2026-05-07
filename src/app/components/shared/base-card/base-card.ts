import {Component, input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-base-card',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './base-card.html',
  styleUrl: './base-card.css',
})
export class BaseCard {
  borderSize = input<string | undefined>(undefined);
  borderColor = input<string | undefined>(undefined);
  backgroundImage = input<string | undefined>(undefined);
  backgroundBlur = input<boolean>(false);
  backgroundImageHaze = input<boolean>(false);
  backgroundColor = input<string | undefined>(undefined);
}
