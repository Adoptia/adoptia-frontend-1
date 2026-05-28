import {Component, input, output, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-split-card',
  imports: [],
  templateUrl: './split-card.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './split-card.css',
})
export class SplitCard {

  icon = input<undefined|string>(undefined)
  backgroundImage = input.required<string>()

}
