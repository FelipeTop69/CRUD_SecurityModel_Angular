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
import { PermissionService } from '../../services/permission.service';


@Component({
  selector: 'app-update-permission',
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
  templateUrl: './update-permission.component.html',
  styleUrls: ['./update-permission.component.css']
})
export class UpdatePermissionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private permissionService = inject(PermissionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  permissionId!: number;
  isLoading = false;
  showReactivarToggle = false;
  reactivarPermission = false;

  ngOnInit(): void {
    this.permissionId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadPermissionData();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      id: [this.permissionId],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      status: [true],
    });
  }

  private loadPermissionData(): void {
    this.isLoading = true;
    this.permissionService.getById(this.permissionId).subscribe({
      next: (permission) => {
        const currentStatus = Boolean(permission.status);
        this.form.patchValue({
          name: permission.name,
          description: permission.description,
          status: currentStatus
        });
        this.showReactivarToggle = !currentStatus;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar datos de la permission', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/permissions']);
      }
    });
  }

  onToggleChange(event: MatSlideToggleChange): void {
    this.reactivarPermission = event.checked;
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

    this.permissionService.update(payload).subscribe({
      next: () => {
        this.snackBar.open('Permission actualizada exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/permission']);
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
    this.router.navigate(['/permission']);
  }
}