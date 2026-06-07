import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfilAdoptant, RecommandationsResponse } from '../webservices/contract';

@Injectable({ providedIn: 'root' })
export class ChoiceAssistService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8000/choice-assist';

  getRecommandations(profil: ProfilAdoptant, userId?: string): Observable<RecommandationsResponse> {
    const params = userId ? { user_id: userId } : {};
    return this.http.post<RecommandationsResponse>(`${this.API}/recommandations`, profil, { params });
  }
}
