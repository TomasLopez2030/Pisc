import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BombasService {
  private apiUrl = 'http://localhost:5130/api/bombas';

  constructor(private http: HttpClient) {}

  getBombas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getBombasArchivadas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/archivados`);
  }

  crearBomba(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  actualizarBomba(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  eliminarBomba(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  eliminarCliente(nombre: string) {
    return this.http.delete(`${this.apiUrl}/cliente/${nombre}`);
  }

  subirFoto(id: number, formData: FormData) {
    return this.http.post(`${this.apiUrl}/${id}/foto`, formData);
  }

  eliminarFoto(idFoto: number) {
    return this.http.delete(`${this.apiUrl}/foto/${idFoto}`);
  }

  cambiarArchivado(id: number, archivada: boolean) {
    return this.http.patch(`${this.apiUrl}/${id}/archivado`, { archivada });
  }

  cambiarEstadoPago(id: number, estadoPago: string) {
    return this.http.patch(`${this.apiUrl}/${id}/estado-pago`, {
      estadoPago,
    });
  }
}
