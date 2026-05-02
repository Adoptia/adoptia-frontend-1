import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-split-card',
  imports: [],
  templateUrl: './split-card.html',
  styleUrl: './split-card.css',
})
export class SplitCard {

  icon = input<undefined|string>(undefined)
  backgroundImage = input.required<string>()

}
