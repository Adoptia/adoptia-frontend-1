import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ProgressSpinner } from 'primeng/progressspinner';
import { NavBarService } from '../../services/nav-bar-service';
import { ChoiceAssistService } from '../../services/choice-assist-service';
import { ProfilAdoptant, Recommandation } from '../../webservices/contract';

type Step = 'espece' | 'profil' | 'chargement' | 'resultats';

@Component({
  selector: 'app-choice-assist',
  imports: [FormsModule, Button, Select, InputText, Textarea, ProgressSpinner],
  templateUrl: './choice-assist.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './choice-assist.css',
})
export class ChoiceAssist {
  private navBarService = inject(NavBarService);
  private choiceAssistService = inject(ChoiceAssistService);

  protected step = signal<Step>('espece');
  protected erreur = signal<string | null>(null);
  protected recommandations = signal<Recommandation[]>([]);
  protected totalAnalyses = signal(0);
  protected messageApi = signal<string | null>(null);
  protected animalExpanded = signal<number | null>(null);

  protected profil: ProfilAdoptant = { espece: 'chien' };

  protected especeOptions = [
    { label: 'Chien', value: 'chien', icon: '🐕' },
    { label: 'Chat', value: 'chat', icon: '🐈' },
  ];

  protected habitatOptions = [
    { label: 'Appartement', value: 'appartement' },
    { label: 'Maison', value: 'maison' },
  ];

  protected activiteOptions = [
    { label: 'Sédentaire', value: 'sedentaire' },
    { label: 'Modéré', value: 'modere' },
    { label: 'Sportif', value: 'sportif' },
  ];

  protected experienceOptions = [
    { label: 'Aucune', value: 'aucune' },
    { label: 'Débutant', value: 'debutant' },
    { label: 'Expérimenté', value: 'experimente' },
  ];

  protected tailleOptions = [
    { label: 'Petite (< 10 kg)', value: 'petite' },
    { label: 'Moyenne (10–25 kg)', value: 'moyenne' },
    { label: 'Grande (> 25 kg)', value: 'grande' },
  ];

  protected ageEnfantsOptions = [
    { label: 'Jeunes (< 6 ans)', value: 'jeunes' },
    { label: 'Grands (≥ 6 ans)', value: 'grands' },
  ];

  choisirEspece(espece: 'chien' | 'chat') {
    this.profil = { espece };
    this.step.set('profil');
  }

  retourEspece() {
    this.step.set('espece');
    this.erreur.set(null);
  }

  lancerRecherche() {
    this.step.set('chargement');
    this.erreur.set(null);

    const profilNettoye = Object.fromEntries(
      Object.entries(this.profil).filter(([, v]) => v !== null && v !== undefined && v !== '')
    ) as ProfilAdoptant;

    this.choiceAssistService.getRecommandations(profilNettoye).subscribe({
      next: (res) => {
        this.recommandations.set(res.recommandations);
        this.totalAnalyses.set(res.total_analyses);
        this.messageApi.set(res.message ?? null);
        this.step.set('resultats');
      },
      error: () => {
        this.erreur.set("Une erreur est survenue lors de l'analyse. Veuillez réessayer.");
        this.step.set('profil');
      },
    });
  }

  recommencer() {
    this.step.set('espece');
    this.profil = { espece: 'chien' };
    this.recommandations.set([]);
    this.erreur.set(null);
    this.animalExpanded.set(null);
  }

  toggleDescription(id: number) {
    this.animalExpanded.update(current => current === id ? null : id);
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

  confianceLabel(confiance: string): string {
    const map: Record<string, string> = {
      haute: 'Profil fiable',
      moyenne: 'Profil estimé',
      faible: 'Profil estimé',
    };
    return map[confiance] ?? confiance;
  }
}
