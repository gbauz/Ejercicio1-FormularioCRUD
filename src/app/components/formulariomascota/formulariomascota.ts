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
import { MatIconModule } from '@angular/material/icon';  // Importar MatIconModule

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
  imports: [ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTableModule],  // Agregar MatTableModule aquí
  templateUrl: './formulariomascota.html',
  styleUrls: ['./formulariomascota.css'],
})
export class Formulariomascota implements OnInit {
  mascotaForm: FormGroup;
  mascotasDataSource: MatTableDataSource<Mascota>;  // Tipo de datos para la tabla
  displayedColumns: string[] = ['id', 'nombre', 'raza', 'color', 'especie', 'acciones'];  // Añadir 'acciones' a las columnas
  selectedMascota: Mascota | null = null;  // Para saber si estamos editando una mascota

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

  // Método para enviar el formulario y agregar o actualizar una mascota
  onSubmit(): void {
    if (this.mascotaForm.valid) {
      if (this.selectedMascota) {
        // Si estamos editando, realizamos PUT
        console.log('ID de la mascota seleccionada:', this.selectedMascota.id);
        console.log('Datos a enviar al PUT:', this.mascotaForm.value);

        const apiUrl = `${ApiConfig.baseUrl}Mascotas/${this.selectedMascota.id}`;
        this.http.put(apiUrl, this.mascotaForm.value).subscribe(
          (response) => {
            console.log('Respuesta de la actualización:', response);
            this.getMascotas();  // Recargamos las mascotas después de editar
            this.selectedMascota = null;  // Limpiamos la selección
            this.mascotaForm.reset();  // Limpiamos el formulario
          },
          (error) => {
            console.error('Error al actualizar la mascota:', error);  // Imprimir el error de la API
          }
        );
      } else {
        // Si no estamos editando, hacemos POST para crear una nueva
        console.log('Creando nueva mascota con los datos:', this.mascotaForm.value);
        const apiUrl = `${ApiConfig.baseUrl}Mascotas`;
        this.http.post(apiUrl, this.mascotaForm.value).subscribe(
          (response) => {
            console.log('Mascota creada con éxito:', response);
            this.getMascotas();  // Recargamos las mascotas después de agregar
            this.mascotaForm.reset();  // Limpiamos el formulario
          },
          (error) => {
            console.error('Error al crear la mascota:', error);  // Imprimir el error
          }
        );
      }
    } else {
      this.mascotaForm.markAllAsTouched();  // Marcar todos los campos como tocados para mostrar errores
    }
  }

  // Método para editar una mascota
  editMascota(mascota: Mascota): void {
    this.selectedMascota = mascota;  // Guardamos la mascota seleccionada
    console.log('Mascota seleccionada para editar:', mascota);  // Verificar qué datos estamos cargando en el formulario
    this.mascotaForm.setValue({
      nombre: mascota.nombre,
      raza: mascota.raza,
      color: mascota.color,
      especie: mascota.especie
    });
  }

  // Método para eliminar una mascota
  deleteMascota(id: number): void {
    const apiUrl = `${ApiConfig.baseUrl}Mascotas/${id}`;  // Usar la URL de la API desde ApiConfig
    this.http.delete(apiUrl).subscribe(() => {
      this.getMascotas();  // Recargamos la lista después de eliminar la mascota
    });
  }
}
