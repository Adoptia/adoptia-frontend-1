import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChoiceAssistContext, RecommendationResponse} from './contract';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChoiceAssistWebservice {
  private http = inject(HttpClient);
  private readonly api =
    'https://adoptia-backend-1.onrender.com/choice-assist';

  getRecommendations(context: ChoiceAssistContext): Observable<RecommendationResponse> {
    return this.http.post<RecommendationResponse>(`${this.api}/recommandations`, context);
  }
}
