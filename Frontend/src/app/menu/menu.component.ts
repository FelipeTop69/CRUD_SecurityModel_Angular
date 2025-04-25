import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  private authService = inject(AuthService);

  rolName = this.authService.getUserRole()

  logout(){
    Swal.fire({
          title: '¿Deseas Cerrar Sesion?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Cerrar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#d33',
        }).then(result => {
          if (result.isConfirmed) {
            this.authService.logout()
          } 
        });
  }
}
