import {Component, computed, effect, inject, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {email, form, FormField, required, schema} from '@angular/forms/signals';
import {NavigationHistoryService} from '../../services/navigation-history-service';
import {FormControl} from '@angular/forms';

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

  private navigationHistoryService = inject(NavigationHistoryService)
  protected mode = signal<'login' | 'register'>('login')

  private loginData = signal<LoginData>(initialLoginData)
  private registrationData = signal<RegistrationData>(initialRegistrationData)

  protected loginForm = form(this.loginData, loginSchema)
  protected registrationForm = form(this.registrationData, registrationSchema)

  protected loginFormInvalid = computed(() => this.loginForm().invalid())

  private firstAndLastNames = computed(() => {
    const names = this.registrationForm().name().split(' ')
    return { firstName: names.at(0), lastName: names.at(1) }
  })

  private namesValidator(field: FormControl<string>): { [key: string]: any } | null {

    const value = field.value

    if ( !value ) return null

    if (/\d/.test(value)) {
      return {
        nameInvalid: {
          message: 'Le nom ne peut pas contenir de chiffres'
        }
      };
    }

    if (/[^a-zA-ZÀ-ÿ\s-]/.test(value)) {
      return {
        nameInvalid: {
          message: 'Le nom ne peut pas contenir de caractères spéciaux, sauf un tiret'
        }
      };
    }

    if ( !/^[a-zA-ZÀ-ÿ-]+\s[a-zA-ZÀ-ÿ-]+$/.test(value) ) {
      return {
        nameInvalid: {
          message: 'Assurez-vous de laisser un espace entre votre prénom et votre nom'
        }
      }
    }

    return null

  }

  protected toggleMode() {
    this.mode.update(
      v => v === 'login' ? 'register' : 'login'
    )
  }

  protected goBack() {
    this.navigationHistoryService.goBack()
  }

  protected submitLoginForm() {

  }

  protected submitRegistrationForm() {

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
  required(schema.email, { message: 'Adresse email requise' });
  required(schema.password, { message: 'Mot de passe requis' });
  required(schema.phoneNumber, { message: 'Mot de passe requis' });
  required(schema.name, { message: 'Nom de famille et prénom(s) requis' });



})
