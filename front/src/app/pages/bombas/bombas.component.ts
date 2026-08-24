import { Component } from '@angular/core';
import { BombasService } from '../../services/bombasService/bombas.service';
import { ClientesService } from '../../services/clientesService/clientes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bombas',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './bombas.component.html',
  styleUrl: './bombas.component.css',
})
export class BombasComponent {
  bombas: any[] = [];
  clienteExpandido: string | null = null;
  mostrarPopup = false;
  bombaSeleccionada: any = null;
  precioBomba: number = 0;
  mostrarPopupEstado = false;
  clientes: any[] = [];
  busquedaCliente = '';
  mostrarSugerencias = false;
  menuAbierto: number | null = null;

  mostrarPopupEditar = false;

  bombaEditando: any = null;

  busqueda = '';

  mostrarConfirmacionEliminarBomba = false;

  bombaAEliminar: any = null;

  longPressTimer: any = null;

  clienteSeleccionado: string | null = null;

  mostrarMenuCliente = false;

  mostrarConfirmacionCliente = false;

  fotoSeleccionada: any = null;

  bombaFotoSeleccionada: any = null;
  mostrarMiniaturas = false;

  fotoAEliminar: any = null;
  bombaFotoAEliminar: any = null;
  mostrarPopupEliminarFoto = false;

  constructor(
    private bombasService: BombasService,
    private clientesService: ClientesService,
  ) {}

  nuevoRegistro = {
    fecha: '',
    nombre: '',
    telefono: '',
    direccion: '',
    barrio: '',
    lote: '',
    manzana: '',
    hp: '',
    marca: '',
    diagnostico: '',
    realizar: '',
  };

  ngOnInit() {
    this.obtenerBombas();
    this.obtenerClientes();
  }

