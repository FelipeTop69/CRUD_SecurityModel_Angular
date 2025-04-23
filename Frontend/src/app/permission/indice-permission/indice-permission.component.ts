import { Component, inject, OnInit } from '@angular/core';
import { PermissionService } from '../../services/permission.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-indice-permission',
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './indice-permission.component.html',
  styleUrl: './indice-permission.component.css'
})
export class IndicePermissionComponent implements OnInit {
  private permissionService = inject(PermissionService);
    permissions: any[] = [];
    columnas = ['id', 'name', 'description', 'status','acciones'];
  
    ngOnInit(): void {
      this.cargarPermissions();
    }
  
  
  cargarPermissions(): void {
    this.permissionService.getAll().subscribe({
      next: data => this.permissions = data,
      error: err => console.error("Error cargando permissions", err)
    });
  }

  eliminarPermission(permission: any) {
    Swal.fire({
      title: '¿Qué tipo de eliminación deseas?',
      text: `Permission: ${permission.name}`,
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
        this.permissionService.delete(permission.id, 0).subscribe(() => {
          Swal.fire('Eliminado lógicamente', '', 'success');
          this.cargarPermissions();
        });
      } else if (result.isDenied) {
        this.permissionService.delete(permission.id, 1).subscribe(() => {
          Swal.fire('Eliminado permanentemente', '', 'success');
          this.cargarPermissions();
        });
      }
    });
  }
}
