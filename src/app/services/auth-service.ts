import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {Router} from '@angular/router';
import {Login, Register, User, UserBasics, UserTraining} from '../webservices/contract';
import {generateId} from '../utils/uuid.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private router = inject(Router)

  private _currentUser = signal<User | undefined>(undefined);
  currentUser = this._currentUser.asReadonly()

  registerError = signal<LoginOrRegisterError>({ status: false })
  loginError = signal<LoginOrRegisterError>({ status: false })

  private showErrorFor(error: WritableSignal<LoginOrRegisterError>) {
    setTimeout(() => error.set({ status: false }), 3000)
  }

  isAuthenticated = computed(() => this._currentUser() !== undefined)

  users = signal<User[]>([])

  logout() {
    this._currentUser.set(undefined);
    localStorage.removeItem('currentUser');
  }

  login(userData: Login) {
    this.fetchUsersFromLocalStorage()

    const user = this.users().find(
      user => user.basics.email === userData.email
        && user.basics.password === userData.password
    );

    if (!user) {
      this.loginError.set({
        status: true,
        message: 'Identifiants incorrects',
      })
      this.showErrorFor(this.loginError)
      return
    }

    this._currentUser.update( u => user)
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser()))
    this.router.navigate(['/dashboard'])

  }

  register(userData: Register) {
    if (this.checkExistingUser(userData)) {
      this.registerError.set({
        status: true,
        message: 'Un compte avec cette adresse email existe'
      });
      this.showErrorFor(this.registerError)
      return;
    }

    const { name, ...rest } = userData
    const basics: UserBasics = { ...rest, firstName: name.split(' ')[0], lastName: name.split(' ')[1] };
    const user: User = { id: generateId(), basics, trainings: [] }

    this.users.update(users => [...users, user])
    localStorage.setItem('knownUsers', JSON.stringify(this.users()))

    this.login({ email: userData.email, password: userData.password })

  }

  checkExistingUser(user: Register): boolean {
    const email = user.email
    this.fetchUsersFromLocalStorage()
    return this.users().some(u => u.basics.email === email)
  }

  private persistUser() {
    const user = this._currentUser()!;
    this.fetchUsersFromLocalStorage();
    this.users.update(users => users.map(u => u.id === user.id ? user : u));
    const usersJson = JSON.stringify(this.users());
    localStorage.setItem('knownUsers', usersJson);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUserFromLocalStorage() {
    const value = localStorage.getItem('currentUser')

    if (value) {
      const user: User = JSON.parse(value);
      this._currentUser.set(user);
    }
  }

  fetchUsersFromLocalStorage() {
    let users: User[] = []
    const value = localStorage.getItem('knownUsers')

    if (value) {
      users = JSON.parse(value);
      this.users.set(users);
    }
  }

  createUserTraining(t: UserTraining) {
    this._currentUser.update(user => {
      const trainings = t.type === 'quick-quiz'
        ? [...user!.trainings.filter(training => training.type !== 'quick-quiz' || training.species !== t.species), t]
        : [...user!.trainings, t];
      return { ...user!, trainings };
    });

    this.persistUser();
  }

  updateUserTraining(t: UserTraining) {
    this._currentUser.update(user => ({
      ...user!, trainings: user!.trainings.map(training =>
        training.id === t.id ? t : training
      )
    }))

    this.persistUser();
  }

  deleteUserTraining(t: UserTraining) {
    this._currentUser.update(user =>({
      ...user!, trainings: user!.trainings.filter(training => training.id !== t.id)
    }))

    this.persistUser()
  }



}

export type LoginOrRegisterError = {
  status: boolean;
  message?: string;
}
