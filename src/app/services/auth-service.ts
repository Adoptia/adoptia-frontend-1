import {inject, Injectable, signal} from '@angular/core';
import {LoginData, RegistrationData} from '../components/auth/auth';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private router = inject(Router)

  private _currentUser = signal<UserData | undefined>(undefined);

  protected isLoginSuccessful = signal(true)

  currentUser = this._currentUser.asReadonly()

  users = signal<RegistrationData[]>([])

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
    const value = localStorage.getItem('users')

    if (value) {
      users = JSON.parse(value);
      this.users.set(users);
    }
  }

  loginUser(data: LoginData) {

    this.fetchUsersFromLocalStorage()

    const user = this.users().find(
      user => user.email === data.email && user.password === data.password
    );

    if (user) {
      const firstName = user.name.split(' ')[0];
      const lastName = user.name.split(' ')[1];

      this._currentUser.set(
        { firstName: firstName, lastName: lastName, email: user.email, phoneNumber: user.phoneNumber }
      )

      this.isLoginSuccessful.set(true)

      this.setCurrentUserInLocalStorage()

      this.router.navigate(['/dashboard'])

    }
  }

  registerNewUser(data: RegistrationData) {
    this.users.update(users => [...users, data])
    this.saveUsersToLocalStorage()
    this.loginUser(data)
  }

}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

}
