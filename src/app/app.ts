import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';              // 👈 IMPORTANTE para *ngIf
import { Formulariopersona } from './components/formulariopersona/formulariopersona';
import { Formulariomascota } from './components/formulariomascota/formulariomascota';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,            // 👈 Necesario para *ngIf
    RouterOutlet,
    Formulariopersona,
    Formulariomascota,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  // 👇 BOOLEANS normales
  mostrarFormularioMascota: boolean = false;
  mostrarFormularioPersona: boolean = false;

  toggleMascota() {
    this.mostrarFormularioMascota = !this.mostrarFormularioMascota;
    if (this.mostrarFormularioMascota) {
      this.mostrarFormularioPersona = false;
    }
  }

  togglePersona() {
    this.mostrarFormularioPersona = !this.mostrarFormularioPersona;
    if (this.mostrarFormularioPersona) {
      this.mostrarFormularioMascota = false;
    }
  }
}
