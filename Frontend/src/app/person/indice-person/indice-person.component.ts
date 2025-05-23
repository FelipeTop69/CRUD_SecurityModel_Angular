import { Component, inject, OnInit } from '@angular/core';
import { PersonService } from '../../services/person.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-indice-person',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './indice-person.component.html',
  styleUrl: './indice-person.component.css'
})
export class IndicePersonComponent implements OnInit {
  private personService = inject(PersonService);
  persons: any[] = [];
  columnas = ['id', 'name', 'lastName', 'email','documentType','documentNumber','phone','address','bloodType','status','acciones'];

  ngOnInit(): void {
    this.cargarPersons();
  }

  cargarPersons(): void {
    this.personService.getAll().subscribe({
      next: data => this.persons = data,
      error: err => console.error("Error cargando persons", err)
    });
  }

  eliminarPerson(person: any) {
    Swal.fire({
      title: '¿Qué tipo de eliminación deseas?',
      text: `Person: ${person.name}`,
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
        this.personService.delete(person.id, 0).subscribe(() => {
          Swal.fire('Eliminado lógicamente', '', 'success');
          this.cargarPersons();
        });
      } else if (result.isDenied) {
        this.personService.delete(person.id, 1).subscribe(() => {
          Swal.fire('Eliminado permanentemente', '', 'success');
          this.cargarPersons();
        });
      }
    });
  }
}
