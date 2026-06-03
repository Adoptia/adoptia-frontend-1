import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {navBarLinks, NavBarService} from "../../services/nav-bar-service";
import {AuthService} from '../../services/auth-service';
import {RadioButton} from 'primeng/radiobutton';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [
    RadioButton,
    FormsModule
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

  protected avecBalcon = false;
  protected avecJardin = false;
  protected enCouple = false;
  protected habitantEnsemble = false;


  constructor() {
    this.navBarService.links.set([
      navBarLinks['quick-quiz']!,
      navBarLinks['learn']!,
      navBarLinks["choice-assist"]!
    ])
  }

}
