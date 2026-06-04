import {ChangeDetectionStrategy, Component, computed, HostListener, inject, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {NgClass} from '@angular/common';
import {NavBarLink, NavBarService} from '../../services/nav-bar-service';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-nav-bar',
  imports: [
    Button,
    NgClass,
    RouterLink
  ],
  templateUrl: './nav-bar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './nav-bar.css',
})
export class NavBar {

  scrollTimeout: any;

  private router = inject(Router);
  private authService = inject(AuthService);
  private navBarService = inject(NavBarService);

  protected logout = () => {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  protected goBackToHomePage() {
    if (this.router.url === '/') {
      document.getElementById('home')
        ?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/']);
    }
  }

  protected navigateToLink(link: NavBarLink) {
    if (link.fragmentId) {
      const targetUrl = '/' + (link.pathURL ?? '');

      if (this.router.url === targetUrl) {
        document.getElementById(link.fragmentId)
          ?.scrollIntoView({ behavior: 'smooth' });
      } else {
        this.router.navigate([link.pathURL ?? '']).then(() => {
          setTimeout(() => {
            document.getElementById(link.fragmentId!)
              ?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
      }
    } else {
      this.router.navigate([link.pathURL ?? '']);
    }
  }

  activeConfig = this.navBarService.activeConfig;

  isStill = signal(true);
  isScrolled = signal(false)

  isScrolling = computed(() =>
    this.isScrolled() && !this.isStill()
  )

  logo = this.navBarService.logo;
  links = this.navBarService.links;

  navClasses = computed(() => {
    const config = this.activeConfig();

    if (this.isBurgerMenuOpen()) {
      return config.onBurgerMenuOpen ?? '';
    }
    if (this.isScrolling()) {
      return config.onScrolling ?? '';
    }
    if (this.isScrolled()) {
      return config.onScrolled ?? '';
    }
    return config.onNotScrolled ?? '';
  });

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 25)
    this.isStill.set(false)

    clearTimeout(this.scrollTimeout)
    this.scrollTimeout = setTimeout(() => {
      this.isStill.set(true)
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
