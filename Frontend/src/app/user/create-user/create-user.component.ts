import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NgFor, NgIf } from '@angular/common';
import { PersonService } from '../../services/person.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../utils/validators';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgFor,
    NgIf,
    MatIconModule
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class FormUserComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  private personService = inject(PersonService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  isAdmin = false;
  persons: any[] = [];
  noPersonsAvailable = false;
  hidePassword = true;

  form = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      CustomValidators.strongPassword()
    ]],
    personId: [null, Validators.required]
  });

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === 'Administrador';
    this.loadPersons();
  }

  private loadPersons(): void {
    this.personService.getAvailable().subscribe({
      next: (data) => {
        this.persons = data;
        if (this.persons.length === 0) {
          this.noPersonsAvailable = true;
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

    this.userService.create(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Usuario registrado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/user']);
      },
      error: (err) => {
        this.snackBar.open(`Error al registrar: ${err.message}`, 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/user']);
  }

}
