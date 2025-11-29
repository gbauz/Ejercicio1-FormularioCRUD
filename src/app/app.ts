import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Formulariopersona} from './components/formulariopersona/formulariopersona';
import { Formulariomascota} from './components/formulariomascota/formulariomascota';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Formulariopersona,Formulariomascota],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ejercicio1');
}
