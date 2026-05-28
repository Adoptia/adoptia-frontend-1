import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {Unavailable} from '../unavailable/unavailable';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-user-profile',
  imports: [
    Unavailable
  ],
  templateUrl: './user-profile.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './user-profile.css',
})
export class UserProfile {




}
