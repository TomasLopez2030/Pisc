import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientesService/clientes.service';
import { LimpiezasService } from '../../services/limpiezasService/limpiezas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: true,
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
  imports: [CommonModule, FormsModule, NavbarComponent],
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  busqueda: string = '';
  clienteExpandido: number | null = null;
  pressTimer: any;
  mostrarPopup = false;
  clienteSeleccionado: any = null;
  mostrarCalendario = false;
  fechaSeleccionada = '';
  mostrarConfirmacionEliminar = false;
  clienteAEliminar: any = null;

  mostrarPopupCliente = false;

  menuAbierto: number | null = null;

  mostrarPopupEditarCliente = false;

  clienteEditando: any = null;

  nuevoCliente = {
    nombre: '',
    direccion: '',
    barrio: '',
    lote: '',
    manzana: '',
    telefono: '',
  };

  nuevaLimpieza = {
    clienteId: 0,
    fecha: '',
    estado: 'pendiente',
    precio: 0,
    observaciones: '',
    esFija: false,
    frecuencia: '',
  };

  constructor(
    private clientesService: ClientesService,
    private limpiezasService: LimpiezasService,
  ) {}

  ngOnInit() {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.clientesService.getClientes().subscribe((data) => {
      this.clientes = data;
    });
  }

  get clientesFiltrados() {
    return this.clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(this.busqueda.toLowerCase()),
    );
  }

  toggleCliente(id: number) {
    this.clienteExpandido = this.clienteExpandido === id ? null : id;
  }
  startPress(cliente: any) {
    this.pressTimer = setTimeout(() => {
      this.clienteSeleccionado = cliente;
      this.mostrarPopup = true;
    }, 700);
  }

  cancelPress() {
    clearTimeout(this.pressTimer);
  }

  cerrarPopup() {
    this.mostrarPopup = false;
    this.mostrarCalendario = false;
    this.clienteSeleccionado = null;
  }

  abrirCalendario() {
    this.mostrarCalendario = true;
  }

  volverPopup() {
    this.mostrarCalendario = false;
  }

  agregarLimpieza() {
    this.nuevaLimpieza = {
      ...this.nuevaLimpieza,
      clienteId: this.clienteSeleccionado.id,
      fecha: this.fechaSeleccionada,
      estado: 'pendiente',
      precio: 0,
      observaciones: '',
    };

    console.log('payload enviado:', this.nuevaLimpieza);

    this.limpiezasService.crearLimpieza(this.nuevaLimpieza).subscribe({
      next: () => {
        Swal.fire({
                  icon: 'success',
                  title: 'Limpieza agregada',
                  confirmButtonText: 'Listo',
                  confirmButtonColor: '#0d6efd'
                });
        this.cerrarPopup();
        this.mostrarCalendario = false;
        this.fechaSeleccionada = '';

        this.nuevaLimpieza = {
          clienteId: 0,
          fecha: '',
          estado: 'pendiente',
          precio: 0,
          observaciones: '',
          esFija: false,
          frecuencia: '',
        };
      },
      error: (err) => {
        console.error('ERROR COMPLETO:', err);
        console.error('STATUS:', err.status);
        console.error('BODY:', err.error);

        alert(JSON.stringify(err.error));
      },
    });
  }

  abrirPopupCliente() {
    this.mostrarPopupCliente = true;
  }

  cerrarPopupCliente() {
    this.mostrarPopupCliente = false;

    this.nuevoCliente = {
      nombre: '',
      direccion: '',
      barrio: '',
      lote: '',
      manzana: '',
      telefono: '',
    };
  }

  guardarCliente() {
    this.clientesService.crearCliente(this.nuevoCliente).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Cliente agregado',
          confirmButtonText: 'Listo',
          confirmButtonColor: '#0d6efd'
        });

        this.cerrarPopupCliente();
        this.obtenerClientes();
      },
      error: () => {
        alert('Error al guardar cliente');
      },
    });
  }

  toggleMenu(id: number) {
    this.menuAbierto = this.menuAbierto === id ? null : id;
  }

  editarCliente(cliente: any) {
    this.clienteEditando = { ...cliente };

    this.mostrarPopupEditarCliente = true;

    this.menuAbierto = null;
  }

  guardarEdicionCliente() {
    this.clientesService
      .actualizarCliente(this.clienteEditando.id, this.clienteEditando)
      .subscribe({
        next: () => {
          this.obtenerClientes();

          this.cerrarPopupEditarCliente();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  cerrarPopupEditarCliente() {
    this.mostrarPopupEditarCliente = false;

    this.clienteEditando = null;
  }

  eliminarCliente(cliente: any) {
    this.clienteAEliminar = cliente;
    this.mostrarConfirmacionEliminar = true;
    this.menuAbierto = null;
  }

  confirmarEliminar() {
    this.clientesService.eliminarCliente(this.clienteAEliminar.id).subscribe({
      next: () => {
        this.obtenerClientes();

        this.mostrarConfirmacionEliminar = false;
        this.clienteAEliminar = null;
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar cliente');
      },
    });
  }

  cancelarEliminar() {
    this.mostrarConfirmacionEliminar = false;
    this.clienteAEliminar = null;
  }
}
