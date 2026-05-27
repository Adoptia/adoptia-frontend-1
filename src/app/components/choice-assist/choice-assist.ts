import {Component, inject} from '@angular/core';
import {navBarLinks, NavBarService} from '../../services/nav-bar-service';
import {Unavailable} from '../unavailable/unavailable';

@Component({
  selector: 'app-choice-assist',
  imports: [
    Unavailable
  ],
  templateUrl: './choice-assist.html',
  styleUrl: './choice-assist.css',
})
export class ChoiceAssist {

  private navBarService = inject(NavBarService);

  constructor() {
    this.navBarService.links.set([
      navBarLinks['contact']!,
      navBarLinks['learn']!,
      navBarLinks['quick-quiz']!
    ])
  }

}
