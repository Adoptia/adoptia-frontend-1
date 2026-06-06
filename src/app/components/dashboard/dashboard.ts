import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {NavBarService} from "../../services/nav-bar-service";
import {AuthService} from '../../services/auth-service';
import {FormsModule} from '@angular/forms';
import {UserProfile} from '../user-profile/user-profile';
import {Button} from 'primeng/button';
import {TrainingsLauncher} from '../trainings-launcher/trainings-launcher';
import {UserTrainings} from '../user-trainings/user-trainings';
import {QuickQuizService} from '../../services/quick-quiz-service';

@Component({
  selector: 'dashboard',
  imports: [
    FormsModule,
    UserProfile,
    Button,
    TrainingsLauncher,
    UserTrainings
  ],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private authService = inject(AuthService)
  private navBarService = inject(NavBarService)
  private quickQuizService = inject(QuickQuizService)

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
