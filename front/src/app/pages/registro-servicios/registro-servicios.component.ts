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

      bombas: this.bombasService.getBombas(),
    }).subscribe({
      next: ({ servicios, bombas }) => {
        const registrosServicios = servicios
          .filter((s: any) => s.estado === 'hecho')
          .map((s: any) => ({
            id: s.id,

            nombre: s.nombre,

            fecha: s.fecha,

            precio: s.precio,

            estadoPago: s.estadoPago,

            estado: s.estado,

            archivada: s.archivada,

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

            archivada: b.archivada,

            tipo: `${b.marca} ${b.hp}HP`,

            origen: 'bomba',
          }));

        this.registros = [...registrosServicios, ...registrosBombas].sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
        );
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
