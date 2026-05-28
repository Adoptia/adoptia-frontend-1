import {inject, Injectable, signal} from '@angular/core';
import {LoginData, RegistrationData} from '../components/auth/auth';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private router = inject(Router)

  private _currentUser = signal<UserData | undefined>(undefined);

  currentUser = this._currentUser.asReadonly();

  knownUsers = signal<RegistrationData[]>([
    {
      email: 'admin@admin.com',
      password: 'admin',
      name: 'Blaste Mulamba',
      phoneNumber: '0752064923'
    }
  ])

  saveUsersToLocalStorage() {
    this.fetchKnownUsersFromLocalStorage()

    localStorage.setItem('knownUsers', JSON.stringify(this.knownUsers()))
  }

  saveCurrentUserToLocalStorage() {
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser()))
  }

  fetchCurrentUserFromLocalStorage() {
    const value = localStorage.getItem('currentUser')

    if (value) {
      const user: UserData = JSON.parse(value);
      this._currentUser.set(user);
    }
  }

  fetchKnownUsersFromLocalStorage() {
    let users: RegistrationData[] = []
    const value = localStorage.getItem('knownUsers')

    if (value) users = JSON.parse(value);
    this.knownUsers.set(users);
  }

  loginUser(data: LoginData) {

    this.fetchKnownUsersFromLocalStorage()

    const user = this.knownUsers().find(
      user => user.email === data.email && user.password === data.password
    );

    if (user) {
      const firstName = user.name.split(' ')[0];
      const lastName = user.name.split(' ')[1];

      this._currentUser.set(
        { firstName: firstName, lastName: lastName, email: user.email, phoneNumber: user.phoneNumber }
      )

      this.saveCurrentUserToLocalStorage()

      this.router.navigate(['/dashboard'])

    }
  }

  registerNewUser(data: RegistrationData) {
    console.log('creating new user')
    this.knownUsers.update(users => [...users, data])
    localStorage.setItem('knownUsers', JSON.stringify(this.knownUsers()))
    this.loginUser(data)
  }

}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

}
