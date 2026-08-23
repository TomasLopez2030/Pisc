import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private apiUrl = 'http://100.72.205.3:5130/api/productos';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearProducto(producto: any) {
    return this.http.post(this.apiUrl, producto);
  }

  actualizarProducto(id: number, producto: any) {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
