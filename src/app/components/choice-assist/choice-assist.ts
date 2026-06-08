import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import {NavBarService} from '../../services/nav-bar-service';
import {ChoiceAssistService} from '../../webservices/choice-assist-service';
import {ChoiceAssistContext, Recommendation, UserContext} from '../../webservices/contract';
import {FormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {AuthService} from '../../services/auth-service';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';

type Step = 'start' | 'speciesChoice' | 'context' | 'loading' | 'result';

@Component({
  selector: 'app-choice-assist',
  imports: [
    FormsModule,
    Select,
    ProgressSpinner,
    Button,
    InputText,
    Textarea
  ],
  templateUrl: './choice-assist.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './choice-assist.css',
})
export class ChoiceAssist {

  private authService = inject(AuthService);
  private navBarService = inject(NavBarService);
  private choiceAssistService = inject(ChoiceAssistService)

  protected step = signal<Step>('start');

  protected error = signal<string | null>(null);
  protected recommendations = signal<Recommendation[]>([]);
  protected analysisCount = signal(0);
  protected apiMessage = signal<string | null>(null);
  protected expandedPet = signal<number | null>(null);

  protected userContext?: UserContext = this.authService.currentUser()!.context

  protected context: ChoiceAssistContext = initialChoiceAssistContext;

  protected speciesOptions = [
    { label: 'Chien', value: 'chien', icon: '🐕' },
    { label: 'Chat', value: 'chat', icon: '🐈' },
    { label: 'Je ne sais pas', value: undefined, icon: '?'}
  ]

  protected activityOptions = [
    { label: 'Sédentaire', value: 'sedentaire' },
    { label: 'Modéré', value: 'modere' },
    { label: 'Actif', value: 'actif' },
  ];

  protected petExperienceOptions = [
    { label: 'Aucune', value: 'aucune' },
    { label: 'Débutant', value: 'debutant' },
    { label: 'Expérimenté', value: 'experimente' },
  ];

  protected petSizeOptions = [
    { label: 'Petite (< 10 kg)', value: 'petite' },
    { label: 'Moyenne (10–25 kg)', value: 'moyenne' },
    { label: 'Grande (> 25 kg)', value: 'grande' },
  ];

  protected childrenAgeRangeOptions = [
    { label: 'Jeunes (< 6 ans)', value: 'jeunes' },
    { label: 'Grands (≥ 6 ans)', value: 'grands' },
  ];

  start() {
    this.step.set('speciesChoice')
  }

  selectSpecies(species: 'chien' | 'chat') {
    this.context.speciesPreference = species;
    this.step.set('context');
  }

  backToSpeciesChoice() {
    this.step.set('speciesChoice');
    this.error.set(null);
  }

  submit() {
    this.step.set('loading');
    this.error.set(null);

    console.log(this.context)

    this.choiceAssistService.getRecommendations(this.context).subscribe({
      next: (res) => {

        const recommendations: Recommendation[] = res.recommendations.map(
          r => ({ ...r, name: r.name = (r.reason as string).split(' ')[0] })
        )

        this.recommendations.set(recommendations);
        this.analysisCount.set(res.analysisCount);
        this.apiMessage.set(res.message ?? null);
        this.step.set('result');
      },
      error: () => {
        this.error.set("Une erreur est survenue lors de l'analyse. Veuillez réessayer.");
        this.step.set('context');
      },
    });
  }

  restart() {
    this.step.set('speciesChoice');
    this.context = initialChoiceAssistContext
    this.recommendations.set([]);
    this.error.set(null);
    this.expandedPet.set(null);
  }

  togglePetDescription(id: number) {
    this.expandedPet.update(current => current === id ? null : id);
  }

  scoreClass(score: number): string {
    if (score >= 75) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  }

  scoreLabel(score: number): string {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Bon';
    return 'Déconseillé';
  }

  confidenceLabel(confidence: string): string {
    const map: Record<string, string> = {
      haute: 'Profil fiable',
      moyenne: 'Profil estimé',
      faible: 'Profil estimé',
    };
    return map[confidence] ?? confidence;
  }

}

const initialChoiceAssistContext = {
}
