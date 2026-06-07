import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChoiceAssistContext, RecommendationResponse} from './contract';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChoiceAssistService {
  private http = inject(HttpClient);
  private readonly api = 'http://localhost:8000/choice-assist';

  getRecommendations(context: ChoiceAssistContext): Observable<RecommendationResponse> {
    return this.http.post<RecommendationResponse>(`${this.api}/recommandations`, context);
  }
}
