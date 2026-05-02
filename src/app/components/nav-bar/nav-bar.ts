import {Component, HostListener, input, signal} from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-nav-bar',
  imports: [
    Button
  ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {

  isScrolled = signal(false)

  logo = signal<string>('app-logo.png')

  links = signal<NavBarLink[]>([
    { label: 'Nos parcours', description: '...' },
    { label: 'Explorer nos partenaires', description: '...' },
    { label: 'Notre objectif', description: '...' },
  ])

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 0)
  }

}

export type NavBarLink = {
  label: string;
  description: string;
}
