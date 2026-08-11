import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LimpiezasService } from '../../services/limpiezasService/limpiezas.service';
import { ProductosService } from '../../services/productosService/productos.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro-mantenimientos',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './registro-mantenimientos.component.html',
  styleUrl: './registro-mantenimientos.component.css',
})
export class RegistroMantenimientosComponent implements OnInit {
  limpiezas: any[] = [];
  clienteExpandido: string | null = null;

  limpiezaSeleccionada: any = null;

  mostrarPopupEditar = false;
  menuDeudaVisible = false;

  limpiezaSeleccionadaMenu: any = null;

  productosDisponibles: any[] = [];
  

  busquedaProducto = '';
  menuPagoVisible = false;

  busquedaArchivados = '';

  constructor(
    private limpiezasService: LimpiezasService,
    private productosService: ProductosService,
  ) {}

  ngOnInit() {
    this.obtenerLimpiezas();
    this.obtenerProductos();
  }

  obtenerLimpiezas() {
  this.limpiezasService.getRegistroLimpiezas().subscribe({
    next: (data: any[]) => {
      console.table(
        data.map(l => ({
          id: l.id,
          nombre: l.nombreCliente,
          archivada: l.archivada,
          estadoPago: l.estadoPago
        }))
      );
      this.limpiezas = data;
    },
    error: (err) => {
      console.error(err);
    },
  });
}

  obtenerProductos() {
    this.productosService.getProductos().subscribe((data) => {
      this.productosDisponibles = data;
    });
  }

  toggleCliente(nombre: string) {
    this.clienteExpandido = this.clienteExpandido === nombre ? null : nombre;
  }

  get productosDisponiblesFiltrados() {
    return this.productosDisponibles.filter((producto) =>
      producto.nombre
        .toLowerCase()
        .includes(this.busquedaProducto.toLowerCase()),
    );
  }

  agruparPorCliente(estadoPago: string) {
    const filtradas = this.limpiezas.filter(
      (l) =>
        l.estadoPago?.toLowerCase() === estadoPago.toLowerCase() &&
        !l.archivada,
    );

    const agrupadas: any = {};

    filtradas.forEach((limpieza) => {
      if (!agrupadas[limpieza.nombreCliente]) {
        agrupadas[limpieza.nombreCliente] = [];
      }

      agrupadas[limpieza.nombreCliente].push(limpieza);
    });

    return Object.keys(agrupadas).map((cliente) => ({
      nombre: cliente,
      limpiezas: agrupadas[cliente],
    }));
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

  guardarEdicionLimpieza() {
    this.limpiezasService
      .actualizarLimpieza(
        this.limpiezaSeleccionada.id,
        this.limpiezaSeleccionada,
      )
      .subscribe(() => {
        this.obtenerLimpiezas();
        this.mostrarPopupEditar = false;
      });
  }

  agregarProductoALimpieza(producto: any) {
    if (!this.limpiezaSeleccionada.productos) {
      this.limpiezaSeleccionada.productos = [];
    }

    const existente = this.limpiezaSeleccionada.productos.find(
      (p: any) => p.id === producto.id,
    );

    if (existente) {
      existente.cantidad++;
    } else {
      this.limpiezaSeleccionada.productos.push({
        ...producto,
        cantidad: 1,
      });
    }
  }

  actualizarCantidadProducto(producto: any) {
    if (producto.cantidad < 1) {
      producto.cantidad = 1;
    }
  }

  quitarProductoDeLimpieza(producto: any) {
    this.limpiezaSeleccionada.productos =
      this.limpiezaSeleccionada.productos.filter(
        (p: any) => p.id !== producto.id,
      );
  }

  cerrarMenuDeuda() {
    this.menuDeudaVisible = false;
  }

  abrirEditarLimpieza() {
    this.limpiezaSeleccionada = {
      ...this.limpiezaSeleccionadaMenu,
      productos: this.limpiezaSeleccionadaMenu.productos
        ? [...this.limpiezaSeleccionadaMenu.productos]
        : [],
    };

    console.log('EDITAR');
    console.log(this.limpiezaSeleccionada);

    this.menuDeudaVisible = false;

    this.mostrarPopupEditar = true;
  }

  marcarComoPagado() {
    this.limpiezasService
      .cambiarEstadoPago(this.limpiezaSeleccionadaMenu.id, 'pagado')
      .subscribe(() => {
        this.obtenerLimpiezas();
        this.cerrarMenuDeuda();
      });
  }

  abrirMenuDeuda(limpieza: any) {
    this.limpiezaSeleccionadaMenu = limpieza;

    this.menuDeudaVisible = true;

    console.log('MENU');
    console.log(this.limpiezaSeleccionadaMenu);
  }

  cerrarPopupEditar() {
    this.mostrarPopupEditar = false;
  }

  abrirMenuPago(limpieza: any) {
    this.limpiezaSeleccionadaMenu = limpieza;

    this.menuPagoVisible = true;
  }

  volverADebe() {
    this.limpiezasService
      .cambiarEstadoPago(this.limpiezaSeleccionadaMenu.id, 'debe')
      .subscribe(() => {
        this.obtenerLimpiezas();
        this.cerrarMenuPago();
      });
  }

  cerrarMenuPago() {
    this.menuPagoVisible = false;
  }

  archivarPago() {
    this.limpiezasService
      .cambiarArchivado(this.limpiezaSeleccionadaMenu.id, true)
      .subscribe(() => {
        this.menuPagoVisible = false;
        this.obtenerLimpiezas();
      });
  }

  obtenerArchivados() {
    return this.limpiezas.filter(
      (l) =>
        l.archivada &&
        l.nombreCliente
          .toLowerCase()
          .includes(this.busquedaArchivados.toLowerCase()),
    );
  }

  restaurarPago(limpieza: any) {
    this.limpiezasService.cambiarArchivado(limpieza.id, false).subscribe(() => {
      this.obtenerLimpiezas();
    });
  }
}
