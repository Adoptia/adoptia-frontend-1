import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Annonce} from '../webservices/contract';

interface AnnoncesPage {
  total: number;
  page: number;
  limit: number;
  pages: number;
  annonces: Annonce[];
}

const API = 'http://localhost:8000';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {

  private http = inject(HttpClient);

  annonces = signal<Annonce[]>([]);
  total    = signal(0);
  pages    = signal(1);
  loading  = signal(false);
  error    = signal<string | null>(null);

  load(espece?: string, page = 1, limit = 20, filters: Record<string, string | boolean> = {}) {
    this.loading.set(true);
    this.error.set(null);

    let url = `${API}/annonces?page=${page}&limit=${limit}`;
    if (espece) url += `&espece=${encodeURIComponent(espece)}`;
    for (const [key, val] of Object.entries(filters)) {
      url += `&${key}=${encodeURIComponent(String(val))}`;
    }

    this.http.get<AnnoncesPage>(url).subscribe({
      next: data => {
        this.annonces.set(data.annonces);
        this.total.set(data.total);
        this.pages.set(data.pages);
        this.loading.set(false);
      },
      error: err => {
        this.error.set('Impossible de charger les annonces.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
