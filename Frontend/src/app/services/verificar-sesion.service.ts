import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VerificarSesionService {

  private authService = inject(AuthService);
  private router = inject(Router);

  private intervaloId: any;

  iniciarVerificacion(intervalo = 1000): void {
    if (this.intervaloId) return;
  
    this.intervaloId = setInterval(() => {
      const rutaActual = this.router.url;
      const esRutaPublica = ['/login', '/register'].includes(rutaActual);
      if (esRutaPublica) return;
  
      const exp = localStorage.getItem('token_exp_frontend');
  
      if (exp) {
        const segundosRestantes = Math.floor(
          (new Date(exp).getTime() - Date.now()) / 1000
        );
  
        console.log(`[DEBUG] Token expira en: ${segundosRestantes} segundos`);
  
        if (segundosRestantes <= 0) {
          this.detenerVerificacion();
          this.authService.logout();
          Swal.fire({
            icon: 'warning',
            title: 'Sesión expirada',
            text: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
          }).then(() => {
            this.router.navigate(['/login']);
          });
        }
      }
    }, intervalo);
  }
  

  detenerVerificacion(): void {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
      this.intervaloId = null;
    }
  }
}
