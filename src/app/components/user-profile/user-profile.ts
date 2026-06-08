import {ChangeDetectionStrategy, Component, inject, input, model, OnInit, signal} from '@angular/core';
import {RadioButton} from 'primeng/radiobutton';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {User} from '../../webservices/contract';
import {Select} from 'primeng/select';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-user-profile',
  imports: [
    RadioButton,
    FormsModule,
    Button,
    Select
  ],
  templateUrl: './user-profile.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {

  user = model.required<User>()

  protected missingFieldPlaceholder = 'non fourni(e)'

  private authService = inject(AuthService);

  protected phoneNumber!: string | undefined
  protected email!: string | undefined
  protected firstName!: string | undefined
  protected lastName!: string | undefined
  protected birthDate!: string | undefined
  protected residenceSurface!: number
  protected residenceAddress!: string | undefined
  protected residenceType!: 'maison' | 'appartement' | undefined
  protected residenceTypeOptions = ['maison', 'appartement']
  protected childrenCount!: number
  protected hasBalcony!: boolean
  protected hasGarden!: boolean
  protected hasPartner!: boolean
  protected liveTogether!: boolean

  protected mode = signal<'edit' | 'display'>('display')

  ngOnInit(): void {
    const u = this.user()!
    this.phoneNumber = u.basics?.phoneNumber
    this.email = u.basics?.email
    this.firstName = u.basics?.firstName
    this.lastName = u.basics?.lastName
    this.birthDate = u.basics?.birthDate
    this.residenceType = u.context?.residence?.type
    this.residenceSurface = u.context?.residence?.surface ?? 0
    this.residenceAddress = u.context?.residence?.address
    this.childrenCount = u.context?.household?.childrenCount ?? 0
    this.hasBalcony = u.context?.residence?.hasBalcony ?? false
    this.hasGarden = u.context?.residence?.hasGarden ?? false
    this.hasPartner = u.context?.household?.hasPartner ?? false
    this.liveTogether = u.context?.household?.liveTogether ?? false
  }

  protected toggleMode(): void {
    this.mode.update((m) => m === 'display' ? 'edit' : 'display')
  }

  updateUserProfile() {
    this.user.update(
      u => ({
        ...u,
        basics: {
          ...u.basics,
          phoneNumber: this.phoneNumber!,
          birthDate: this.birthDate,
        },
        context: {
          residence: {
            type: this.residenceType,
            hasGarden: this.hasGarden,
            hasBalcony: this.hasBalcony,
            address: this.residenceAddress !== '' ? this.residenceAddress : undefined,
            surface: this.residenceSurface,
          },
          household: {
            hasPartner: this.hasPartner,
            childrenCount: this.childrenCount,
            liveTogether: this.liveTogether,
          }
        }
      })
    )

    this.authService.updateUser(this.user())

  }

}
