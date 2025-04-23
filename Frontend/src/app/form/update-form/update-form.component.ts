import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { FormService } from '../../services/form.service';


@Component({
  selector: 'app-update-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    NgIf
],
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css']
})
export class UpdateFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private formService = inject(FormService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  formId!: number;
  isLoading = false;
  showReactivarToggle = false;
  reactivarForm = false;

  ngOnInit(): void {
    this.formId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadFormData();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      id: [this.formId],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      status: [true],
    });
  }

  private loadFormData(): void {
    this.isLoading = true;
    this.formService.getById(this.formId).subscribe({
      next: (form) => {
        const currentStatus = Boolean(form.status);
        this.form.patchValue({
          name: form.name,
          description: form.description,
          status: currentStatus
        });
        this.showReactivarToggle = !currentStatus;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar datos de la form', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/forms']);
      }
    });
  }

  onToggleChange(event: MatSlideToggleChange): void {
    this.reactivarForm = event.checked;
    this.form.patchValue({
      status: event.checked
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.value,
    };

    this.formService.update(payload).subscribe({
      next: () => {
        this.snackBar.open('Form actualizada exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/form']);
      },
      error: (err) => {
        this.snackBar.open(`Error al actualizar: ${err.message}`, 'Cerrar', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/form']);
  }
}