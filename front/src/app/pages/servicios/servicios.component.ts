import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CardMenuComponent } from '../../components/card-menu/card-menu.component';

@Component({
  selector: 'app-servicios',
  imports: [NavbarComponent, CardMenuComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css',
})
export class ServiciosComponent {
  cardExpandida: string | null = null;

  toggleCard(card: string) {
    this.cardExpandida = this.cardExpandida === card ? null : card;
  }
}
