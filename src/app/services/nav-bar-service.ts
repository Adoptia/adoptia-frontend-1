import {computed, inject, Injectable, signal} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavBarService {

  private router = inject(Router)

  _activeConfig = signal<NavBarConfig>(defaultConfig);
  activeConfig = this._activeConfig.asReadonly();

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      const url = e.urlAfterRedirects;
      const config = routeConfigs[url]
        ?? Object.entries(routeConfigs).find(([k]) => url.startsWith(k + '/'))?.[1]
        ?? defaultConfig;
      this._activeConfig.set(config);
    });
  }

  links = computed(() => (this._activeConfig().links ?? [])
      .map(key => navBarLinks[key])
      .filter(Boolean) as NavBarLink[]
  );

  logo = signal<string>('images/app-logo.png')

  iconMenuOpen = 'pi pi-times'
  iconMenuClosed = 'pi pi-bars'
  isBurgerMenuOpen = signal(false);
  burgerMenuIcon = signal<string>(this.iconMenuClosed);

  toggleBurgerMenuIcon() {
    this.burgerMenuIcon.set(
      this.burgerMenuIcon() === this.iconMenuClosed ?
        this.iconMenuOpen : this.iconMenuClosed
    );
  }

}


export type NavBarLink = { label: string, pathURL?: string, fragmentId?: string }

type NavBarKey = 'quick-quiz' | 'learn' | 'choice-assist' | 'contact' | 'goals' | 'join-us' | 'catalog';

export type NavBarConfig = {
  links?: NavBarKey[];
  onScrolled?: string;
  onScrolling?: string;
  onNotScrolled?: string;
  onBurgerMenuOpen?: string;
  showLogoutButton?: boolean;
  showDashboardButton?: boolean;
}

const defaultConfig: NavBarConfig = {
  showDashboardButton: true,
  showLogoutButton: false,
  onBurgerMenuOpen: '',
  onNotScrolled: 'bg-transparent',
  onScrolling: 'bg-gray-700/50 backdrop-blur-sm',
  onScrolled: 'bg-gray-800/50 backdrop-blur-xl',
  links: ['catalog', 'contact', 'goals', 'join-us'],
};

const routeConfigs: Partial<Record<string, NavBarConfig>> = {
  '/dashboard': {
    ...defaultConfig,
    onNotScrolled: 'bg-gray-800',
    onScrolled: 'bg-gray-800',
    onScrolling: 'bg-gray-800',
    showDashboardButton: false,
    showLogoutButton: true,
    links: ['join-us']
  },
  '/choice-assist': {
    ...defaultConfig,
    onNotScrolled: 'bg-gray-800',
    onScrolled: 'bg-gray-800',
    onScrolling: 'bg-gray-800',
    showDashboardButton: false,
    showLogoutButton: true,
    links: ['join-us']
  },
  '/catalog': {
    ...defaultConfig,
    onNotScrolled: 'bg-gray-800',
    onScrolled: 'bg-gray-800',
    onScrolling: 'bg-gray-800',
    showDashboardButton: true,
    showLogoutButton: false,
    links: ['contact', 'goals', 'join-us', 'catalog'],
  },
};

const navBarLinks: Partial<Record<NavBarKey, NavBarLink>> = {
  'catalog': { label: 'Adopter', pathURL: 'catalog' },
  'learn': { label: 'Se former', pathURL: 'learn' },
  'quick-quiz': { label: 'Quiz rapide', pathURL: 'quick-quiz' },
  'choice-assist': { label: 'Aide au choix', pathURL: 'choice-assist' },
  'join-us': { label: 'Nous rejoindre', pathURL: 'join-us' },
  'goals': { label: 'Objectifs', pathURL: '', fragmentId: 'goals' },
  'contact': { label: 'Contact', pathURL: '', fragmentId: 'contact' },
}
