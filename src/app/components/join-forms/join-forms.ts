import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {NavBarService} from '../../services/nav-bar-service';
import {Unavailable} from '../unavailable/unavailable';

@Component({
  selector: 'app-join-forms',
  imports: [
    Unavailable
  ],
  templateUrl: './join-forms.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './join-forms.css',
})
export class JoinForms {

  private navBarService = inject(NavBarService)

  constructor() {
  }

}
