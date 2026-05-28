import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {navBarLinks, NavBarService} from "../../services/nav-bar-service";
import {Unavailable} from "../unavailable/unavailable";
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-dashboard',
    imports: [
        Unavailable
    ],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private authService = inject(AuthService)
  private navBarService = inject(NavBarService)

  protected user = this.authService.currentUser;

  constructor() {
    this.navBarService.links.set([
      navBarLinks['quick-quiz']!,
      navBarLinks['learn']!,
      navBarLinks["choice-assist"]!
    ])
  }

}
