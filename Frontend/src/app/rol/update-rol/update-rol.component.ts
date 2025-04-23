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
import { RolService } from '../../services/rol.service';


@Component({
  selector: 'app-update-rol',
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
  templateUrl: './update-rol.component.html',
  styleUrls: ['./update-rol.component.css']
})
export class UpdateRolComponent implements OnInit {
  private fb = inject(FormBuilder);
  private rolService = inject(RolService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  rolId!: number;
  isLoading = false;
  showReactivarToggle = false;
  reactivarRol = false;

  ngOnInit(): void {
    this.rolId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadRolData();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      id: [this.rolId],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      status: [true],
    });
  }

  private loadRolData(): void {
    this.isLoading = true;
    this.rolService.getById(this.rolId).subscribe({
      next: (rol) => {
        const currentStatus = Boolean(rol.status);
        this.form.patchValue({
          name: rol.name,
          description: rol.description,
          status: currentStatus
        });
        this.showReactivarToggle = !currentStatus;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar datos de la rol', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/rols']);
      }
    });
  }

  onToggleChange(event: MatSlideToggleChange): void {
    this.reactivarRol = event.checked;
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

    this.rolService.update(payload).subscribe({
      next: () => {
        this.snackBar.open('Rol actualizada exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/rol']);
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
    this.router.navigate(['/rol']);
  }
}