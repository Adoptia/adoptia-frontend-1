import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfilAdoptant, RecommandationsResponse } from '../webservices/contract';

@Injectable({ providedIn: 'root' })
export class ChoiceAssistService {
  private http = inject(HttpClient);
  private readonly API = 'https://adoptia-backend-1.onrender.com/choice-assist';

  getRecommandations(profil: ProfilAdoptant, userId?: string): Observable<RecommandationsResponse> {
    const url = userId ? `${this.API}/recommandations?user_id=${userId}` : `${this.API}/recommandations`;
    return this.http.post<RecommandationsResponse>(url, profil);
  }
}
