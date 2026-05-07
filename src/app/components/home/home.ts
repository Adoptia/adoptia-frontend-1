import {Component, inject, OnInit, signal} from '@angular/core';
import {interval} from 'rxjs';
import {Button} from 'primeng/button';
import {BaseCard} from '../shared/base-card/base-card';
import {SplitCard} from '../shared/split-card/split-card';
import {Router, RouterLink} from '@angular/router';
import {navBarLinks, NavBarService} from '../../services/nav-bar-service';

@Component({
  selector: 'app-home',
  imports: [
    Button,
    BaseCard,
    SplitCard,
    RouterLink,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',

})
export class Home implements OnInit {

  private router = inject(Router);
  private navBarService = inject(NavBarService);

  protected headerBackground = 'images/hp-header-bg.jpg';
  protected partnersBackground = 'images/partners-bg.jpg';
  protected statsCardBackground = 'images/hp-stats-card-bg.jpg';
  protected goalCardBackground = 'images/goal-card-bg.jpg';

  protected navigateToOption(optionPathURL: string) {
    this.router.navigate(['/' + optionPathURL]).then();
  }

  protected readonly benefits = BENEFITS

  protected readonly stats = STATS

  protected readonly options = OPTIONS

  protected readonly messages = signal<string[]>(MESSAGES);

  protected readonly certifCardData = CERTIF_CARD_DATA

  animateFlag = signal(true);

  messageIndex = signal<number>(0);

  constructor() {
    this.navBarService.links.set([
      navBarLinks['contact']!,
      navBarLinks['goal']!,
      navBarLinks['join-us']!,
    ])
  }

  ngOnInit() {
    interval(4000).subscribe(() => {
      this.animateFlag.update(v => !v);
      setTimeout(() => this.animateFlag.update(v => !v), 200);
      setTimeout(() => this.messageIndex.update(i => (i + 1) % this.messages().length));
    });
  }

}


export const OPTIONS = [
  {
    icon: 'pi pi-heart',
    label: 'Quiz rapide',
    pathURL: 'quick-quiz',
    title : 'Je sais ce que je veux',
    backgroundImage: 'images/qq-split-card-bg.jpg',
    description: "Vous connaissez l'animal idéal ? " +
      "Validez vos connaissances avec notre petit quiz personnalisé."
  },
  {
    icon: 'pi pi-key',
    label: 'Aide au choix',
    pathURL: 'choice-assist',
    title : 'Aidez-moi à choisir',
    backgroundImage: 'images/choice-split-card-bg.jpg',
    description: "Grâce à des leçons sur les animaux, découvrez l'animal " +
      "le mieux adapté suivant votre mode de vie."
  },
  {
    icon: 'pi pi-graduation-cap',
    label: 'Se former',
    pathURL: 'learn',
    title : 'Je souhaite me former',
    backgroundImage: 'images/learn-split-card-bg.jpg',
    description: "Suivez notre parcours éducatif immersif et ludique pour " +
      "garantir une adoption réussie et durable."
  }
]



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
    "responsable reconnu par nos refuges et éleveurs partenaires.",
  footer: 'Score minimum requis : 80%'
}
