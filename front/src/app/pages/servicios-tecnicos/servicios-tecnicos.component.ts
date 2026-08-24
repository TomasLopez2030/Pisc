import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ClientesService } from '../../services/clientesService/clientes.service';
import { ServiciosTecnicosService } from '../../services/serviciosTecnicosService/serviciosTecnicos.service';
import { BombasService } from '../../services/bombasService/bombas.service';

@Component({
  selector: 'app-servicios-tecnicos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './servicios-tecnicos.component.html',
  styleUrl: './servicios-tecnicos.component.css',
})
export class ServiciosTecnicosComponent {
  servicios: any[] = [];
  clientes: any[] = [];

  mostrarPopup = false;
  mostrarPopupEstado = false;

  clienteExpandido: string | null = null;

  servicioSeleccionado: any = null;
  precioServicio = 0;

  fotoSeleccionada: any = null;

  servicioFotoSeleccionada: any = null;

  busquedaCliente = '';
  mostrarSugerencias = false;

  menuAbierto: number | null = null;

  modoEdicion = false;
  servicioEditandoId: number | null = null;

  servicioEditando: any = null;
  mostrarPopupEditar = false;

  busqueda = '';

  longPressTimer: any;

  clienteSeleccionado: string | null = null;

  mostrarMenuCliente = false;
  mostrarConfirmacionCliente = false;

  mostrarConfirmacionEliminarCliente = false;

  servicioFotoSeleccionado: any = null;

  mostrarPopupEliminarServicio = false;
  servicioAEliminar: any = null;

  

  fotoAEliminar: any = null;
  servicioFotoAEliminar: any = null;

  mostrarPopupEliminarFoto = false;

  nuevoRegistro = {
    fecha: '',
    titulo: '',
    nombre: '',
    telefono: '',
    direccion: '',
    barrio: '',
    lote: '',
    manzana: '',

    diagnostico: '',
    trabajoRealizado: '',
    observaciones: '',

    incluirBomba: false,
    hp: '',
    marca: '',
    realizar: '',
  };

  constructor(
    private serviciosService: ServiciosTecnicosService,
    private clientesService: ClientesService,
    private bombasService: BombasService,
  ) {}

  ngOnInit() {
    this.obtenerServicios();
    this.obtenerClientes();
  }

