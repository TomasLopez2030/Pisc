import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.css']
})
export class CardMenuComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() route!: string;
  cardPresionada = false;

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate([this.route]);
  }
}
