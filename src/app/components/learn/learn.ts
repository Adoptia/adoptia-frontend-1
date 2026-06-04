import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {SplitCard} from '../shared/split-card/split-card';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {animals} from '../quick-quiz/quick-quiz';
import {interval} from 'rxjs';
import {NavBarService} from '../../services/nav-bar-service';

@Component({
  selector: 'app-learn',
  imports: [
    SplitCard,
    Button,
    Select,
    FormsModule
  ],
  templateUrl: './learn.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './learn.css',
})
export class Learn {

  private navBarService = inject(NavBarService);

  protected headerBackground = 'images/learn-header-bg.jpg';

  messages = signal<string[]>(MESSAGES)

  animateFlag = signal(true);

  messageIndex = signal<number>(0);

  constructor() {

  }

  protected readonly topics = TOPICS;

  species: string[] = animals.map(a => a.species)

  breeds = computed(() =>
    animals.find(a => a.species === this.selectedSpecies())?.breeds ?? []
  );

  selectedSpecies = signal<string>(animals[0].species)

  selectedBreed = signal<string | undefined>(undefined)

  choiceSubmitted = signal(false)

  submitChoice() {
    this.choiceSubmitted.set(true)
    this.startMessageSlideshow()
  }

  startMessageSlideshow() {
    interval(7000).subscribe(() => {
      this.animateFlag.update(v => !v);
      setTimeout(() => this.animateFlag.update(v => !v), 200);
      setTimeout(() => this.messageIndex.update(i => (i + 1) % this.messages().length));
    });
  }

}

export type Topic = {
  name: string,
  icon: string,
  required: boolean,
  background: string,
  description: string,
}

export const LEARN_NAV_LINKS = [
  { label: 'Contact', fragment: 'contact' },
  { label: 'Quiz rapide', pathURL: 'quick-quiz' },
  { label: 'Aide au choix', pathURL: 'choice-assist' },
]


export const TOPICS: Topic[] = [
  {
    required: true,
    name: 'Foyer et vie quotidienne',
    icon: 'pi pi-home',
    background: 'images/learn-daily-sc-bg.jpg',
    description: 'Découvrez comment aménager votre foyer pour accueillir votre futur compagnon, ' +
      'les activités à partager, les voyages possibles, la garde en cas d’absence et la budget à prévoir.'
  },
  {
    required: true,
    name: 'Alimentation et santé',
    icon: 'pi pi-shopping-cart',
    background: 'images/learn-food-sc-bg.jpg',
    description: 'Informez-vous sur les besoins alimentaires de votre animal, les soins vétérinaires nécessaires'
  },
  {
    required: true,
    name: 'Bien-être et comportement',
    icon: 'pi pi-face-smile',
    background: 'images/learn-wellbeing-sc-bg.jpg',
    description: 'Apprenez à comprendre le langage corporel de votre animal, à reconnaître les signes de stress ' +
      'à le stimuler mentalement et à satisfaire ses besoins de socialisation.'
  },
  {
    required: true,
    name: 'Responsabilités légales',
    icon: 'pi pi-verified',
    background: 'images/lean-laws-sc-bg.jpg',
    description: 'Découvrez les conséquences de l\'abandon, les obligations légales liées à la possession ' +
      'd\'un animal de compagnie l\'importance de l\'identification et les assurances possibles.'
  },
  {
    required: false,
    icon: 'pi pi-lightbulb',
    name: 'Connaissances spécifiques',
    background: 'images/learn-specif-sc-bg.jpg',
    description: 'Apprenez-en plus sur ses besoins. Obligatoire pour certaines races. ' +
      'Le choix de la race est nécessaire.'
  }
]

export const countTopics = () => TOPICS.length;

export const countRequiredTopics = () => TOPICS.filter(t => t.required).length;

export const MESSAGES = [
  "Bienvenue dans votre parcours\nde formation pour devenir\nun adoptant responsable !",
  "À l'issue de ce parcours,\nvous serez prêt à accueillir votre\n animal " +
  "dans les meilleures\nconditions possibles",
  "Une formation complète à travers\n" + countTopics() + " thématiques clés " +
  "pour préparer\nau mieux votre adoption",
  "Avec " + countRequiredTopics() + " thématiques obligatoires\npour obtenir votre certificat",
  "La dernière thématique \nest optionnelle, sauf \npour certaines races"
]
