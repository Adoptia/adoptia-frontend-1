import { Component, ChangeDetectionStrategy } from '@angular/core';
import {Unavailable} from "../unavailable/unavailable";

@Component({
  selector: 'app-catalog',
    imports: [
        Unavailable
    ],
  templateUrl: './catalog.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './catalog.css',
})
export class Catalog {

}
