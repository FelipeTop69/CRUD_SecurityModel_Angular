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
import { NgIf, NgFor } from '@angular/common';
import { RolService } from '../../services/rol.service';
import { FormService } from '../../services/form.service';
import { PermissionService } from '../../services/permission.service';
import { RolFormPermissionService } from '../../services/rol-form-permission.service';

@Component({
  selector: 'app-update-rolFormPermission',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    NgFor
  ],
  templateUrl: './update-rol-form-permission.component.html',
  styleUrls: ['./update-rol-form-permission.component.css']
})
export class UpdateRolFormPermissionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private rolFormPermissionService = inject(RolFormPermissionService);
  private rolService = inject(RolService);
  private formService = inject(FormService);
  private permissionService = inject(PermissionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  rols: { id: number; name: string }[] = [];
  noRolsAvailable = false;

  forms: any[] = [];
  noFormsAvailable = false;

  permissions: any[] = [];
  noPermissionsAvailable = false;

  form!: FormGroup;
  rolFormPermissionId!: number;
  isLoading = false;
  currentData: { rolId?: number } = {};
  showReactivarToggle = false;
  reactivarRolFormPermission = false;

  ngOnInit(): void {
    this.rolFormPermissionId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadRolFormPermissionData();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      id: [this.rolFormPermissionId],
      rolId: [0, Validators.required],
      formId: [0],
      permissionId: [0],
      status: [true],
    });
    this.loadRols();
    this.loadForms();
    this.loadPermissions();
  }

  private loadRolFormPermissionData(): void {
    this.isLoading = true;
    this.rolFormPermissionService.getById(this.rolFormPermissionId).subscribe({
      next: (rolFormPermission) => {
        const currentStatus = Boolean(rolFormPermission.status);
        this.form.patchValue({
          rolId: rolFormPermission.rolId,
          formId: rolFormPermission.formId,
          permissionId: rolFormPermission.permissionId,
          status: currentStatus
        });

        this.currentData = { rolId: rolFormPermission.rolId };
        this.showReactivarToggle = !currentStatus;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar datos del rolFormPermission', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/rolFormPermission']);
      }
    });
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
      error: () => {
        this.snackBar.open('Error al cargar roles disponibles', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  private loadForms(): void {
    this.formService.getAll().subscribe({
      next: (data) => {
        this.forms = data;
        if (this.forms.length === 0) {
          this.noFormsAvailable = true;
          this.form.disable();
        }
      },
      error: () => {
        this.snackBar.open('Error al cargar formularios disponibles', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  private loadPermissions(): void {
    this.permissionService.getAll().subscribe({
      next: (data) => {
        this.permissions = data;
        if (this.permissions.length === 0) {
          this.noPermissionsAvailable = true;
          this.form.disable();
        }
      },
      error: () => {
        this.snackBar.open('Error al cargar permisos disponibles', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  onToggleChange(event: MatSlideToggleChange): void {
    this.reactivarRolFormPermission = event.checked;
    this.form.patchValue({
      status: event.checked
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = { ...this.form.value };

    this.rolFormPermissionService.update(payload).subscribe({
      next: () => {
        this.snackBar.open('RolFormPermission actualizado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/rolFormPermission']);
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
    this.router.navigate(['/rolFormPermission']);
  }
}
