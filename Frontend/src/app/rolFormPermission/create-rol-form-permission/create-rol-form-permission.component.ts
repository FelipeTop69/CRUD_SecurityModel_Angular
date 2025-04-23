import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RolFormPermissionService } from '../../services/rol-form-permission.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NgFor, NgIf } from '@angular/common';
import { RolService } from '../../services/rol.service';
import { FormService } from '../../services/form.service';
import { PermissionService } from '../../services/permission.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-rolFormPermission',
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
  templateUrl: './create-rol-form-permission.component.html',
  styleUrl: './create-rol-form-permission.component.css'
})
export class CreateRolFormPermissionComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private rolFormPermissionService = inject(RolFormPermissionService);
  private rolService = inject(RolService);
  private formService = inject(FormService);
  private permissionService = inject(PermissionService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  rols: any[] = [];
  noRolsAvailable = false;

  forms: any[] = [];
  noFomsAvailable = false;

  permissions: any[] = [];
  noPermissionsAvailable = false;

  form = this.formBuilder.group({
    rolId: [null, Validators.required],
    formId: [null, Validators.required],
    permissionId: [null, Validators.required],
  });

  ngOnInit(): void {
    this.loadRols();
    this.loadForms();
    this.loadPermissions();
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

  private loadForms(): void {
    this.formService.getAll().subscribe({
      next: (data) => {
        this.forms = data;
        if (this.forms.length === 0) {
          this.noFomsAvailable = true;
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

  private loadPermissions(): void {
    this.permissionService.getAll().subscribe({
      next: (data) => {
        this.permissions = data;
        if (this.permissions.length === 0) {
          this.noPermissionsAvailable = true;
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

    this.rolFormPermissionService.create(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Usuario registrado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/rolFormPermission']);
      },
      error: (err) => {
        this.snackBar.open(`Error al registrar: ${err.message}`, 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/rolFormPermission']);
  }

}
