import {email, required, schema, validate} from '@angular/forms/signals';
import {Login, Register} from '../webservices/contract';


export function filterBlockDigits(event: KeyboardEvent) {
  if ( /\d/.test(event.key) )
    event.preventDefault()
}

export function filterAllowDigits(event: KeyboardEvent) {
  if ( /\d/.test(event.key ) || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
    .includes(event.key) )
    return;
  event.preventDefault();
}

export const initialLoginData: Login = {  email: '',  password: '' }

export const initialRegisterData: Register = { name: '', email: '', password: '', phoneNumber: '' }

export const loginSchema = schema<Login>((schema) => {
  required(schema.email, { message: 'Adresse email requise' });
  required(schema.password, { message: 'Mot de passe requis' });
  email(schema.email, { message: 'Adresse email invalide' });
})

export const registrationSchema = schema<Register>((schema) => {
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
