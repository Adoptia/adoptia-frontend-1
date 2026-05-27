import { Component } from '@angular/core';
import {Unavailable} from "../unavailable/unavailable";

@Component({
  selector: 'app-catalog',
    imports: [
        Unavailable
    ],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {

}