  obtenerServicios() {
    this.serviciosService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
      },
    });
  }

  obtenerClientes() {
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
    });
  }

  get clientesFiltrados() {
    return this.clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(this.busquedaCliente.toLowerCase()),
    );
  }

  seleccionarCliente(cliente: any) {
    this.nuevoRegistro.nombre = cliente.nombre;
    this.nuevoRegistro.telefono = cliente.telefono || '';
    this.nuevoRegistro.direccion = cliente.direccion || '';
    this.nuevoRegistro.barrio = cliente.barrio || '';
    this.nuevoRegistro.lote = cliente.lote || '';
    this.nuevoRegistro.manzana = cliente.manzana || '';

    this.busquedaCliente = cliente.nombre;
    this.mostrarSugerencias = false;
  }

  get clientesAgrupados(): any[] {
    const grupos: any = {};

    this.servicios.forEach((servicio) => {
      // FILTRO POR CLIENTE
      if (
        this.busqueda &&
        !servicio.nombre?.toLowerCase().includes(this.busqueda.toLowerCase())
      ) {
        return;
      }

      if (!grupos[servicio.nombre]) {
        grupos[servicio.nombre] = {
          nombre: servicio.nombre,
          servicios: [],
        };
      }

      grupos[servicio.nombre].servicios.push(servicio);
    });

    return Object.values(grupos).map((cliente: any) => ({
      ...cliente,

      estadoGeneral: cliente.servicios.every((s: any) => s.estado === 'hecho')
        ? 'hecho'
        : 'pendiente',
    }));
  }

  toggleCliente(nombre: string) {
    this.clienteExpandido = this.clienteExpandido === nombre ? null : nombre;
  }

  iniciarLongPress(nombre: string) {
    this.longPressTimer = setTimeout(() => {
      this.clienteSeleccionado = nombre;
      this.mostrarMenuCliente = true;
    }, 700);
  }

  abrirMenuCliente(nombre: string) {
    this.clienteSeleccionado = nombre;
    this.mostrarMenuCliente = true;
  }

  cancelarLongPress() {
    clearTimeout(this.longPressTimer);
  }

  eliminarCliente() {
    this.mostrarMenuCliente = false;
    this.mostrarConfirmacionEliminarCliente = true;
  }

  cancelarEliminarCliente() {
    this.mostrarConfirmacionCliente = false;
    this.clienteSeleccionado = null;
  }

  preguntarEliminarCliente() {
    this.mostrarMenuCliente = false;
    this.mostrarConfirmacionCliente = true;
  }

  abrirPopup() {
    this.mostrarPopup = true;
  }

  cerrarPopup() {
    this.mostrarPopup = false;
  }

  guardarRegistro() {
    if (this.modoEdicion) {
      this.serviciosService
        .actualizarServicio(this.servicioEditandoId!, this.nuevoRegistro)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Servicio actualizado',
              confirmButtonText: 'Listo',
              confirmButtonColor: '#0d6efd',
            });

            this.obtenerServicios();
            this.cerrarPopup();
          },
          error: (err) => {
            console.error(err);
          },
        });

      return;
    }

    this.serviciosService.crearServicio(this.nuevoRegistro).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Servicio agregado',
          confirmButtonText: 'Listo',
          confirmButtonColor: '#0d6efd',
        });

        this.obtenerServicios();
        this.cerrarPopup();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  abrirPopupEstado(servicio: any) {
    this.servicioSeleccionado = servicio;
    this.precioServicio = servicio.precio || 0;
    this.mostrarPopupEstado = true;
  }

  volverPendiente() {
    const actualizado = {
      id: this.servicioSeleccionado.id,
      fecha: this.servicioSeleccionado.fecha,
      titulo: this.servicioSeleccionado.titulo,
      nombre: this.servicioSeleccionado.nombre,
      telefono: this.servicioSeleccionado.telefono,
      direccion: this.servicioSeleccionado.direccion,
      barrio: this.servicioSeleccionado.barrio,
      lote: this.servicioSeleccionado.lote,
      manzana: this.servicioSeleccionado.manzana,

      diagnosticoGeneral: this.servicioSeleccionado.diagnosticoGeneral,
      diagnostico: this.servicioSeleccionado.diagnostico,
      trabajoRealizado: this.servicioSeleccionado.trabajoRealizado,
      observaciones: this.servicioSeleccionado.observaciones,

      estado: 'pendiente',
      precio: 0,
      estadoPago: 'pendiente',

      archivada: this.servicioSeleccionado.archivada,
    };

    console.log('ENVIANDO VOLVER A PENDIENTE:', actualizado);

    this.serviciosService
      .actualizarServicio(actualizado.id, actualizado)
      .subscribe({
        next: (respuesta) => {
          console.log('SERVICIO VUELTO A PENDIENTE:', respuesta);

          this.obtenerServicios();
          this.cerrarPopupEstado();
        },
        error: (err) => {
          console.error('ERROR VOLVIENDO A PENDIENTE:', err);
          console.error('STATUS:', err.status);
          console.error('ERROR:', err.error);
        },
      });
  }

  cerrarPopupEstado() {
    this.mostrarPopupEstado = false;
    this.servicioSeleccionado = null;
    this.precioServicio = 0;
  }

  marcarEstado(estadoPago: string) {
    const actualizado = {
      id: this.servicioSeleccionado.id,
      fecha: this.servicioSeleccionado.fecha,
      titulo: this.servicioSeleccionado.titulo,
      nombre: this.servicioSeleccionado.nombre,
      telefono: this.servicioSeleccionado.telefono,
      direccion: this.servicioSeleccionado.direccion,
      barrio: this.servicioSeleccionado.barrio,
      lote: this.servicioSeleccionado.lote,
      manzana: this.servicioSeleccionado.manzana,
      diagnosticoGeneral: this.servicioSeleccionado.diagnosticoGeneral,
      diagnostico: this.servicioSeleccionado.diagnostico,
      trabajoRealizado: this.servicioSeleccionado.trabajoRealizado,
      observaciones: this.servicioSeleccionado.observaciones,

      estado: 'hecho',
      precio: this.precioServicio,
      estadoPago: estadoPago,
      archivada: this.servicioSeleccionado.archivada,

      bombas: this.servicioSeleccionado.bombas,
    };

    this.serviciosService
      .actualizarServicio(actualizado.id, actualizado)
      .subscribe({
        next: () => {
          this.obtenerServicios();
          this.cerrarPopupEstado();
        },
        error: (err) => {
          console.log(err.error);
          console.log(err.error.errors);
        },
      });
  }

  mostrarPopupBomba = false;
  servicioBombaSeleccionado: any = null;

  nuevaBomba = {
    hp: '',
    marca: '',
    realizar: '',
  };

  abrirPopupBomba(servicio: any) {
    this.servicioBombaSeleccionado = servicio;
    this.mostrarPopupBomba = true;
  }

  cerrarPopupBomba() {
    this.mostrarPopupBomba = false;

    this.nuevaBomba = {
      hp: '',
      marca: '',
      realizar: '',
    };
  }

  guardarBomba() {
    const bomba = {
      ...this.nuevaBomba,
      fecha: this.servicioBombaSeleccionado.fecha,
      nombre: this.servicioBombaSeleccionado.nombre,
      telefono: this.servicioBombaSeleccionado.telefono,
      direccion: this.servicioBombaSeleccionado.direccion,
      barrio: this.servicioBombaSeleccionado.barrio,
      lote: this.servicioBombaSeleccionado.lote,
      manzana: this.servicioBombaSeleccionado.manzana,
      diagnostico: this.servicioBombaSeleccionado.diagnostico,
      estado: 'pendiente',
      estadoPago: 'pendiente',
      servicioTecnicoId: this.servicioBombaSeleccionado.id,
    };

    this.bombasService.crearBomba(bomba).subscribe(() => {
      this.obtenerServicios();
      this.cerrarPopupBomba();
    });
  }

  toggleMenu(id: number) {
    this.menuAbierto = this.menuAbierto === id ? null : id;
  }

  editarServicio(servicio: any) {
    this.servicioEditando = {
      ...servicio,
    };

    this.mostrarPopupEditar = true;

    this.menuAbierto = null;
  }

  cerrarPopupEditar() {
    this.mostrarPopupEditar = false;
    this.servicioEditando = null;
  }

  guardarEdicion() {
    const actualizado = {
      id: this.servicioEditando.id,
      fecha: this.servicioEditando.fecha,
      titulo: this.servicioEditando.titulo,
      nombre: this.servicioEditando.nombre,
      telefono: this.servicioEditando.telefono,
      direccion: this.servicioEditando.direccion,
      barrio: this.servicioEditando.barrio,
      lote: this.servicioEditando.lote,
      manzana: this.servicioEditando.manzana,

      diagnosticoGeneral: this.servicioEditando.diagnosticoGeneral,
      diagnostico: this.servicioEditando.diagnostico,
      trabajoRealizado: this.servicioEditando.trabajoRealizado,
      observaciones: this.servicioEditando.observaciones,

      estado: this.servicioEditando.estado,
      precio: this.servicioEditando.precio,
      estadoPago: this.servicioEditando.estadoPago,
      archivada: this.servicioEditando.archivada,
    };

    console.log('ENVIANDO SERVICIO EDITADO:', actualizado);

    this.serviciosService
      .actualizarServicioTecnico(actualizado.id, actualizado)
      .subscribe({
        next: (respuesta) => {
          console.log('SERVICIO EDITADO CORRECTAMENTE:', respuesta);

          this.obtenerServicios();
          this.cerrarPopupEditar();

          Swal.fire({
            icon: 'success',
            title: 'Servicio actualizado',
            confirmButtonText: 'Listo',
            confirmButtonColor: '#0d6efd',
          });
        },

        error: (err) => {
          console.error('ERROR AL EDITAR SERVICIO:', err);
          console.error('STATUS:', err.status);
          console.error('ERROR:', err.error);

          Swal.fire({
            icon: 'error',
            title: 'Error al editar el servicio',
          });
        },
      });
  }

  eliminarServicio(servicio: any) {
    this.serviciosService.eliminarServicio(servicio.id).subscribe({
      next: () => {
        this.obtenerServicios();

        this.menuAbierto = null;
        this.mostrarPopupEliminarServicio = false;
        this.servicioAEliminar = null;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  abrirPopupEliminarServicio(servicio: any) {
    console.log('Entró al método');
    this.servicioAEliminar = servicio;
    this.mostrarPopupEliminarServicio = true;
  }

  cancelarEliminarServicio() {
    this.mostrarPopupEliminarServicio = false;
    this.servicioAEliminar = null;
  }

  confirmarEliminarServicio() {
    if (!this.servicioAEliminar) {
      return;
    }

    this.eliminarServicio(this.servicioAEliminar);
  }

  confirmarEliminarCliente() {
    if (!this.clienteSeleccionado) return;
    console.log('Cliente a eliminar:', this.clienteSeleccionado);
    this.serviciosService.eliminarCliente(this.clienteSeleccionado).subscribe({
      next: () => {
        console.log('Eliminado');
        this.obtenerServicios();

        this.mostrarConfirmacionCliente = false;
        this.mostrarMenuCliente = false;
        this.clienteSeleccionado = null;
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar el cliente',
        });
      },
    });
  }

  subirFoto(event: any, servicio: any) {
    const archivo = event.target.files[0];

    if (!archivo) {
      return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);

    this.serviciosService.subirFoto(servicio.id, formData).subscribe({
      next: (resp: any) => {
        if (!servicio.fotos) {
          servicio.fotos = [];
        }

        servicio.fotos.push({
          id: resp.id,
          servicioId: servicio.id,
          nombreArchivo: resp.archivo,
          fechaSubida: new Date(),
        });
      },

      error: (err) => console.error(err),
    });
  }

  abrirFoto(foto: any, servicio: any) {
    console.log('FOTO AL ABRIR:', foto);
    console.log('ID AL ABRIR:', foto.id);
    this.fotoSeleccionada = foto;
    this.servicioFotoSeleccionada = servicio;
  }

  eliminarFoto(foto: any, servicio: any) {
    console.log('FOTO AL ELIMINAR:', foto);
    console.log('ID DE FOTO:', foto?.id);
    this.fotoAEliminar = foto;
    this.servicioFotoAEliminar = servicio;
    this.mostrarPopupEliminarFoto = true;
  }

  confirmarEliminarFoto() {
    const foto = this.fotoAEliminar;
    const servicio = this.servicioFotoAEliminar;

    if (!foto || !servicio) {
      return;
    }

    this.serviciosService.eliminarFoto(foto.id).subscribe({
      next: () => {
        // Sacar la foto de la galería
        servicio.fotos = servicio.fotos.filter((f: any) => f.id !== foto.id);

        // Cerrar la foto expandida si estaba abierta
        if (this.fotoSeleccionada?.id === foto.id) {
          this.fotoSeleccionada = null;
        }

        // Cerrar el popup de confirmación
        this.cancelarEliminarFoto();
      },

      error: (err) => {
        console.error('Error eliminando foto:', err);
      },
    });
  }

  cancelarEliminarFoto() {
    this.mostrarPopupEliminarFoto = false;
    this.fotoAEliminar = null;
    this.servicioFotoAEliminar = null;
  }
}
