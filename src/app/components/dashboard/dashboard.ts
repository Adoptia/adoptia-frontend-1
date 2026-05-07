import { Component, inject } from '@angular/core';
import {navBarLinks, NavBarService} from "../../services/nav-bar-service";

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private navBarService = inject(NavBarService);


  constructor() {
    this.navBarService.links.set([
      navBarLinks['quick-quiz']!,
      navBarLinks['learn']!,
      navBarLinks["choice-assist"]!
    ])
  }

}
