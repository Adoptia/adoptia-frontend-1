import {Component, computed, OnInit, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-quick-quiz',
  imports: [
    Button,
    Select
  ],
  templateUrl: './quick-quiz.html',
  styleUrl: './quick-quiz.css',
})
export class QuickQuiz implements OnInit {

  animal = signal<Animal>(animals[0])

  species: string[] = []

  breeds = computed(() =>
    animals.find(a => a.species === this.animal().species)?.breeds ?? []
  );

  ngOnInit() {
    this.species = animals.map(a => a.species)
  }

}

export interface Animal {
  species: string,
  breeds: string[]
}

export const animals: Animal[] = [
  { species: 'Chat',
    breeds:
      [
        'Bengale',
        'Siamois',
        'Ragdoll',
        'Savannah',
        'British Shorthair',
        'Sacré de Birmaine',
        'Maine Coon'
      ]
  },
  { species: 'Chien',
    breeds:
      [
        'Berger Allemand',
        'Labrador',
        'Golden Retriever',
        'Bulldog',
        'Beagle',
        'Poodle',
        'Rottweiler',
        'Yorkshire Terrier',
        'Boxer',
        'Dachshund'
      ]
  },
  { species: 'Lapin' ,
    breeds:
      [
        'Blanc danois',
        'Géant des Flandres',
        'Bélier français',
        'Bélier anglais',
        'Fauve de Bourgogne',
      ]
  },
]
