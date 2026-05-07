import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavBarService {

  links = signal<NavBarLink[]>([])

  logo = signal<string>('images/app-logo.png')

  iconWhenClosed = 'pi pi-bars'
  iconWhenOpen = 'pi pi-times'

  burgerMenuIcon = signal<string>(this.iconWhenClosed);

  isBurgerMenuOpen = signal(false);

  toggleBurgerMenuIcon() {
    this.burgerMenuIcon.set(
      this.burgerMenuIcon() === this.iconWhenClosed ?
        this.iconWhenOpen : this.iconWhenClosed
    );
  }

}


type NavBarKey = 'quick-quiz' | 'learn'
  | 'choice-assist' | 'contact' | 'goal' | 'join-us';


type NavBarLink = {
  label: string,
  pathURL?: string,
  fragment?: string
}


export const navBarLinks: Partial<Record<NavBarKey, NavBarLink>> = {
  'learn': { label: 'Se former', pathURL: 'learn' },
  'quick-quiz': { label: 'Quiz rapide', pathURL: 'quick-quiz' },
  'choice-assist': { label: 'Aide au choix', pathURL: 'choice-assist' },
  'join-us': { label: 'Nous rejoindre', pathURL: 'join-us' },
  'goal': { label: 'Notre objectif', fragment: 'goal' },
  'contact': { label: 'Contact', fragment: 'contact' },
}
