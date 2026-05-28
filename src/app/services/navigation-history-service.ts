import {inject, Injectable, signal} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class NavigationHistoryService {
  private router = inject(Router);

  previousUrl = signal<string | null>(null);
  currentUrl = signal<string | null>(null);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.previousUrl.set(this.currentUrl());
      this.currentUrl.set(this.router.url);
    });
  }

  goBack() {
    const prev = this.previousUrl()
    prev === null ? this.router.navigate(['/']) : this.router.navigateByUrl(prev)
  }
}
