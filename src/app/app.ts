import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavBar} from './components/nav-bar/nav-bar';
import {Home} from './components/home/home';

@Component({
  selector: 'app-root',
  imports: [NavBar, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('adoptia-frontend');
}
