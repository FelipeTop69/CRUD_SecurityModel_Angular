import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-indice-user',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './indice-user.component.html',
  styleUrl: './indice-user.component.css'
})
export class IndiceUserComponent implements OnInit {
  private userService = inject(UserService);
  usuarios: any[] = [];
  columnas = ['id', 'username', 'password', 'personName', 'acciones'];

  ngOnInit(): void {
    this.cargarUsuarios();
  }


  cargarUsuarios(): void {
    this.userService.getAll().subscribe({
      next: data => this.usuarios = data,
      error: err => console.error("Error cargando usuarios", err)
    });
  }

  editar(id: number): void {
    console.log("Editar", id);
    // lógica futura: redirigir al formulario o abrir modal
  }

  eliminar(id: number): void {
    if (confirm("¿Eliminar este usuario?")) {
      this.userService.delete(id).subscribe({
        next: () => this.cargarUsuarios(),
        error: err => console.error("Error eliminando", err)
      });
    }
  }
}
