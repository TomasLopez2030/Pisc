import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CardMenuComponent } from '../../components/card-menu/card-menu.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    NavbarComponent,
    CardMenuComponent,
    StatCardComponent,
    BottomNavComponent
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
