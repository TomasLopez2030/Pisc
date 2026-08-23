import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { LimpiezasService } from '../../services/limpiezasService/limpiezas.service';
import { ProductosService } from '../../services/productosService/productos.service';
import { PlanificacionesClienteService } from '../../services/planificacionesClienteService/planificaciones-cliente.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-limpiezas',
  standalone: true,
  imports: [CommonModule, NavbarComponent, BottomNavComponent, FormsModule],
  templateUrl: './limpiezas.component.html',
  styleUrls: ['./limpiezas.component.css'],
})
export class LimpiezasComponent implements OnInit {
  mostrarPopupEstado = false;
  limpiezaSeleccionada: any = null;
  montoLimpieza = 0;
  totalGanancias = 0;
  mostrarPopupEliminar = false;
  mostrarReprogramar = false;
  nuevaFecha = '';
  mostrarPopupProductos = false;
  productoSeleccionadoId: number | null = null;
  productosDisponibles: any[] = [];
  busquedaProducto = '';
  fechaSemanaActual: Date = new Date();
  mostrarPopupPago = false;
  limpiezaPagoSeleccionada: any = null;
  planificaciones: any[] = [];
  opcionEliminar: 'individual' | 'futuras' | 'serie' = 'individual';
  menuAbierto: number | null = null;

  constructor(
    private limpiezasService: LimpiezasService,
    private productosService: ProductosService,
    private planificacionesService: PlanificacionesClienteService,
  ) {}

  dias = [
    { nombre: 'Lunes', abierto: false, limpiezas: [] as any[] },
    { nombre: 'Martes', abierto: false, limpiezas: [] as any[] },
    { nombre: 'Miércoles', abierto: false, limpiezas: [] as any[] },
    { nombre: 'Jueves', abierto: false, limpiezas: [] as any[] },
    { nombre: 'Viernes', abierto: false, limpiezas: [] as any[] },
    { nombre: 'Sábado', abierto: false, limpiezas: [] as any[] },
  ];

  ngOnInit() {
    this.obtenerProductos();
    this.obtenerPlanificaciones();
    this.obtenerLimpiezas();
    this.fechaSemanaActual = this.obtenerInicioSemana(new Date());
  }

  obtenerInicioSemana(fecha: Date): Date {
    const inicio = new Date(fecha);

    const dia = inicio.getDay(); // Domingo=0, Lunes=1...

    const diferencia = dia === 0 ? -6 : 1 - dia;

    inicio.setDate(inicio.getDate() + diferencia);
    inicio.setHours(0, 0, 0, 0);

    return inicio;
  }

  obtenerLimpiezas() {
    this.fechaSemanaActual = this.obtenerInicioSemana(this.fechaSemanaActual);

    this.limpiezasService
      .getLimpiezas(this.fechaSemanaActual)
      .subscribe((data: any[]) => {
        this.dias.forEach((d) => (d.limpiezas = []));

        const diasSemana = [
          'Domingo',
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
        ];

        data.forEach((limpieza) => {
          limpieza.expandido = false;

          if (!limpieza.productos) {
            limpieza.productos = [];
          }

          const fechaLimpieza = new Date(limpieza.fecha);

          const nombreDia = diasSemana[fechaLimpieza.getDay()];

          const diaEncontrado = this.dias.find((d) => d.nombre === nombreDia);

          if (diaEncontrado) {
            diaEncontrado.limpiezas.push(limpieza);
          }
        });

        this.calcularGanancias();
      });
  }

  semanaAnterior() {
    this.fechaSemanaActual.setDate(this.fechaSemanaActual.getDate() - 7);
    this.obtenerLimpiezas();
  }

  semanaSiguiente() {
    this.fechaSemanaActual.setDate(this.fechaSemanaActual.getDate() + 7);
    this.obtenerLimpiezas();
  }

  obtenerPlanificaciones() {
    this.planificacionesService.getPlanificaciones().subscribe((data) => {
      console.log('PLANIFICACIONES');
      console.log(data);

      this.planificaciones = data;

      this.obtenerLimpiezas();
    });
  }

  toggleMenu(id: number) {
    this.menuAbierto = this.menuAbierto === id ? null : id;
  }

