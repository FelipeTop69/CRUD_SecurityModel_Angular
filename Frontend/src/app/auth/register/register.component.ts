import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { RolService } from '../../services/rol.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidators } from '../../utils/validators';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    NgIf,
    NgFor,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private rolService = inject(RolService);
  private snackBar = inject(MatSnackBar)
  private router = inject(Router)

  hidePassword = true;
  roles: any[] = [];
  


  registerForm = this.formBuilder.group({
    username: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      CustomValidators.strongPassword()
    ]],
    name: ['', [
      Validators.required,
      Validators.maxLength(50)
    ]],
    lastName: ['', [
      Validators.required,
      Validators.maxLength(50)
    ]],
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    documentNumber: ['', [
      Validators.required,
      CustomValidators.onlyNumbers(10)
    ]],
    phone: ['', [
      Validators.required,
      CustomValidators.onlyNumbers(10)
    ]],
    address: ['', [
      Validators.required,
      Validators.maxLength(100)
    ]],
    documentType: ['', Validators.required],
    bloodType: ['', Validators.required],
    rolId: [null, Validators.required]
  });

  ngOnInit(): void {
    this.rolService.getAll().subscribe({
      next: (roles) => this.roles = roles,
      error: () => this.snackBar.open('Error al cargar roles', 'Cerrar', { duration: 3000 })
    });
  }

  documentTypes = [
    { value: 'RC', label: 'Registro Civil' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PP', label: 'Pasaporte' }
  ];

  bloodTypes = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Extraemos los valores del formulario
    const {
      username,
      password,
      name,
      lastName,
      email,
      documentNumber,
      phone,
      address,
      documentType,
      bloodType,
      rolId
    } = this.registerForm.value;

    this.authService.register({
      username: username!,
      password: password!,
      name: name!,
      lastName: lastName!,
      email: email!,
      documentNumber: documentNumber!,
      phone: phone!,
      address: address!,
      documentType: documentType!,
      bloodType: bloodType!,
      rolId: rolId!
    }).subscribe({
      next: () => {
        this.snackBar.open('Registro exitoso. Por favor inicie sesión.', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackBar.open('Error en el registro: ' + (err.error?.message || err.message), 'Cerrar', { 
          duration: 3000 
        });
      }
    });
  }
}