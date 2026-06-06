import {Component, inject} from '@angular/core';
import {SplitCard} from "../shared/split-card/split-card";
import {Router} from '@angular/router';

@Component({
  selector: 'trainings-launcher',
    imports: [
        SplitCard
    ],
  templateUrl: './trainings-launcher.html',
  styleUrl: './trainings-launcher.css',
})
export class TrainingsLauncher {

  private router = inject(Router)

  protected readonly options = OPTIONS

  protected navigateToOption(optionPathURL: string) {
    this.router.navigate(['/' + optionPathURL]).then();
  }

}


export const OPTIONS = [
  {
    icon: 'pi pi-heart',
    pathURL: 'quick-quiz',
    title : 'Je sais ce que je veux',
    backgroundImage: 'images/qq-split-card-bg.jpg',
    description: "Vous connaissez l'animal idéal ? " +
      "Validez vos connaissances avec notre petit quiz personnalisé"
  },
  {
    icon: 'pi pi-key',
    pathURL: 'choice-assist',
    title : 'Aidez-moi à choisir',
    backgroundImage: 'images/choice-split-card-bg.jpg',
    description: "Grâce à des leçons sur les animaux, découvrez l'animal " +
      "le mieux adapté suivant votre mode de vie"
  },
  {
    icon: 'pi pi-graduation-cap',
    pathURL: 'learn',
    title : 'Je souhaite me former',
    backgroundImage: 'images/learn-split-card-bg.jpg',
    description: "Suivez notre parcours éducatif immersif et ludique pour " +
      "garantir une adoption réussie et durable"
  }
]
