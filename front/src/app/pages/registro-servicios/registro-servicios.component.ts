import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ServiciosTecnicosService } from '../../services/serviciosTecnicosService/serviciosTecnicos.service';
import { BombasService } from '../../services/bombasService/bombas.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-registro-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './registro-servicios.component.html',
  styleUrl: './registro-servicios.component.css',
})
export class RegistroServiciosComponent implements OnInit {
  registros: any[] = [];

  clienteExpandido: string | null = null;

  menuDeudaVisible = false;
  menuPagoVisible = false;

  registroSeleccionado: any = null;

  busquedaArchivados = '';

  constructor(
    private serviciosService: ServiciosTecnicosService,
    private bombasService: BombasService,
  ) {}

  ngOnInit() {
    this.obtenerRegistros();
  }

  obtenerRegistros() {
    forkJoin({
      servicios: this.serviciosService.getServicios(),
      serviciosArchivados: this.serviciosService.getServiciosArchivados(),

      bombas: this.bombasService.getBombas(),
      bombasArchivadas: this.bombasService.getBombasArchivadas(),
    }).subscribe({
      next: ({ servicios, serviciosArchivados, bombas, bombasArchivadas }) => {
        console.log('SERVICIOS:', servicios);
        console.log('SERVICIOS ARCHIVADOS:', serviciosArchivados);

        console.log('BOMBAS:', bombas);
        console.log('BOMBAS ARCHIVADAS:', bombasArchivadas);
        const registrosServicios = servicios
          .filter((s: any) => s.estado === 'hecho')
          .map((s: any) => ({
            id: s.id,
            nombre: s.nombre,
            fecha: s.fecha,
            precio: s.precio,
            estadoPago: s.estadoPago,
            estado: s.estado,
            archivada: false,
            tipo: s.titulo || 'Servicio técnico',
            origen: 'servicio',
          }));

        const registrosServiciosArchivados = serviciosArchivados
          .filter((s: any) => s.estado === 'hecho')
          .map((s: any) => ({
            id: s.id,
            nombre: s.nombre,
            fecha: s.fecha,
            precio: s.precio,
            estadoPago: s.estadoPago,
            estado: s.estado,
            archivada: true,
            tipo: s.titulo || 'Servicio técnico',
            origen: 'servicio',
          }));

        const registrosBombas = bombas
          .filter((b: any) => b.estado === 'hecho')
          .map((b: any) => ({
            id: b.id,
            nombre: b.nombre,
            fecha: b.fecha,
            precio: b.precio,
            estadoPago: b.estadoPago,
            estado: b.estado,
            archivada: false,
            tipo: `${b.marca} ${b.hp}HP`,
            origen: 'bomba',
          }));

        const registrosBombasArchivadas = bombasArchivadas
          .filter((b: any) => b.estado === 'hecho')
          .map((b: any) => ({
            id: b.id,
            nombre: b.nombre,
            fecha: b.fecha,
            precio: b.precio,
            estadoPago: b.estadoPago,
            estado: b.estado,
            archivada: true,
            tipo: `${b.marca} ${b.hp}HP`,
            origen: 'bomba',
          }));

        this.registros = [
          ...registrosServicios,
          ...registrosServiciosArchivados,
          ...registrosBombas,
          ...registrosBombasArchivadas,
        ].sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
        );
        console.log('REGISTROS FINALES:', this.registros);
      },

      error: (err) => {
        console.error('ERROR AL OBTENER REGISTROS:', err);
      },
      
    });
  }

  toggleCliente(nombre: string) {
    this.clienteExpandido = this.clienteExpandido === nombre ? null : nombre;
  }

  agruparPorCliente(estadoPago: string): any[] {
    const grupos: any = {};

    this.registros
      .filter((r) => r.estadoPago === estadoPago && !r.archivada)
      .forEach((r) => {
        if (!grupos[r.nombre]) {
          grupos[r.nombre] = {
            nombre: r.nombre,
            registros: [],
          };
        }

        grupos[r.nombre].registros.push(r);
      });

    return Object.values(grupos) as any[];
  }

  abrirMenuDeuda(registro: any) {
    this.registroSeleccionado = registro;
    this.menuDeudaVisible = true;
  }

  cerrarMenuDeuda() {
    this.menuDeudaVisible = false;
    this.registroSeleccionado = null;
  }

  abrirMenuPago(registro: any) {
    this.registroSeleccionado = registro;
    this.menuPagoVisible = true;
  }

  cerrarMenuPago() {
    this.menuPagoVisible = false;
    this.registroSeleccionado = null;
  }

  marcarComoPagado() {
    if (this.registroSeleccionado.origen === 'servicio') {
      this.serviciosService
        .cambiarEstadoPago(this.registroSeleccionado.id, 'pagado')
        .subscribe(() => {
          this.obtenerRegistros();
          this.cerrarMenuDeuda();
        });
    } else {
      this.bombasService
        .cambiarEstadoPago(this.registroSeleccionado.id, 'pagado')
        .subscribe(() => {
          this.obtenerRegistros();
          this.cerrarMenuDeuda();
        });
    }
  }

  volverADebe() {
    if (this.registroSeleccionado.origen === 'servicio') {
      this.serviciosService
        .cambiarEstadoPago(this.registroSeleccionado.id, 'debe')
        .subscribe(() => {
          this.obtenerRegistros();
          this.cerrarMenuPago();
        });
    } else {
      this.bombasService
        .cambiarEstadoPago(this.registroSeleccionado.id, 'debe')
        .subscribe(() => {
          this.obtenerRegistros();
          this.cerrarMenuPago();
        });
    }
  }

  obtenerArchivados() {
    return this.registros.filter(
      (r) =>
        r.archivada &&
        r.nombre.toLowerCase().includes(this.busquedaArchivados.toLowerCase()),
    );
  }

  archivarPago() {
    if (this.registroSeleccionado.origen === 'servicio') {
      this.serviciosService
        .cambiarArchivado(this.registroSeleccionado.id, true)
        .subscribe(() => {
          this.menuPagoVisible = false;

          this.obtenerRegistros();
        });
    } else {
      this.bombasService
        .cambiarArchivado(this.registroSeleccionado.id, true)
        .subscribe(() => {
          this.menuPagoVisible = false;

          this.obtenerRegistros();
        });
    }
  }

  restaurarPago(registro: any) {
    if (registro.origen === 'servicio') {
      this.serviciosService
        .cambiarArchivado(registro.id, false)
        .subscribe(() => this.obtenerRegistros());
    } else {
      this.bombasService
        .cambiarArchivado(registro.id, false)
        .subscribe(() => this.obtenerRegistros());
    }
  }
}
