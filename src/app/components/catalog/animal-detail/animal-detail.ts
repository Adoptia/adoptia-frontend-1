import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Annonce} from '../../../webservices/contract';

const API = 'http://localhost:8000';

@Component({
  selector: 'app-animal-detail',
  imports: [RouterLink],
  templateUrl: './animal-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalDetail implements OnInit {

  private route  = inject(ActivatedRoute);
  private http   = inject(HttpClient);
  private router = inject(Router);

  protected annonce = signal<Annonce | null>(null);
  protected loading = signal(true);
  protected error   = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/catalog']); return; }

    this.http.get<Annonce>(`${API}/annonces/${id}`).subscribe({
      next: data => { this.annonce.set(data); this.loading.set(false); },
      error: ()   => { this.error.set('Annonce introuvable.'); this.loading.set(false); },
    });
  }

  protected photoUrl(): string {
    return this.annonce()?.animal.photos || 'https://placehold.co/600x400?text=Photo+indisponible';
  }
}
