import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LimpiezasComponent } from './pages/limpiezas/limpiezas.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { DebeHaberComponent } from './pages/debe-haber/debe-haber.component';
import { BombasComponent } from './pages/bombas/bombas.component';
import { ServiciosTecnicosComponent } from './pages/servicios-tecnicos/servicios-tecnicos.component';
import { RegistroMantenimientosComponent } from './pages/registro-mantenimientos/registro-mantenimientos.component';
import { RegistroServiciosComponent } from './pages/registro-servicios/registro-servicios.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'limpiezas', component: LimpiezasComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'debe-haber', component: DebeHaberComponent },
  { path: 'bombas', component: BombasComponent },
  { path: 'servicios-tecnicos', component: ServiciosTecnicosComponent },
  { path: 'registro', component: DebeHaberComponent },
  { path: 'registro-mantenimientos', component: RegistroMantenimientosComponent },
  { path: 'registro-servicios', component: RegistroServiciosComponent },
];
