import { Component } from '@angular/core';
import {Unavailable} from '../unavailable/unavailable';

@Component({
  selector: 'app-user-profile',
  imports: [
    Unavailable
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {

}
