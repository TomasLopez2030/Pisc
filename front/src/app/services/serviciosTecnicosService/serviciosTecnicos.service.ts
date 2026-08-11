import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiciosTecnicosService {
  private apiUrl = 'http://localhost:5130/api/serviciostecnicos';

  constructor(private http: HttpClient) {}

  getServicios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearServicio(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  actualizarServicio(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  actualizarServicioTecnico(id: number, servicio: any) {
    return this.http.put(`${this.apiUrl}/${id}`, servicio);
  }

  eliminarServicio(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  eliminarCliente(nombre: string) {
    return this.http.delete(
      `${this.apiUrl}/cliente/${encodeURIComponent(nombre)}`,
    );
  }

  cambiarEstadoPago(id: number, estadoPago: string) {
    return this.http.patch(`${this.apiUrl}/${id}/estado-pago`, {
      estadoPago,
    });
  }

  cambiarArchivado(id: number, archivada: boolean) {
    return this.http.patch(`${this.apiUrl}/${id}/archivado`, {
      archivada,
    });
  }

  subirFoto(id: number, formData: FormData) {
    return this.http.post(`${this.apiUrl}/${id}/foto`, formData);
  }

  eliminarFoto(idFoto: number) {
    return this.http.delete(`${this.apiUrl}/foto/${idFoto}`);
  }
}
