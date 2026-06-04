import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {email, form, FormField, required, schema, validate} from '@angular/forms/signals';
import {NavigationHistoryService} from '../../services/navigation-history-service';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-auth',
  imports: [
    Button,
    FormField
  ],
  templateUrl: './auth.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './auth.css',
})
export class Auth {

  private authService = inject(AuthService)
  private navigationHistoryService = inject(NavigationHistoryService)

  protected mode = signal<'login' | 'register'>('login')

  protected isLoginSuccessful = this.authService.isLoginSuccessful

  private loginData = signal<LoginData>(initialLoginData)
  protected loginForm = form(this.loginData, loginSchema)
  protected invalidLoginForm = computed(() => this.loginForm().invalid())

  private registrationData = signal<RegistrationData>(initialRegistrationData)
  protected registrationForm = form(this.registrationData, registrationSchema)
  protected invalidRegistrationForm = computed(() => this.registrationForm().invalid())

  protected toggleMode() {
    this.mode.update(
      v => v === 'login' ? 'register' : 'login'
    )
  }

  protected goBack() {
    this.navigationHistoryService.goBack()
  }

  protected submitLoginForm() {
    if (this.loginForm().valid()) this.authService.login(this.loginData())
  }

  protected submitRegistrationForm() {
    if (this.registrationForm().valid()) this.authService.register(this.registrationData())
  }

  protected filterBlockDigits(event: KeyboardEvent) {
    if ( /\d/.test(event.key) )
      event.preventDefault()
  }

  protected filterAllowDigits(event: KeyboardEvent) {
      if ( /\d/.test(event.key ) || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
        .includes(event.key) )
        return;
      event.preventDefault();
  }

  protected formatPhone(event: Event) {
    const input = event.target as HTMLInputElement;

    const digits = input.value
      .replace(/\D/g, '').slice(0, 10)

    input.value = digits.match(/.{1,2}/g)?.join(' ') ?? ''
    this.registrationData.update(prev => ({ ...prev, phoneNumber: digits }))

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
  required(schema.phoneNumber, { message: 'Numéro de téléphone requis' });
  required(schema.name, { message: 'Prénom et nom de famille requis' });

  email(schema.email, { message: 'Adresse email invalide' })

  validate(schema.name, ({ value }) => {

    if (/[^a-zA-ZÀ-ÿ\s-]/.test(value())) {
      return {
        kind: 'nameContainsSpecialChars',
        message: 'Caractères spéciaux interdits, sauf le tiret (-)'

      }
    }

    if ( !/^[a-zA-ZÀ-ÿ-]+\s[a-zA-ZÀ-ÿ-]+$/.test(value()) ) {
      return {
        kind: 'missingWhitespaceBetweenNames',
        message: 'Laissez un espace entre votre prénom et votre nom'
      }
    }

    if (!/^[a-zA-ZÀ-ÿ]+(-[a-zA-ZÀ-ÿ]+)*(\s[a-zA-ZÀ-ÿ]+(-[a-zA-ZÀ-ÿ]+)*)$/.test(value())) {
      return {
        kind: 'hyphenMustBeUsedBetweenLetters',
        message: 'Tiret autorisé entre des lettres, pas au début ou à la fin d\'un nom'
      }
    }

    return null

  });
  validate(schema.phoneNumber, ({ value }) => {

    if ((value().match(/\d/g)?.length ?? 0) !== 10) {
      return {
        kind: 'wrongPhoneNumberLength',
        message: 'Le numéro de téléphone doit avoir 10 chiffres'
      }
    }

    return null;
  })
  validate(schema.password, ({ value }) => {

    if (value().length < 8) {
      return {
        kind: 'passwordTooShort',
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      }
    }

    if (!/\d/.test(value())) {
      return {
        kind: 'missingDigits',
        message: 'Le mot de passe doit contenir au moins un chiffre'
      }
    }

    if (!/[^a-zA-ZÀ-ÿ0-9\s]/.test(value())) {
      return {
        kind: 'missingSpecialCharacter',
        message: 'Le mot de passe doit contenir au moins un caractère spécial'
      }
    }

    return null

  })

})
