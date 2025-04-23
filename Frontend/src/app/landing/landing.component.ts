import { Component, inject } from '@angular/core';
import { PruebaConexionService } from '../prueba-conexion.service';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  pruebaConexion = inject(PruebaConexionService);
  users: any[] = [];

  constructor(){
    this.pruebaConexion.obtenerUsers().subscribe(datos => {
      this.users = datos;
    })
  }
}
