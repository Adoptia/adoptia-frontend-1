import { Routes } from '@angular/router';
import {Home} from './components/home/home';
import {QuickQuiz} from './components/quick-quiz/quick-quiz';
import {ChoiceAssist} from './components/choice-assist/choice-assist';
import {Learn} from './components/learn/learn';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Accueil',
  },
  {
    path: 'quick-quiz',
    component: QuickQuiz,
    title: 'Quiz de validation rapide',
  },
  {
    path: 'choice-assist',
    component: ChoiceAssist,
    title: 'Assistance au choix',
  },
  {
    path: 'learn',
    component: Learn,
    title: 'Je me forme pour mieux adopter',
  },
  {
    path:'**',
    redirectTo: ''
  }
];
