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
import { FormModuleService } from '../../services/form-module.service';
import { ModuleService } from '../../services/module.service';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-update-formModule',
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
  templateUrl: './update-form-module.component.html',
  styleUrls: ['./update-form-module.component.css']
})
export class UpdateFormModuleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private formModuleService = inject(FormModuleService);
  private formService = inject(FormService);
  private moduleService = inject(ModuleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  forms: any[] = [];
  noFormsAvailable = false;

  moduless: any[] = [];
  noModulessAvailable = false;



  form!: FormGroup;
  formModuleId!: number;
  isLoading = false;
  currentData: { rolId?: number } = {};
  showReactivarToggle = false;
  reactivarFormModule = false;

  ngOnInit(): void {
    this.formModuleId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadFormModuleData();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      id: [this.formModuleId],
      formId: [0],
      moduleId: [0],
      status: [true],
    });
    this.loadForms();
    this.loadModules();
  }

  private loadFormModuleData(): void {
    this.isLoading = true;
    this.formModuleService.getById(this.formModuleId).subscribe({
      next: (formModule) => {
        const currentStatus = Boolean(formModule.status);
        this.form.patchValue({
          formId: formModule.formId,
          moduleId: formModule.moduleId,
          status: currentStatus
        });

        this.currentData = { rolId: formModule.rolId };
        this.showReactivarToggle = !currentStatus;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar datos del formModule', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/formModule']);
      }
    });
  }

  private loadModules(): void {
    this.moduleService.getAll().subscribe({
      next: (data) => {
        this.moduless = data;
        if (this.moduless.length === 0) {
          this.noModulessAvailable = true;
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



  onToggleChange(event: MatSlideToggleChange): void {
    this.reactivarFormModule = event.checked;
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

    this.formModuleService.update(payload).subscribe({
      next: () => {
        this.snackBar.open('FormModule actualizado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/formModule']);
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
    this.router.navigate(['/formModule']);
  }
}
