import { inject, Injectable } from '@angular/core';
import { merge, fromEvent, debounceTime } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VerificarSesionRxService {

  private authService = inject(AuthService);

  iniciarConDebounce(): void {
    merge(
      fromEvent(document, 'click'),
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'keydown')
    ).pipe(
      debounceTime(10_000) // espera 10s tras último evento
    ).subscribe(() => {
      this.authService.extenderSesion();
      console.log('[DEBUG] Sesión extendida con debounce');
    });
  }
}
