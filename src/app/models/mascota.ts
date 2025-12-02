import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { ApiConfig } from '../api.config'; // Importa la clase ApiConfig

export class Mascota {
  id?: number;
  nombre!: string;
  raza!: string;
  color!: string;
  especie!: string;
}

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private apiUrl = ApiConfig.baseUrl; // Usar la URL de la API desde ApiConfig

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.apiUrl);
  }

  crearMascota(data: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(this.apiUrl, data);
  }

  eliminarMascota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Formulario para mascota
  crearFormularioMascota(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      raza: ['', Validators.required],
      color: ['', Validators.required],
      especie: ['', Validators.required],
    });
  }

  // Obtener formulario de mascota para uso en el componente
  getMascotaFormulario(): FormGroup {
    return this.crearFormularioMascota();
  }
}
