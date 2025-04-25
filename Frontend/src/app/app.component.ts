import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from "./menu/menu.component";
import { NgIf } from '@angular/common';
import { VerificarSesionService } from './services/verificar-sesion.service';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MenuComponent, RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService)
  private verificarSesion = inject(VerificarSesionService)

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const esRutaPublica = ['/login', '/register'].includes(this.router.url);

      if (!esRutaPublica && this.authService.esValidoFrontend()) {
        this.verificarSesion.iniciarVerificacion();
        this.authService.iniciarExtensionSesionPorActividad();
      }
    });
  }

  get mostrarMenu(): boolean {
    const rutasOcultas = ['/login', '/register'];
    return !rutasOcultas.some(r => this.router.url.startsWith(r));
  }
}
