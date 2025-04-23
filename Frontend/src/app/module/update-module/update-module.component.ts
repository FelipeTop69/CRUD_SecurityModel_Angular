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
import { ModuleService } from '../../services/module.service';


@Component({
  selector: 'app-update-module',
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
  templateUrl: './update-module.component.html',
  styleUrls: ['./update-module.component.css']
})
export class UpdateModuleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private moduleService = inject(ModuleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  moduleId!: number;
  isLoading = false;
  showReactivarToggle = false;
  reactivarModule = false;

  ngOnInit(): void {
    this.moduleId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadModuleData();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      id: [this.moduleId],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      status: [true],
    });
  }

  private loadModuleData(): void {
    this.isLoading = true;
    this.moduleService.getById(this.moduleId).subscribe({
      next: (module) => {
        const currentStatus = Boolean(module.status);
        this.form.patchValue({
          name: module.name,
          description: module.description,
          status: currentStatus
        });
        this.showReactivarToggle = !currentStatus;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar datos de la module', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/modules']);
      }
    });
  }

  onToggleChange(event: MatSlideToggleChange): void {
    this.reactivarModule = event.checked;
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

    this.moduleService.update(payload).subscribe({
      next: () => {
        this.snackBar.open('Module actualizada exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/module']);
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
    this.router.navigate(['/module']);
  }
}