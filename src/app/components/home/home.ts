import {Component, computed, OnInit, signal} from '@angular/core';
import {interval} from 'rxjs';
import {Button} from 'primeng/button';
import {Card} from '../shared/card/card';
import {SplitCard} from '../shared/split-card/split-card';

@Component({
  selector: 'app-home',
  imports: [
    Button,
    Card,
    SplitCard,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',

})
export class Home implements OnInit {

  messages = signal<string[]>([
      'Changez une vie',
      'Adoptez en toute confiance',
      'Devenez un adoptant responsable',
  ]);

  benefits = signal<string[]>([
    'Formation interactive et certifiante',
    'Parcours personnalisé adapté à votre situation',
    'Réseau de refuges et éleveurs responsables partenaires'
  ]);

  animateFlag = signal(true);

  messageIndex = signal<number>(0);

  ngOnInit() {
    interval(4000).subscribe(() => {
      this.animateFlag.update(v => !v);
      setTimeout(() => this.animateFlag.update(v => !v), 200);
      setTimeout(() => this.messageIndex.update(i => (i + 1) % this.messages().length));
    });
  }



}
