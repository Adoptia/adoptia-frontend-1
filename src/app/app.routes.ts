import { Routes } from '@angular/router';
import {Home} from './components/home/home';
import {QuickQuiz} from './components/quick-quiz/quick-quiz';
import {ChoiceAssist} from './components/choice-assist/choice-assist';
import {Learn} from './components/learn/learn';
import {authGuard} from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Accueil',
  },
  {
    path: 'quick-quiz',
    component: QuickQuiz,
    canActivate: [authGuard],
    title: 'Quiz de validation rapide',
  },
  {
    path: 'choice-assist',
    component: ChoiceAssist,
    canActivate: [authGuard],
    title: 'Assistance au choix',
  },
  {
    path: 'learn',
    component: Learn,
    canActivate: [authGuard],
    title: 'Se former pour mieux adopter',
  },
  {
    path: 'dashboard',
    title: 'Tableau de bord',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'join-us',
    title: 'Nous rejoindre',
    loadComponent: () =>
      import('./components/join-forms/join-forms').then(m => m.JoinForms),
  },
  {
    path: 'auth',
    title: 'Authentification',
    data: { showNavBar: false },
    loadComponent: () =>
      import('./components/auth/auth').then(m => m.Auth)
  },
  {
    path:'**',
    redirectTo: ''
  }
];
