import { Component, inject, OnInit } from '@angular/core';
import { FormService } from '../../services/form.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-indice-form',
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './indice-form.component.html',
  styleUrl: './indice-form.component.css'
})
export class IndiceFormComponent implements OnInit {
  private formService = inject(FormService);
    forms: any[] = [];
    columnas = ['id', 'name', 'description', 'status','acciones'];
  
    ngOnInit(): void {
      this.cargarForms();
    }
  
  
  cargarForms(): void {
    this.formService.getAll().subscribe({
      next: data => this.forms = data,
      error: err => console.error("Error cargando forms", err)
    });
  }

  eliminarForm(form: any) {
    Swal.fire({
      title: '¿Qué tipo de eliminación deseas?',
      text: `Form: ${form.name}`,
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
        this.formService.delete(form.id, 0).subscribe(() => {
          Swal.fire('Eliminado lógicamente', '', 'success');
          this.cargarForms();
        });
      } else if (result.isDenied) {
        this.formService.delete(form.id, 1).subscribe(() => {
          Swal.fire('Eliminado permanentemente', '', 'success');
          this.cargarForms();
        });
      }
    });
  }
}
