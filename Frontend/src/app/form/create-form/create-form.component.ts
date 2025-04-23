import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../../services/form.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.css'
})
export class CreateFormComponent {

  private fb = inject(FormBuilder);
  private formService = inject(FormService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Por favor complete todos los campos correctamente', 'Cerrar', {
        duration: 3000
      });
      return;
    }


    this.formService.create(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Form registrado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/form']);
      },
      error: (err) => {
        this.snackBar.open(`Error al registrar: ${err.message}`, 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/form']);
  }
}
