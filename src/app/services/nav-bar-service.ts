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

export type NavBarLink = {
  label: string,
  pathURL?: string,
  fragment?: string
}