  obtenerBombas() {
    this.bombasService.getBombas().subscribe({
      next: (data) => {
        this.bombas = data;
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

  abrirPopupEstado(bomba: any) {
    this.bombaSeleccionada = bomba;
    this.precioBomba = bomba.precio || 0;
    this.mostrarPopupEstado = true;
  }

  cerrarPopupEstado() {
    this.mostrarPopupEstado = false;
    this.bombaSeleccionada = null;
    this.precioBomba = 0;
  }

  cerrarMenuCliente() {
    this.mostrarMenuCliente = false;

    this.clienteSeleccionado = null;
  }

  guardarRegistro() {
    this.bombasService.crearBomba(this.nuevoRegistro).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Bomba agregada',
          confirmButtonText: 'Listo',
          confirmButtonColor: '#0d6efd',
        });

        this.obtenerBombas();

        this.cerrarPopup();
      },

      error: (err) => {
        console.error(err);
        alert('Error al guardar bomba');
      },
    });
  }

  get clientesAgrupados(): any[] {
    const grupos: any = {};

    this.bombas.forEach((bomba) => {
      // FILTRO POR CLIENTE
      if (
        this.busqueda &&
        !bomba.nombre?.toLowerCase().includes(this.busqueda.toLowerCase())
      ) {
        return;
      }

      if (!grupos[bomba.nombre]) {
        grupos[bomba.nombre] = {
          nombre: bomba.nombre,
          bombas: [],
        };
      }

      grupos[bomba.nombre].bombas.push(bomba);
    });

    return Object.values(grupos).map((cliente: any) => ({
      ...cliente,

      estadoGeneral: cliente.bombas.every((b: any) => b.estado === 'hecho')
        ? 'hecho'
        : 'pendiente',
    }));
  }

  toggleCliente(nombre: string) {
    console.log('TOGGLE', nombre);
    this.clienteExpandido = this.clienteExpandido === nombre ? null : nombre;
  }

  marcarEstado(estadoPago: string) {
    const actualizada = {
      id: this.bombaSeleccionada.id,
      fecha: this.bombaSeleccionada.fecha,

      nombre: this.bombaSeleccionada.nombre,
      telefono: this.bombaSeleccionada.telefono,
      direccion: this.bombaSeleccionada.direccion,
      barrio: this.bombaSeleccionada.barrio,
      lote: this.bombaSeleccionada.lote,
      manzana: this.bombaSeleccionada.manzana,

      hp: this.bombaSeleccionada.hp,
      marca: this.bombaSeleccionada.marca,
      diagnostico: this.bombaSeleccionada.diagnostico,
      realizar: this.bombaSeleccionada.realizar,

      estado: 'hecho',
      precio: this.precioBomba,
      estadoPago: estadoPago,

      servicioTecnicoId: this.bombaSeleccionada.servicioTecnicoId,
    };

    this.bombasService
      .actualizarBomba(actualizada.id, actualizada)
      .subscribe(() => {
        this.obtenerBombas();
        this.cerrarPopupEstado();
      });
  }

  abrirPopup() {
    this.mostrarPopup = true;
  }

  cerrarPopup() {
    this.mostrarPopup = false;

    this.nuevoRegistro = {
      fecha: '',
      nombre: '',
      telefono: '',
      direccion: '',
      barrio: '',
      lote: '',
      manzana: '',
      hp: '',
      marca: '',
      diagnostico: '',
      realizar: '',
    };
  }

  toggleMenu(id: number) {
    this.menuAbierto = this.menuAbierto === id ? null : id;
  }

  editarBomba(bomba: any) {
    this.bombaEditando = {
      ...bomba,
    };

    this.mostrarPopupEditar = true;

    this.menuAbierto = null;
  }

  cerrarPopupEditar() {
    this.mostrarPopupEditar = false;

    this.bombaEditando = null;
  }

  guardarEdicion() {
    const bombaActualizada = {
      id: this.bombaEditando.id,
      fecha: this.bombaEditando.fecha,

      nombre: this.bombaEditando.nombre,
      telefono: this.bombaEditando.telefono,
      direccion: this.bombaEditando.direccion,
      barrio: this.bombaEditando.barrio,
      lote: this.bombaEditando.lote,
      manzana: this.bombaEditando.manzana,

      hp: this.bombaEditando.hp,
      marca: this.bombaEditando.marca,
      diagnostico: this.bombaEditando.diagnostico,
      realizar: this.bombaEditando.realizar,

      estado: this.bombaEditando.estado,
      precio: this.bombaEditando.precio,
      estadoPago: this.bombaEditando.estadoPago,

      servicioTecnicoId: this.bombaEditando.servicioTecnicoId,
    };

    console.log('BOMBA A EDITAR:', bombaActualizada);

    this.bombasService
      .actualizarBomba(bombaActualizada.id, bombaActualizada)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Bomba actualizada',
            confirmButtonText: 'Listo',
            confirmButtonColor: '#0d6efd',
          });

          this.obtenerBombas();
          this.cerrarPopupEditar();
        },

        error: (err) => {
          console.error('ERROR AL EDITAR BOMBA:', err);
          console.error('STATUS:', err.status);
          console.error('ERROR COMPLETO:', JSON.stringify(err.error, null, 2));
        },
      });
  }

  eliminarBomba(bomba: any) {
    this.menuAbierto = null;

    this.bombaAEliminar = bomba;

    this.mostrarConfirmacionEliminarBomba = true;
  }

  volverPendiente() {
    const bombaActualizada = {
      id: this.bombaSeleccionada.id,
      fecha: this.bombaSeleccionada.fecha,

      nombre: this.bombaSeleccionada.nombre,
      telefono: this.bombaSeleccionada.telefono,
      direccion: this.bombaSeleccionada.direccion,
      barrio: this.bombaSeleccionada.barrio,
      lote: this.bombaSeleccionada.lote,
      manzana: this.bombaSeleccionada.manzana,

      hp: this.bombaSeleccionada.hp,
      marca: this.bombaSeleccionada.marca,
      diagnostico: this.bombaSeleccionada.diagnostico,
      realizar: this.bombaSeleccionada.realizar,

      estado: 'pendiente',
      precio: 0,
      estadoPago: 'pendiente',

      servicioTecnicoId: this.bombaSeleccionada.servicioTecnicoId,
    };

    console.log('BOMBA VOLVIENDO A PENDIENTE:', bombaActualizada);

    this.bombasService
      .actualizarBomba(bombaActualizada.id, bombaActualizada)
      .subscribe({
        next: () => {
          this.obtenerBombas();
          this.cerrarPopupEstado();
        },

        error: (err) => {
          console.error('ERROR VOLVIENDO A PENDIENTE:', err);
          console.error('STATUS:', err.status);
          console.error('ERROR COMPLETO:', JSON.stringify(err.error, null, 2));

          Swal.fire({
            icon: 'error',
            title: 'Error al cambiar el estado',
            text: 'No se pudo volver la bomba a pendiente.',
            confirmButtonText: 'Aceptar',
          });
        },
      });
  }

  clickEstadoBomba(bomba: any) {
    this.abrirPopupEstado(bomba);
  }

  confirmarEliminarBomba() {
    if (!this.bombaAEliminar) return;

    this.bombasService.eliminarBomba(this.bombaAEliminar.id).subscribe({
      next: () => {
        this.obtenerBombas();

        this.mostrarConfirmacionEliminarBomba = false;

        this.bombaAEliminar = null;
      },

      error: (err) => {
        console.error(err);

        alert('Error al eliminar bomba');
      },
    });
  }

  cancelarEliminarBomba() {
    this.mostrarConfirmacionEliminarBomba = false;

    this.bombaAEliminar = null;
  }

  cancelarEliminarCliente() {
    this.mostrarConfirmacionCliente = false;

    this.mostrarMenuCliente = false;

    this.clienteSeleccionado = null;
  }

  iniciarLongPress(nombre: string) {
    this.longPressTimer = setTimeout(() => {
      this.clienteSeleccionado = nombre;
      this.mostrarMenuCliente = true;
    }, 700);
  }

  cancelarLongPress() {
    console.log('UP');

    clearTimeout(this.longPressTimer);
  }

  abrirMenuCliente(nombre: string) {
    this.clienteSeleccionado = nombre;

    this.mostrarMenuCliente = true;
  }

  preguntarEliminarCliente() {
    this.mostrarMenuCliente = false;

    this.mostrarConfirmacionCliente = true;
  }

  confirmarEliminarCliente() {
    if (!this.clienteSeleccionado) return;

    this.bombasService.eliminarCliente(this.clienteSeleccionado).subscribe({
      next: () => {
        this.obtenerBombas();

        this.mostrarConfirmacionCliente = false;

        this.clienteSeleccionado = null;

        alert('Cliente eliminado');
      },

      error: (err) => {
        console.error(err);

        alert('Error al eliminar cliente');
      },
    });
  }

  subirFoto(event: any, bomba: any) {
    const archivo = event.target.files[0];

    if (!archivo) {
      return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);

    this.bombasService.subirFoto(bomba.id, formData).subscribe({
      next: (resp: any) => {
        if (!bomba.fotos) {
          bomba.fotos = [];
        }

        bomba.fotos.push({
          id: resp.id,
          bombaId: bomba.id,
          nombreArchivo: resp.archivo,
          fechaSubida: new Date(),
        });
      },

      error: (err) => console.error(err),
    });
  }

  abrirFoto(foto: any, bomba: any) {
    this.fotoSeleccionada = foto;
    this.bombaFotoSeleccionada = bomba;
  }

  eliminarFoto(foto: any, bomba: any) {
    this.fotoAEliminar = foto;
    this.bombaFotoAEliminar = bomba;
    this.mostrarPopupEliminarFoto = true;
  }

  confirmarEliminarFoto() {
    const foto = this.fotoAEliminar;
    const bomba = this.bombaFotoAEliminar;

    if (!foto || !bomba) {
      return;
    }

    this.bombasService.eliminarFoto(foto.id).subscribe({
      next: () => {
        // Sacar la foto de la galería
        bomba.fotos = bomba.fotos.filter((f: any) => f.id !== foto.id);

        // Si estaba abierta en el popup grande, cerrarla
        if (this.fotoSeleccionada?.id === foto.id) {
          this.fotoSeleccionada = null;
        }

        // Cerrar popup de confirmación
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
    this.bombaFotoAEliminar = null;
  }
}