  obtenerProductos() {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productosDisponibles = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  get productosDisponiblesFiltrados() {
    return this.productosDisponibles.filter((producto) =>
      producto.nombre
        .toLowerCase()
        .includes(this.busquedaProducto.toLowerCase()),
    );
  }

  get rangoSemana(): string {
    const inicio = new Date(this.fechaSemanaActual);
    const fin = new Date(this.fechaSemanaActual);

    fin.setDate(inicio.getDate() + 6);

    return `${inicio.toLocaleDateString()} - ${fin.toLocaleDateString()}`;
  }

  toggleDia(dia: any) {
    dia.abierto = !dia.abierto;
  }

  abrirPopupEstado(limpieza: any) {
    this.limpiezaSeleccionada = limpieza;
    this.montoLimpieza = limpieza.precio || 0;
    this.mostrarPopupEstado = true;
  }

  cerrarPopupEstado() {
    this.mostrarPopupEstado = false;
    this.limpiezaSeleccionada = null;
    this.montoLimpieza = 0;
    this.mostrarReprogramar = false;
    this.nuevaFecha = '';
  }

  marcarComoHecho() {
    this.limpiezaPagoSeleccionada = {
      ...this.limpiezaSeleccionada,
      precio: this.montoLimpieza,
    };

    this.mostrarPopupEstado = false;
    this.mostrarPopupPago = true;
  }

  volverPendiente() {
    const limpiezaActualizada = {
      ...this.limpiezaSeleccionada,
      estado: 'pendiente',
      precio: 0,
      estadoPago: 'pendiente',
    };

    this.limpiezasService
      .actualizarLimpieza(this.limpiezaSeleccionada.id, limpiezaActualizada)
      .subscribe({
        next: () => {
          this.obtenerLimpiezas();
          this.cerrarPopupEstado();
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar limpieza');
        },
      });
  }

  calcularGanancias() {
    let total = 0;

    this.dias.forEach((dia) => {
      dia.limpiezas.forEach((limpieza: any) => {
        if (limpieza.estado.toLowerCase() === 'hecho') {
          let totalProductos = 0;

          if (limpieza.productos) {
            totalProductos = limpieza.productos.reduce(
              (acc: number, producto: any) =>
                acc + producto.precio * producto.cantidad,
              0,
            );
          }

          total += limpieza.precio + totalProductos;
        }
      });
    });

    this.totalGanancias = total;
  }

  calcularTotalLimpieza(limpieza: any): number {
    let totalProductos = 0;

    if (limpieza.productos) {
      totalProductos = limpieza.productos.reduce(
        (acc: number, producto: any) =>
          acc + producto.precio * producto.cantidad,
        0,
      );
    }

    return limpieza.precio + totalProductos;
  }

  abrirPopupEliminar(limpieza: any) {
    console.log('Limpieza recibida:', limpieza);
    this.limpiezaSeleccionada = limpieza;
    console.log('SELECCIONADA:', this.limpiezaSeleccionada);
    this.opcionEliminar = 'individual';
    this.mostrarPopupEliminar = true;
  }

  cerrarPopupEliminar() {
    this.mostrarPopupEliminar = false;
  }

  eliminarLimpieza() {
    console.log('Eliminar:', this.limpiezaSeleccionada);
    console.log(this.opcionEliminar);
    console.log(this.limpiezaSeleccionada);
    if (!this.limpiezaSeleccionada.esFija) {
      this.limpiezasService
        .eliminarLimpieza(this.limpiezaSeleccionada.id)
        .subscribe(() => {
          this.obtenerLimpiezas();
          this.cerrarPopupEliminar();
        });

      return;
    }

    switch (this.opcionEliminar) {
      case 'individual':
        console.log('ELIMINAR INDIVIDUAL');
        this.limpiezasService
          .eliminarLimpieza(this.limpiezaSeleccionada.id)
          .subscribe({
            next: (r) => {
              console.log('OK', r);
              this.obtenerLimpiezas();
              this.cerrarPopupEliminar();
            },
            error: (e) => {
              console.error('ERROR', e);
            },
          });

        break;

      case 'futuras':
        console.log('ELIMINAR FUTURAS');
        this.limpiezasService
          .eliminarFuturas(
            this.limpiezaSeleccionada.serieId,
            this.limpiezaSeleccionada.fecha,
          )
          .subscribe({
            next: () => {
              this.obtenerLimpiezas();
              this.cerrarPopupEliminar();
            },
            error: (err) => {
              console.error(err);
            },
          });

        break;

      case 'serie':
        console.log('ELIMINAR SERIE');
        this.limpiezasService
          .eliminarSerie(this.limpiezaSeleccionada.serieId)
          .subscribe(() => {
            this.obtenerLimpiezas();
            this.cerrarPopupEliminar();
          });

        break;
    }
  }

  reprogramarLimpieza() {
    const limpiezaActualizada = {
      ...this.limpiezaSeleccionada,
      fecha: this.nuevaFecha,
    };

    this.limpiezasService
      .actualizarLimpieza(this.limpiezaSeleccionada.id, limpiezaActualizada)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Limpieza reprogramada',
            confirmButtonText: 'Listo',
            confirmButtonColor: '#0d6efd',
          });
          this.obtenerLimpiezas();
          this.cerrarPopupEstado();
        },
        error: (err) => {
          console.error(err);
          alert('Error al reprogramar');
        },
      });
  }

  toggleDetalle(limpieza: any) {
    limpieza.expandido = !limpieza.expandido;
  }

  abrirPopupProductos(limpieza: any) {
    this.limpiezaSeleccionada = limpieza;
    this.mostrarPopupProductos = true;
  }

  cerrarPopupProductos() {
    this.mostrarPopupProductos = false;
    this.productoSeleccionadoId = null;
  }

  agregarProductoALimpieza(producto: any) {
    console.log('click + producto:', producto);
    console.log('limpieza seleccionada:', this.limpiezaSeleccionada);
    console.log('cantidad enviada:', producto.cantidad);
    this.limpiezasService
      .agregarProducto({
        limpiezaId: this.limpiezaSeleccionada.id,
        productoId: producto.id,
        cantidad: producto.cantidad,
      })
      .subscribe({
        next: (resp) => {
          console.log('producto agregado OK', resp);

          if (!this.limpiezaSeleccionada.productos) {
            this.limpiezaSeleccionada.productos = [];
          }

          this.limpiezaSeleccionada.productos.push({
            ...producto,
            cantidad: producto.cantidad,
          });
        },
        error: (err) => {
          console.error('error agregar producto', err);
          alert(JSON.stringify(err.error));
        },
      });
  }

  quitarProductoDeLimpieza(producto: any) {
    const data = {
      limpiezaId: this.limpiezaSeleccionada.id,
      productoId: producto.id,
    };

    console.log('Quitando producto:', data);

    this.limpiezasService.quitarProducto(data).subscribe({
      next: () => {
        console.log('Producto eliminado correctamente');
        this.limpiezaSeleccionada.productos =
          this.limpiezaSeleccionada.productos.filter(
            (p: any) => p.id !== producto.id,
          );
      },
      error: (err) => {
        console.error('Error al quitar producto:', err);
      },
    });
  }

  actualizarCantidadProducto(producto: any) {
    const data = {
      limpiezaId: this.limpiezaSeleccionada.id,
      productoId: producto.id,
      cantidad: producto.cantidad,
    };

    console.log('ENVIANDO:', data);

    this.limpiezasService.actualizarCantidad(data).subscribe({
      next: (resp) => console.log('OK', resp),
      error: (err) => console.error('ERROR', err),
    });
  }

  marcarPago(estadoPago: string) {
    const limpiezaActualizada = {
      ...this.limpiezaPagoSeleccionada,
      estado: 'hecho',
      precio: this.montoLimpieza,
      estadoPago: estadoPago,
    };

    this.limpiezasService
      .actualizarLimpieza(limpiezaActualizada.id, limpiezaActualizada)
      .subscribe({
        next: () => {
          this.obtenerLimpiezas();

          this.mostrarPopupPago = false;

          this.limpiezaSeleccionada = null;
          this.limpiezaPagoSeleccionada = null;

          this.montoLimpieza = 0;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  manejarClickEstado(limpieza: any) {
    if (limpieza.estado.toLowerCase() === 'pendiente') {
      this.abrirPopupEstado(limpieza);
      return;
    }

    this.abrirPopupEstado(limpieza);
  }

  abrirPopupPago(limpieza: any) {
    this.limpiezaPagoSeleccionada = limpieza;
    this.mostrarPopupPago = true;
    this.mostrarReprogramar = false;
    this.mostrarPopupEstado = false;
  }
}
