import {Component, computed, HostListener, inject, input, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {NgClass} from '@angular/common';
import {NavBarService} from '../../services/nav-bar-service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [
    Button,
    NgClass,
    RouterLink
  ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {

  scrollTimeout: any;

  private navBarService = inject(NavBarService);

  isScreenStill = signal(true);
  isScreenScrolled = signal(false)

  isScrolling = computed(() =>
    this.isScreenScrolled() && !this.isScreenStill()
  )

  isScrolledAndStill = computed(() =>
    this.isScreenScrolled() && this.isScreenStill()
  )

  logo = this.navBarService.logo;
  links = this.navBarService.links;

  @HostListener('window:scroll')
  onScroll() {
    this.isScreenScrolled.set(window.scrollY > 25)
    this.isScreenStill.set(false)

    clearTimeout(this.scrollTimeout)
    this.scrollTimeout = setTimeout(() => {
      this.isScreenStill.set(true)
    }, 1000)
  }

  burgerMenuIcon = this.navBarService.burgerMenuIcon
  isBurgerMenuOpen = this.navBarService.isBurgerMenuOpen

  protected toggleBurgerMenu() {

    this.navBarService.toggleBurgerMenuIcon();
    this.isBurgerMenuOpen.update(s => !s);

    // Prevents scrolling when the burger menu is open
    document.body.classList.toggle('overflow-hidden');
  }
}
