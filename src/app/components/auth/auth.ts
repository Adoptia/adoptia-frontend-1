import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {form, FormField} from '@angular/forms/signals';
import {NavigationHistoryService} from '../../services/navigation-history-service';
import {AuthService} from '../../services/auth-service';
import {Login, Register} from '../../webservices/contract';
import {
  filterAllowDigits,
  filterBlockDigits,
  initialLoginData,
  initialRegisterData,
  loginSchema,
  registrationSchema
} from '../../utils/auth.utils';

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

  protected loginError = this.authService.loginError
  protected registerError = this.authService.registerError

  private loginData = signal<Login>(initialLoginData)
  protected loginForm = form(this.loginData, loginSchema)
  protected invalidLoginForm = computed(() => this.loginForm().invalid())

  private registrationData = signal<Register>(initialRegisterData)
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

  protected formatPhone(event: Event) {
    const input = event.target as HTMLInputElement;

    const digits = input.value
      .replace(/\D/g, '').slice(0, 10)

    input.value = digits.match(/.{1,2}/g)?.join(' ') ?? ''
    this.registrationData.update(prev => ({ ...prev, phoneNumber: digits }))
  }

  protected readonly filterBlockDigits = filterBlockDigits;
  protected readonly filterAllowDigits = filterAllowDigits;

}


