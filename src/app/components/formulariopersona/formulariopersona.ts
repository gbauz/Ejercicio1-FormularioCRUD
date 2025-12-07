import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { ApiConfig } from '../../api.config';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';

export class Persona {
  id?: number;
  nombre!: string;
  fechaNacimiento!: string | Date;  // aceptamos string o Date
  estatura!: number;
}

@Component({
  selector: 'app-formulariopersona',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,      // *ngIf, *ngFor
    DatePipe,          // pipe date en el HTML
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './formulariopersona.html',
  styleUrls: ['./formulariopersona.css'],
})
export class Formulariopersona implements OnInit {

  personaForm: FormGroup;
  personasDataSource: MatTableDataSource<Persona>;
  displayedColumns: string[] = ['id', 'nombre', 'fechaNacimiento', 'estatura', 'acciones'];
  selectedPersona: Persona | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.personaForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      estatura: ['', Validators.required],
    });

    this.personasDataSource = new MatTableDataSource<Persona>([]);
  }

  ngOnInit(): void {
    this.getPersonas();
  }

  // Getters
  get id() { return this.personaForm.get('id')!; }
  get nombre() { return this.personaForm.get('nombre')!; }
  get fechaNacimiento() { return this.personaForm.get('fechaNacimiento')!; }
  get estatura() { return this.personaForm.get('estatura')!; }

  // ============================
  //         CRUD API
  // ============================

  // Obtener personas desde la API
  getPersonas(): void {
    const apiUrl = ApiConfig.baseUrl + 'Personas';  // cambia 'Personas' si tu endpoint se llama distinto
    console.log('GET ->', apiUrl);

    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        console.log('Respuesta cruda backend Personas:', response);

        let data: Persona[] = [];

        // Caso 1: el backend devuelve directamente un array [ {...}, {...} ]
        if (Array.isArray(response)) {
          data = response as Persona[];
        }
        // Caso 2: el backend devuelve { data: [ ... ] }
        else if (Array.isArray(response?.data)) {
          data = response.data as Persona[];
        } else {
          console.warn('Formato de respuesta no reconocido. Ajusta el mapeo en getPersonas()');
        }

        console.log('Personas mapeadas para la tabla:', data);
        this.personasDataSource.data = data;
      },
      (error) => {
        console.error('Error al obtener personas:', error);
      }
    );
  }

  // Crear o actualizar persona
  onSubmit(): void {
    if (this.personaForm.invalid) {
      this.personaForm.markAllAsTouched();
      return;
    }

    if (this.selectedPersona) {
      // EDITAR (PUT)
      const dataToSend = {
        id: this.selectedPersona.id,
        ...this.personaForm.value
      };

      const apiUrl = `${ApiConfig.baseUrl}Personas/${this.selectedPersona.id}`;
      console.log('PUT ->', apiUrl, dataToSend);

      this.http.put(apiUrl, dataToSend).subscribe(
        (response) => {
          console.log('Persona actualizada:', response);
          this.getPersonas();
          this.selectedPersona = null;
          this.personaForm.reset();
        },
        (error) => {
          console.error('Error al actualizar persona:', error);
        }
      );
    } else {
      // CREAR (POST) – excluimos id
      const { id, ...dataToSend } = this.personaForm.value;
      const apiUrl = `${ApiConfig.baseUrl}Personas`;
      console.log('POST ->', apiUrl, dataToSend);

      this.http.post(apiUrl, dataToSend).subscribe(
        (response) => {
          console.log('Persona creada:', response);
          this.getPersonas();
          this.personaForm.reset();
        },
        (error) => {
          console.error('Error al crear persona:', error);
        }
      );
    }
  }

  // Cargar datos en el formulario para editar
  editPersona(persona: Persona): void {
    this.selectedPersona = persona;
    console.log('Persona seleccionada para editar:', persona);

    this.personaForm.reset();
    setTimeout(() => {
      this.personaForm.setValue({
        id: persona.id,
        nombre: persona.nombre,
        // si tu API manda string de fecha, aquí puede ir directamente
        fechaNacimiento: persona.fechaNacimiento,
        estatura: persona.estatura
      });
    }, 0);
  }

  // Eliminar persona
  deletePersona(id: number): void {
    const apiUrl = `${ApiConfig.baseUrl}Persona/${id}`;
    console.log('DELETE ->', apiUrl);

    this.http.delete(apiUrl).subscribe(
      () => {
        console.log('Persona eliminada');
        this.getPersonas();
      },
      (error) => {
        console.error('Error al eliminar persona:', error);
      }
    );
  }
}
