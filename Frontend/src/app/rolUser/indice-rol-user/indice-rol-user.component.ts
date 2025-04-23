import { Component, inject, OnInit } from '@angular/core';
import { RolUserService } from '../../services/rol-user.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-indice-rolUser',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './indice-rol-user.component.html',
  styleUrl: './indice-rol-user.component.css'
})
export class IndiceRolUserComponent implements OnInit {
  private formMRolUserService = inject(RolUserService);
  rolUsers: any[] = [];
  columnas = ['id', 'rolName', 'userName',  'status','acciones'];

  ngOnInit(): void {
    this.cargarRolUsers();
  }


  cargarRolUsers(): void {
    this.formMRolUserService.getAll().subscribe({
      next: data => this.rolUsers = data,
      error: err => console.error("Error cargando rolUsers", err)
    });
  }

  eliminarUsuario(formMRolUser: any) {
    Swal.fire({
      title: '¿Qué tipo de eliminación deseas?',
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Lógica',
      denyButtonText: 'Permanente',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#d33',
    }).then(result => {
      if (result.isConfirmed) {
        this.formMRolUserService.delete(formMRolUser.id, 0).subscribe(() => {
          Swal.fire('Eliminado lógicamente', '', 'success');
          this.cargarRolUsers();
        });
      } else if (result.isDenied) {
        this.formMRolUserService.delete(formMRolUser.id, 1).subscribe(() => {
          Swal.fire('Eliminado permanentemente', '', 'success');
          this.cargarRolUsers();
        });
      }
    });
  }
}
