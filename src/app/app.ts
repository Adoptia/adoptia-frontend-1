import { Component, signal } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {NavBar} from './components/nav-bar/nav-bar';
import {Home} from './components/home/home';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [NavBar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('adoptia-frontend');

  protected showNavBar = signal(true);

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const root = this.activatedRoute.snapshot.firstChild;
        this.showNavBar.set( root?.data?.['showNavBar'] ?? true );
      });
  }

}
