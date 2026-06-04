import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {NavBarService} from '../../services/nav-bar-service';
import {Unavailable} from '../unavailable/unavailable';

@Component({
  selector: 'app-choice-assist',
  imports: [
    Unavailable
  ],
  templateUrl: './choice-assist.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './choice-assist.css',
})
export class ChoiceAssist {

  private navBarService = inject(NavBarService);

  constructor() {
  }

}
