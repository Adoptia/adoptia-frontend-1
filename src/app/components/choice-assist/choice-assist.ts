import {Component, inject} from '@angular/core';
import {NavBarService} from '../../services/nav-bar-service';

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
      { label: 'Contact', fragment: 'contact' },
      { label: 'Se former', pathURL: 'learn' },
      { label: 'Quiz rapide', pathURL: 'quick-quiz' },
    ])
  }

}
