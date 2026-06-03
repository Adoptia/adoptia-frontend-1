import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {navBarLinks, NavBarService} from "../../services/nav-bar-service";
import {AuthService} from '../../services/auth-service';
import {FormsModule} from '@angular/forms';
import {UserProfile} from '../user-profile/user-profile';
import {Button} from 'primeng/button';
import {TrainingPaths} from '../training-paths/training-paths';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    UserProfile,
    Button,
    TrainingPaths
  ],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private authService = inject(AuthService)
  private navBarService = inject(NavBarService)
  protected activeTab = signal<'parcours' | 'adoptions' | 'profil'>('profil');

  protected user = this.authService.currentUser;

  protected showTrainingPaths = signal(false);

  toggleShowTrainingPaths = () => {
    this.showTrainingPaths.update(v => !v);
  }


  constructor() {
    this.navBarService.links.set([
      navBarLinks['quick-quiz']!,
      navBarLinks['learn']!,
      navBarLinks["choice-assist"]!
    ])
  }

}
