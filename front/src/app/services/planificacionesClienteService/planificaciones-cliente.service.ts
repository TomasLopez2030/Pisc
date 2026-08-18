import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlanificacionesClienteService {
  private apiUrl = 'http://192.168.100.18:5130/api/Planificaciones';

  constructor(private http: HttpClient) {}

  getPlanificaciones() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
