import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  // Usamos HttpClient para hacer peticiones
import { MatTableDataSource } from '@angular/material/table';  // Importar MatTableDataSource
import { ApiConfig } from '../../api.config';  // Usar la URL base configurada
import { MatSelectModule } from '@angular/material/select';  // Asegúrate de importar MatSelectModule
import { MatInputModule } from '@angular/material/input';  // Importar MatInputModule
import { MatFormFieldModule } from '@angular/material/form-field';  // Importar MatFormFieldModule
import { ReactiveFormsModule } from '@angular/forms';  // Asegúrate de importar ReactiveFormsModule
import { MatTableModule } from '@angular/material/table';  // Importar MatTableModule

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
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTableModule],  // Agregar MatTableModule aquí
  templateUrl: './formulariomascota.html',
  styleUrls: ['./formulariomascota.css'],
})
export class Formulariomascota implements OnInit {
  mascotaForm: FormGroup;
  mascotasDataSource: MatTableDataSource<Mascota>;  // Tipo de datos para la tabla
  displayedColumns: string[] = ['id', 'nombre', 'raza', 'color', 'especie'];  // Columnas para mostrar en la tabla

  constructor(
    private fb: FormBuilder,
    private http: HttpClient  // Usamos HttpClient directamente
  ) {
    this.mascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      raza: ['', Validators.required],
      color: ['', Validators.required],
      especie: ['', Validators.required],
    });
    this.mascotasDataSource = new MatTableDataSource<Mascota>([]);
  }

  ngOnInit(): void {
    this.getMascotas();  // Llamamos al método para obtener las mascotas desde la API
  }

  get nombre() { return this.mascotaForm.get('nombre')!; }
  get raza() { return this.mascotaForm.get('raza')!; }
  get color() { return this.mascotaForm.get('color')!; }
  get especie() { return this.mascotaForm.get('especie')!; }

  // Método para obtener las mascotas desde la API
  getMascotas(): void {
    const apiUrl = ApiConfig.baseUrl + 'Mascotas';  // Usar la URL de la API desde ApiConfig
    this.http.get<Mascota[]>(apiUrl).subscribe((data) => {
      this.mascotasDataSource.data = data;  // Asignamos los datos a la tabla
    });
  }

  // Método para enviar el formulario y agregar una nueva mascota
  onSubmit(): void {
    if (this.mascotaForm.valid) {
      console.log('Datos de la mascota:', this.mascotaForm.value);
      const apiUrl = ApiConfig.baseUrl + 'Mascotas';  // Usar la URL de la API desde ApiConfig
      this.http.post(apiUrl, this.mascotaForm.value).subscribe(() => {
        this.getMascotas();  // Recargamos las mascotas después de agregar una nueva
      });
    } else {
      this.mascotaForm.markAllAsTouched();
    }
  }
}
