import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ProductosService } from '../../services/productosService/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  standalone: true,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
  imports: [CommonModule, FormsModule, NavbarComponent],
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  busqueda = '';
  pressTimer: any;
  productoSeleccionado: any = null;
  mostrarPopup = false;
  mostrarPopupProducto = false;
  mostrarPopupEditar = false;
  mostrarConfirmacionEliminar = false;
  productosDisponibles: any[] = [];

  nuevoProducto = {
    nombre: '',
    precio: 0,
  };

  productoEditando = {
    id: 0,
    nombre: '',
    precio: 0,
  };

  constructor(private productosService: ProductosService) {}

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosDisponibles = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  get productosFiltrados() {
    return this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(this.busqueda.toLowerCase()),
    );
  }

  startPress(producto: any) {
    this.pressTimer = setTimeout(() => {
      this.productoSeleccionado = producto;
      this.mostrarPopup = true;
    }, 700);
  }

  cancelPress() {
    clearTimeout(this.pressTimer);
  }

  cerrarPopup() {
    this.mostrarPopup = false;
    this.productoSeleccionado = null;
  }

  abrirPopupProducto() {
    this.mostrarPopupProducto = true;
  }

  cerrarPopupProducto() {
    this.mostrarPopupProducto = false;

    this.nuevoProducto = {
      nombre: '',
      precio: 0,
    };
  }

  guardarProducto() {
    console.log('producto enviado:', this.nuevoProducto);

    this.productosService.crearProducto(this.nuevoProducto).subscribe({
      next: (resp) => {
        Swal.fire({
          icon: 'success',
          title: 'Producto agregado',
          confirmButtonText: 'Listo',
          confirmButtonColor: '#0d6efd'
        });

        this.obtenerProductos();
        this.cerrarPopupProducto();
      },
      error: (err) => {
        console.error(err);
        alert('Error al guardar producto');
      },
    });
  }

  editarProducto() {
    this.productoEditando = {
      id: this.productoSeleccionado.id,
      nombre: this.productoSeleccionado.nombre,
      precio: this.productoSeleccionado.precio,
    };

    this.mostrarPopupEditar = true;
    this.mostrarPopup = false;
  }

  guardarEdicion() {
    this.productosService
      .actualizarProducto(this.productoEditando.id, this.productoEditando)
      .subscribe({
        next: () => {
          Swal.fire({
          icon: 'success',
          title: 'Producto actualizado',
          confirmButtonText: 'Listo',
          confirmButtonColor: '#0d6efd' 
        });

          this.obtenerProductos();
          this.cerrarPopupEditar();
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar producto');
        },
      });
  }

  cerrarPopupEditar() {
    this.mostrarPopupEditar = false;
  }

  eliminarProducto() {
    this.mostrarConfirmacionEliminar = true;
    this.mostrarPopup = false;
  }

  confirmarEliminar() {
    this.productosService
      .eliminarProducto(this.productoSeleccionado.id)
      .subscribe({
        next: () => {
          this.obtenerProductos();

          this.mostrarConfirmacionEliminar = false;
          this.productoSeleccionado = null;
        },
        error: (err) => {
          console.error(err);
          alert('Error al eliminar el producto');
        },
      });
  }

  cancelarEliminar() {
    this.mostrarConfirmacionEliminar = false;
  }
}
