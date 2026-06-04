import {computed, inject, Injectable, signal} from '@angular/core';
import {LoginData, RegistrationData} from '../components/auth/auth';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private router = inject(Router)

  private _currentUser = signal<UserData | undefined>(undefined);

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

  currentUser = this._currentUser.asReadonly()

  users = signal<RegistrationData[]>([])

  logout() {
    this._currentUser.set(undefined);
    localStorage.removeItem('currentUser');
  }

  login(userData: LoginData) {

    this.fetchUsersFromLocalStorage()

    const user = this.users().find(
      user => user.email === userData.email && user.password === userData.password
    );

    if (!user) {
      this.badCredentialsError.set(true)
      this.showBadCredentialsError()
      return
    }

    const firstName = user.name.split(' ')[0];
    const lastName = user.name.split(' ')[1];

    this._currentUser.update( u => ({
      ...u,
      base: { firstName: firstName, lastName: lastName, email: user.email, phoneNumber: user.phoneNumber }
    }))

    this.setCurrentUserInLocalStorage()

    this.router.navigate(['/dashboard'])

  }

  register(user: RegistrationData) {
    if (this.checkDuplicateUser(user)) {
      this.duplicateUserError.set(true)
      this.showDuplicateUserError()
      return;
    }

    this.users.update(users => [...users, user])
    this.saveUsersToLocalStorage()
    this.login(user)
  }

  checkDuplicateUser(user: RegistrationData): boolean {
    const email = user.email;
    this.fetchUsersFromLocalStorage()
    return this.users().some(u => u.email === email);
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
      const user: UserData = JSON.parse(value);
      this._currentUser.set(user);
    }
  }

  fetchUsersFromLocalStorage() {
    let users: RegistrationData[] = []
    const value = localStorage.getItem('knownUsers')

    if (value) {
      users = JSON.parse(value);
      this.users.set(users);
    }
  }

}

export interface UserData {
  base: UserBasicData,
  context?: UserContextData
}

export interface UserBasicData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate?: string;
}

export interface UserContextData {
  residence: {
    type: 'maison'
      | 'appartement',
    address: string,
    surface: number,
    garden: boolean,
    balcony: boolean
  },
  household: {
    hasPartner: boolean,
    liveTogether: boolean,
    childrenCount: number
  }
}
