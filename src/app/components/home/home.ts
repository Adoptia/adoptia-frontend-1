import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {interval} from 'rxjs';
import {Button} from 'primeng/button';
import {BaseCard} from '../shared/base-card/base-card';
import {Router, RouterLink} from '@angular/router';
import {NavBarService} from '../../services/nav-bar-service';
import {Location} from '@angular/common';
import {TrainingPaths} from '../training-paths/training-paths';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-home',
  imports: [
    Button,
    BaseCard,
    RouterLink,
    TrainingPaths,
  ],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.css',

})
export class Home implements OnInit, OnDestroy {

  private observer!: IntersectionObserver;
  private router = inject(Router);
  private location = inject(Location);
  private navBarService = inject(NavBarService);
  private authService = inject(AuthService)

  protected headerBackground = 'images/hp-header-bg.jpg';
  protected partnersBackground = 'images/partners-bg.jpg';
  protected statsCardBackground = 'images/hp-stats-card-bg.jpg';
  protected goalCardBackground = 'images/goal-card-bg.jpg';

  protected readonly benefits = BENEFITS

  protected readonly stats = STATS

  protected readonly messages = signal<string[]>(MESSAGES);

  protected readonly certifCardData = CERTIF_CARD_DATA

  animateFlag = signal(true);

  messageIndex = signal<number>(0);

  protected isAuthenticated = this.authService.isAuthenticated

  constructor() {
  }

  ngOnInit() {

    interval(4000).subscribe(() => {
      this.animateFlag.update(v => !v);
      setTimeout(() => this.animateFlag.update(v => !v), 200);
      setTimeout(() => this.messageIndex.update(i => (i + 1) % this.messages().length));
    })


    const sections = document.querySelectorAll('section[id], header[id]')

    this.observer = new IntersectionObserver((entries) => {

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fragment = entry.target.id === 'home' ? '' : `#${entry.target.id}`;
          this.location.replaceState(this.location.path().split('#')[0] + fragment);
        }
      })
    }, { threshold: 0.5 })

    sections.forEach(section => this.observer.observe(section));

  }

  ngOnDestroy() {

  }

}



const MESSAGES = [
  'Changez une vie',
  'Adoptez en toute\nconfiance',
  'Devenez un adoptant\nresponsable',
]

const BENEFITS = [
  'Formation interactive et certifiante',
  'Parcours personnalisé adapté\nà votre situation',
  'Réseau de refuges et éleveurs\nresponsables partenaires'
]

const STATS = [
  { icon: 'icons/decreasing.png',
    figure: '100 000+',
    details: 'abandons annuels en France'
  },
  {
    icon: 'icons/awareness.png',
    figure: '80%',
    details: 'dûs à un manque de préparation'
  },
  {
    icon: 'icons/certificate.png',
    figure: '100%',
    details: 'évitables avec Prêt\'Adopte'
  }
]

const CERTIF_CARD_DATA = {
  backgroundImage: 'images/hp-certif-card-bg.jpg',
  title: "Certification Prêt'Adopte",
  body: "À l'issue de chaque parcours, vous obtenez un certificat d'adoptant " +
    "responsable reconnu par nos refuges et éleveurs partenaires",
  footer: 'Score minimum requis : 80%'
}
