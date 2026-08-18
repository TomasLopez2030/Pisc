import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LimpiezasService {
  private apiUrl = 'http://192.168.100.18:5130/api/limpiezas';

  constructor(private http: HttpClient) {}

  crearLimpieza(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getLimpiezas(fechaSemana: Date) {
    const yyyy = fechaSemana.getFullYear();
    const mm = String(fechaSemana.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaSemana.getDate()).padStart(2, '0');

    const fecha = `${yyyy}-${mm}-${dd}`;

    return this.http.get<any[]>(`${this.apiUrl}?fechaSemana=${fecha}`);
  }

  actualizarLimpieza(id: number, limpieza: any) {
    return this.http.put(`${this.apiUrl}/${id}`, limpieza);
  }

  eliminarLimpieza(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  reprogramarLimpieza(id: number, limpieza: any) {
    return this.http.put(`${this.apiUrl}/${id}`, limpieza);
  }

  agregarProducto(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregar-producto`, data);
  }

  quitarProducto(data: any) {
    return this.http.delete(`${this.apiUrl}/quitar-producto`, {
      body: data,
    });
  }

  actualizarCantidad(data: any) {
    return this.http.put(`${this.apiUrl}/actualizar-cantidad`, data);
  }

  eliminarFuturas(serieId: number, fecha: string) {
    return this.http.delete(`${this.apiUrl}/futuras/${serieId}/${fecha}`);
  }

  eliminarSerie(serieId: number) {
    return this.http.delete(`${this.apiUrl}/serie/${serieId}`);
  }

  getRegistroLimpiezas() {
    return this.http.get<any[]>(`${this.apiUrl}/registro`);
  }

  cambiarEstadoPago(id: number, estadoPago: string) {
    return this.http.patch(`${this.apiUrl}/${id}/estado-pago`, { estadoPago });
  }

  cambiarArchivado(id: number, archivada: boolean) {
    return this.http.patch(`${this.apiUrl}/${id}/archivado`, { archivada });
  }
}
