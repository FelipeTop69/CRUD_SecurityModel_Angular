import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormModuleService } from '../../services/form-module.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NgFor, NgIf } from '@angular/common';
import { FormService } from '../../services/form.service';
import { ModuleService } from '../../services/module.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

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
  templateUrl: './create-form-module.component.html',
  styleUrl: './create-form-module.component.css'
})
export class CreateFormModuleComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private formModule = inject(FormModuleService);
  private formService = inject(FormService);
  private moduleService = inject(ModuleService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  forms: any[] = [];
  noFormsAvailable = false;

  modules: any[] = [];
  noModuleAvailable = false;


  form = this.formBuilder.group({
    formId: [null, Validators.required],
    moduleId: [null, Validators.required],
  });

  ngOnInit(): void {
    this.loadForms();
    this.loadModules();
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
      error: (err) => {
        this.snackBar.open('Error al cargar personas disponibles', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  private loadModules(): void {
    this.moduleService.getAll().subscribe({
      next: (data) => {
        this.modules = data;
        if (this.modules.length === 0) {
          this.noModuleAvailable = true;
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

    this.formModule.create(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Usuario registrado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/formModule']);
      },
      error: (err) => {
        this.snackBar.open(`Error al registrar: ${err.message}`, 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/formModule']);
  }

}
