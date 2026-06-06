import {computed, inject, Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Login, Register, User, UserBasics, UserTraining} from '../webservices/contract';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private router = inject(Router)

  private _currentUser = signal<User | undefined>(undefined);
  currentUser = this._currentUser.asReadonly()

  duplicateUserError = signal<boolean>(false);

  showDuplicateUserError() {
    if (this.duplicateUserError()) {
      setTimeout(() => {
        this.duplicateUserError.set(false)
      }, 3000)
    }
  }

  badCredentialsError = signal(false)

  showBadCredentialsError() {
    if (this.badCredentialsError()) {
      setTimeout(() => {
        this.badCredentialsError.set(false)
      }, 3000)
    }
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
      this.badCredentialsError.set(true)
      this.showBadCredentialsError()
      return
    }


    this._currentUser.update( u => user)

    this.setCurrentUserInLocalStorage()

    this.router.navigate(['/dashboard'])

  }

  register(userData: Register) {
    if (this.checkExistingUser(userData)) {
      this.duplicateUserError.set(true)
      this.showDuplicateUserError()
      return;
    }

    const { name, ...rest } = userData

    const firstName = userData.name.split(' ')[0];
    const lastName = userData.name.split(' ')[1];

    const basics: UserBasics = { ...rest, firstName, lastName }
    const user: User = { id: crypto.randomUUID(), basics, trainings: [] }

    this.users.update(users => [...users, user])
    this.saveUsersToLocalStorage()
    this.login(userData)
  }

  checkExistingUser(user: Register): boolean {
    const email = user.email;
    this.fetchUsersFromLocalStorage()
    return this.users().some(u => u.basics.email === email);
  }

  saveUsersToLocalStorage() {
    localStorage.setItem('knownUsers', JSON.stringify(this.users()))
  }

  setCurrentUserInLocalStorage() {
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser()))
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
    this._currentUser.update(user => ({ ...user!, trainings: [ ...user!.trainings, t ] }))
    this.syncCurrentUserInUsers()
    this.setCurrentUserInLocalStorage()
    this.saveUsersToLocalStorage()
  }

  updateUserTraining(t: UserTraining) {
    this._currentUser.update(user => ({
      ...user!, trainings: user!.trainings.map(existing =>
        existing.type === t.type && existing.species === t.species && existing.breed === t.breed
          ? t
          : existing
      )
    }))
    this.syncCurrentUserInUsers();
    this.setCurrentUserInLocalStorage();
    this.saveUsersToLocalStorage();
  }

  private syncCurrentUserInUsers() {
    this.users.update(users =>
      users.map(u => u.id === this._currentUser()!.id ? this._currentUser()! : u)
    );
  }



}
