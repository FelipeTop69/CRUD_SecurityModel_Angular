import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RolUserService } from '../../services/rol-user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NgFor, NgIf } from '@angular/common';
import { FormService } from '../../services/form.service';
import { ModuleService } from '../../services/module.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-form-module',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgFor,
    NgIf
  ],
  templateUrl: './create-rol-user.component.html',
  styleUrl: './create-rol-user.component.css'
})
export class CreateRolUserComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private rolUser = inject(RolUserService);
  private rolService = inject(RolService);
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  rols: any[] = [];
  noRolsAvailable = false;

  users: any[] = [];
  noUserAvailable = false;


  form = this.formBuilder.group({
    rolId: [null, Validators.required],
    userId: [null, Validators.required],
  });

  ngOnInit(): void {
    this.loadRols();
    this.loadUsers();
  }

  private loadRols(): void {
    this.rolService.getAll().subscribe({
      next: (data) => {
        this.rols = data;
        if (this.rols.length === 0) {
          this.noRolsAvailable = true;
          this.form.disable();
        }
      },
      error: (err) => {
        this.snackBar.open('Error al cargar personas disponibles', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  private loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        if (this.users.length === 0) {
          this.noUserAvailable = true;
          this.form.disable();
        }
      },
      error: (err) => {
        this.snackBar.open('Error al cargar personas disponibles', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }


  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.rolUser.create(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Usuario registrado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/rolUser']);
      },
      error: (err) => {
        this.snackBar.open(`Error al registrar: ${err.message}`, 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/rolUser']);
  }

}
