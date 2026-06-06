import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {RadioButton} from 'primeng/radiobutton';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {User} from '../../webservices/contract';

@Component({
  selector: 'app-user-profile',
  imports: [
    RadioButton,
    FormsModule,
    Button
  ],
  templateUrl: './user-profile.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './user-profile.css',
})
export class UserProfile {

  user = input.required<User | undefined>()

  protected avecBalcon = false;
  protected avecJardin = false;

  protected enCouple = false;
  protected habitantEnsemble = false;


  protected mode = signal<'edit' | 'display'>('display');

  protected toggleMode(): void {
    this.mode.update((m) => m === 'display' ? 'edit' : 'display')
  }



}
