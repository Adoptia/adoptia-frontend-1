import {Component, computed, effect, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {email, form, FormField, required, schema} from '@angular/forms/signals';

@Component({
  selector: 'app-auth',
  imports: [
    Button,
    FormField
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {

  protected mode = signal<'login' | 'register'>('login');

  private loginData = signal<LoginData>(initialLoginData)
  private registrationData = signal<RegistrationData>(initialRegistrationData)

  protected loginForm = form(this.loginData, loginSchema)
  protected registrationForm = form(this.registrationData, registrationSchema)

  protected loginFormInvalid = computed(() => this.loginForm().invalid())

  protected toggleMode() {
    this.mode.update(
      v => v === 'login' ? 'register' : 'login'
    )
  }

  protected submitLoginForm() {

  }

}



export interface LoginData {
  email: string;
  password: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export const initialLoginData = {
  email: '',
  password: '',
}

export const initialRegistrationData = {
  name: '',
  email: '',
  password: '',
  phoneNumber: '',
}

export const loginSchema = schema<LoginData>((schema) => {
  required(schema.email, { message: 'Adresse email requise' });
  required(schema.password, { message: 'Mot de passe requis' });
  email(schema.email, { message: 'Adresse email invalide' });
})

export const registrationSchema = schema<RegistrationData>((schema) => {

})
