import {Component, inject} from '@angular/core';
import {navBarLinks, NavBarService} from '../../services/nav-bar-service';

@Component({
  selector: 'app-join-forms',
  imports: [],
  templateUrl: './join-forms.html',
  styleUrl: './join-forms.css',
})
export class JoinForms {

  private navBarService = inject(NavBarService)

  constructor() {
    this.navBarService.links.set([
      navBarLinks['contact']!,
      navBarLinks['goal']!,
    ])
  }

}
