import {Component, input, signal} from '@angular/core';
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

  logo = signal<string>('app-logo.png')

  links = signal<NavBarLink[]>([
    { label: 'Nos parcours', description: '...' },
    { label: 'Explorer nos partenaires', description: '...' },
    { label: 'Notre objectif', description: '...' },
  ])

}

export type NavBarLink = {
  label: string;
  description: string;
}
