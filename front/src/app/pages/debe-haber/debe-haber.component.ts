import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CardMenuComponent } from '../../components/card-menu/card-menu.component';

@Component({
  selector: 'app-debe-haber',
  standalone: true,
  imports: [NavbarComponent, CardMenuComponent],
  templateUrl: './debe-haber.component.html',
  styleUrl: './debe-haber.component.css',
})
export class DebeHaberComponent {}