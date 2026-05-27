import { Component } from '@angular/core';
import {Unavailable} from "../unavailable/unavailable";

@Component({
  selector: 'app-auth',
    imports: [
        Unavailable
    ],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {

}
