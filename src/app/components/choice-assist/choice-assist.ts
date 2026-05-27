import {Component, inject} from '@angular/core';
import {navBarLinks, NavBarService} from '../../services/nav-bar-service';

@Component({
  selector: 'app-choice-assist',
  imports: [],
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
