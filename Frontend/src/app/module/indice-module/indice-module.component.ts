import { Component, inject, OnInit } from '@angular/core';
import { ModuleService } from '../../services/module.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-indice-module',
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './indice-module.component.html',
  styleUrl: './indice-module.component.css'
})
export class IndiceModuleComponent implements OnInit {
  private moduleService = inject(ModuleService);
    modules: any[] = [];
    columnas = ['id', 'name', 'description', 'status','acciones'];
  
    ngOnInit(): void {
      this.cargarModules();
    }
  
  
  cargarModules(): void {
    this.moduleService.getAll().subscribe({
      next: data => this.modules = data,
      error: err => console.error("Error cargando modules", err)
    });
  }

  eliminarModule(module: any) {
    Swal.fire({
      title: '¿Qué tipo de eliminación deseas?',
      text: `Module: ${module.name}`,
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
        this.moduleService.delete(module.id, 0).subscribe(() => {
          Swal.fire('Eliminado lógicamente', '', 'success');
          this.cargarModules();
        });
      } else if (result.isDenied) {
        this.moduleService.delete(module.id, 1).subscribe(() => {
          Swal.fire('Eliminado permanentemente', '', 'success');
          this.cargarModules();
        });
      }
    });
  }
}
