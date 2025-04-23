import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-person',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './create-person.component.html',
  styleUrl: './create-person.component.css'
})
export class CreatePersonComponent {

  private fb = inject(FormBuilder);
  private personService = inject(PersonService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    documentType: ['', Validators.required],
    documentNumber: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{1,10}$/)
    ]],
    phone: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{1,10}$/)
    ]],
    address: ['', Validators.required],
    bloodType: ['', Validators.required]
  });

  documentTypes = [
    { value: 'RC', label: 'Registro Civil' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'N° Identificación Tributaria' },
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Por favor complete todos los campos correctamente', 'Cerrar', {
        duration: 3000
      });
      return;
    }


    this.personService.create(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Persona registrada exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/person']);
      },
      error: (err) => {
        this.snackBar.open(`Error al registrar: ${err.message}`, 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/person']);
  }
}
