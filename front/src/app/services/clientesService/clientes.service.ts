import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private apiUrl = 'http://100.105.172.64:5130/api/clientes';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearCliente(cliente: any) {
    return this.http.post(this.apiUrl, cliente);
  }

  editarProducto(id: number, producto: any) {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  actualizarCliente(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  eliminarCliente(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
