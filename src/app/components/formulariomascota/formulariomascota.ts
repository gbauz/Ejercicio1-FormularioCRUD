import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { ApiConfig } from '../../api.config';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export class Mascota {
  id?: number;
  nombre!: string;
  raza!: string;
  color!: string;
  especie!: string;
}

@Component({
  selector: 'app-formulariomascota',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './formulariomascota.html',
  styleUrls: ['./formulariomascota.css'],
})
export class Formulariomascota implements OnInit {

  mascotaForm: FormGroup;
  mascotasDataSource: MatTableDataSource<Mascota>;
  displayedColumns: string[] = ['id', 'nombre', 'raza', 'color', 'especie', 'acciones'];
  selectedMascota: Mascota | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.mascotaForm = this.fb.group({
      id: [''],                     // id incluido para edición
      nombre: ['', Validators.required],
      raza: ['', Validators.required],
      color: ['', Validators.required],
      especie: ['', Validators.required],
    });

    this.mascotasDataSource = new MatTableDataSource<Mascota>([]);
  }

  ngOnInit(): void {
    this.getMascotas();
  }

  // Getters para validación
  get id() { return this.mascotaForm.get('id')!; }
  get nombre() { return this.mascotaForm.get('nombre')!; }
  get raza() { return this.mascotaForm.get('raza')!; }
  get color() { return this.mascotaForm.get('color')!; }
  get especie() { return this.mascotaForm.get('especie')!; }


  // ============================
  //        CRUD API
  // ============================

  getMascotas(): void {
    const apiUrl = ApiConfig.baseUrl + 'Mascotas';
    this.http.get<Mascota[]>(apiUrl).subscribe(
      (data) => {
        this.mascotasDataSource.data = data;
      },
      (error) => console.error('Error al obtener mascotas:', error)
    );
  }

  onSubmit(): void {
    if (this.mascotaForm.invalid) {
      this.mascotaForm.markAllAsTouched();
      return;
    }

    if (this.selectedMascota) {
      // ========================
      //        EDITAR (PUT)
      // ========================
      const dataToSend = {
        id: this.selectedMascota.id,
        ...this.mascotaForm.value
      };

      const apiUrl = `${ApiConfig.baseUrl}Mascotas/${this.selectedMascota.id}`;
      this.http.put(apiUrl, dataToSend).subscribe(
        () => {
          this.getMascotas();
          this.selectedMascota = null;
          this.mascotaForm.reset();
        },
        error => console.error('Error al actualizar mascota:', error)
      );

    } else {
      // ========================
      //       CREAR (POST)
      // ========================
      const { id, ...dataToSend } = this.mascotaForm.value;
      const apiUrl = `${ApiConfig.baseUrl}Mascotas`;

      this.http.post(apiUrl, dataToSend).subscribe(
        () => {
          this.getMascotas();
          this.mascotaForm.reset();
        },
        error => console.error('Error al crear mascota:', error)
      );
    }
  }

  // ========================
  //       EDITAR
  // ========================
  editMascota(mascota: Mascota): void {
    this.selectedMascota = mascota;
    this.mascotaForm.reset();

    setTimeout(() => {
      this.mascotaForm.setValue({
        id: mascota.id,
        nombre: mascota.nombre,
        raza: mascota.raza,
        color: mascota.color,
        especie: mascota.especie
      });
    }, 0);
  }

  // ========================
  //      ELIMINAR
  // ========================
  deleteMascota(id: number): void {
    const apiUrl = `${ApiConfig.baseUrl}Mascotas/${id}`;
    this.http.delete(apiUrl).subscribe(
      () => this.getMascotas(),
      error => console.error('Error al eliminar mascota:', error)
    );
  }
}
