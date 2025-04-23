import { Component, inject, OnInit } from '@angular/core';
import { RolFormPermissionService } from '../../services/rol-form-permission.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-indice-rolFormPermission',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './indice-rol-form-permission.component.html',
  styleUrl: './indice-rol-form-permission.component.css'
})
export class IndiceRolFormPermissionComponent implements OnInit {
  private rolFormPermissionService = inject(RolFormPermissionService);
  rolFormPermissions: any[] = [];
  columnas = ['id', 'rolName', 'formName', 'permissionName', 'status','acciones'];

  ngOnInit(): void {
    this.cargarRolFormPermissions();
  }


  cargarRolFormPermissions(): void {
    this.rolFormPermissionService.getAll().subscribe({
      next: data => this.rolFormPermissions = data,
      error: err => console.error("Error cargando rolFormPermissions", err)
    });
  }

  eliminarUsuario(rolFormPermission: any) {
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
        this.rolFormPermissionService.delete(rolFormPermission.id, 0).subscribe(() => {
          Swal.fire('Eliminado lógicamente', '', 'success');
          this.cargarRolFormPermissions();
        });
      } else if (result.isDenied) {
        this.rolFormPermissionService.delete(rolFormPermission.id, 1).subscribe(() => {
          Swal.fire('Eliminado permanentemente', '', 'success');
          this.cargarRolFormPermissions();
        });
      }
    });
  }
}
