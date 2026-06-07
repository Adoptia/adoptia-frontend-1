import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Login, Register, User, UserBasics, UserTraining} from '../webservices/contract';
import {QuickQuizService} from './quick-quiz-service';

interface BackendUserResponse {
  id: string;
  basics: { firstName: string; lastName: string; email: string; phoneNumber: string; birthDate?: string };
  context?: User['context'];
  trainings: UserTraining[];
}

const API = 'http://localhost:8000';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private router = inject(Router);
  private http = inject(HttpClient);
  private quickQuizService = inject(QuickQuizService);

  private _currentUser = signal<User | undefined>(undefined);
  currentUser = this._currentUser.asReadonly();

  registerError = signal<LoginOrRegisterError>({ status: false });
  loginError    = signal<LoginOrRegisterError>({ status: false });
  duplicateUserError = signal(false);
  badCredentialsError = signal(false);

  isAuthenticated = computed(() => this._currentUser() !== undefined);

  logout() {
    this._currentUser.set(undefined);
    localStorage.removeItem('currentUser');
    sessionStorage.clear();
  }

  login(userData: Login) {
    this.http.post<BackendUserResponse>(`${API}/auth/login`, userData).subscribe({
      next: (resp) => {
        const user = this._mapBackendUser(resp);
        this._currentUser.set(user);
        this.setCurrentUserInLocalStorage();
        for (const quiz of user.trainings.filter(t => t.type === 'quick-quiz')) {
          this.quickQuizService.restoreState(quiz);
        }
        this.router.navigate(['/dashboard']);
      },
      error: (_err: HttpErrorResponse) => {
        this.badCredentialsError.set(true);
        this.loginError.set({ status: true, message: 'Identifiants incorrects' });
        this.showBadCredentialsError();
      },
    });
  }

  register(userData: Register) {
    this.http.post<BackendUserResponse>(`${API}/auth/register`, userData).subscribe({
      next: (resp) => {
        const user = this._mapBackendUser(resp);
        this._currentUser.set(user);
        this.setCurrentUserInLocalStorage();
        this.router.navigate(['/dashboard']);
      },
      error: (_err: HttpErrorResponse) => {
        this.duplicateUserError.set(true);
        this.registerError.set({ status: true, message: 'Un compte avec cette adresse email existe' });
        this.showDuplicateUserError();
      },
    });
  }

  showBadCredentialsError() {
    setTimeout(() => {
      this.badCredentialsError.set(false);
      this.loginError.set({ status: false });
    }, 3000);
  }

  showDuplicateUserError() {
    setTimeout(() => {
      this.duplicateUserError.set(false);
      this.registerError.set({ status: false });
    }, 3000);
  }

  getCurrentUserFromLocalStorage() {
    const value = localStorage.getItem('currentUser');
    if (value) {
      this._currentUser.set(JSON.parse(value) as User);
    }
  }

  setCurrentUserInLocalStorage() {
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser()));
  }

  createUserTraining(t: UserTraining) {
    this._currentUser.update(user => {
      const trainings = t.type === 'quick-quiz'
        ? [...user!.trainings.filter(tr => tr.type !== 'quick-quiz' || tr.species !== t.species), t]
        : [...user!.trainings, t];
      return { ...user!, trainings };
    });
    this.setCurrentUserInLocalStorage();
  }

  updateUserTraining(t: UserTraining) {
    this._currentUser.update(user => ({
      ...user!,
      trainings: user!.trainings.map(existing =>
        existing.type === t.type && existing.species === t.species && (existing as any).breed === (t as any).breed
          ? t
          : existing
      ),
    }));
    this.setCurrentUserInLocalStorage();
  }

  deleteUserTraining(t: UserTraining) {
    this._currentUser.update(user => ({
      ...user!, trainings: user!.trainings.filter(tr => tr.id !== t.id)
    }));
    this.setCurrentUserInLocalStorage();
  }

  private _mapBackendUser(resp: BackendUserResponse): User {
    const basics: UserBasics = {
      firstName:   resp.basics.firstName,
      lastName:    resp.basics.lastName,
      email:       resp.basics.email,
      password:    '',
      phoneNumber: resp.basics.phoneNumber,
      birthDate:   resp.basics.birthDate,
    };
    return { id: resp.id, basics, context: resp.context, trainings: resp.trainings ?? [] };
  }
}

export type LoginOrRegisterError = {
  status: boolean;
  message?: string;
}
