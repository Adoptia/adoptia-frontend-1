import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {NavBar} from './components/nav-bar/nav-bar';
import {filter} from 'rxjs';
import {AuthService} from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [NavBar, RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal("Prêt'Adopte");

  protected showNavBar = signal(true);

  private authService = inject(AuthService);

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const root = this.activatedRoute.snapshot.firstChild;
        this.showNavBar.set( root?.data?.['showNavBar'] ?? true );
      });
  }

  ngOnInit() {
    this.authService.getCurrentUserFromLocalStorage()
  }

}
