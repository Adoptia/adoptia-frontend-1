import {inject, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {QuizCardData} from './contract';
import {firstValueFrom} from 'rxjs';

@Service()
export class QuickQuizWebservice {
  private http = inject(HttpClient);
  private readonly api =
    'https://adoptia-backend-1.onrender.com/quiz';

  getQuickQuizzes(species: string): Promise<QuizCardData[]> {
    const s = species.toLowerCase()
    return firstValueFrom(this.http.get<QuizCardData[]>(`${this.api}/${s}`))
  }
}
