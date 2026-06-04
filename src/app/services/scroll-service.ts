import {inject, Service} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {filter} from 'rxjs';

@Service()
export class ScrollService {
  private router = inject((Router))

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart)
    ).subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }

}
