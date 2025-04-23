import { Component, inject, OnInit } from '@angular/core';
import { FormModuleService } from '../../services/form-module.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-indice-formMFormModule',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './indice-form-module.component.html',
  styleUrl: './indice-form-module.component.css'
})
export class IndiceFormModuleComponent implements OnInit {
  private formMFormModuleService = inject(FormModuleService);
  formModules: any[] = [];
  columnas = ['id', 'formName', 'moduleName',  'status','acciones'];

  ngOnInit(): void {
    this.cargarFormModules();
  }


  cargarFormModules(): void {
    this.formMFormModuleService.getAll().subscribe({
      next: data => this.formModules = data,
      error: err => console.error("Error cargando formModules", err)
    });
  }

  eliminarUsuario(formMFormModule: any) {
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
        this.formMFormModuleService.delete(formMFormModule.id, 0).subscribe(() => {
          Swal.fire('Eliminado lógicamente', '', 'success');
          this.cargarFormModules();
        });
      } else if (result.isDenied) {
        this.formMFormModuleService.delete(formMFormModule.id, 1).subscribe(() => {
          Swal.fire('Eliminado permanentemente', '', 'success');
          this.cargarFormModules();
        });
      }
    });
  }
}
