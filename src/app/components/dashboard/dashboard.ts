import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {NavBarService} from "../../services/nav-bar-service";
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
  protected activeTab = signal<TabEnum>('parcours');

  protected user = this.authService.currentUser;

  protected showTrainingPaths = signal(false);

  setTab(tab: TabEnum) {
    this.activeTab.set(tab);
    window.scrollTo({ top: 0 });
  }

  toggleShowTrainingPaths = () => {
    this.showTrainingPaths.update(v => !v);
  }


  constructor() {
  }

}

type TabEnum = 'parcours' | 'adoptions' | 'profil'
