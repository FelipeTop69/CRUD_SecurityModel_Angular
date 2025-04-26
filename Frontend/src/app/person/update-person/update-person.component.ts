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
import { NgFor, NgIf } from '@angular/common';
import { PersonService } from '../../services/person.service';


@Component({
  selector: 'app-update-person',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatButtonModule, MatIconModule, NgIf, NgFor],
  templateUrl: './update-person.component.html',
  styleUrls: ['./update-person.component.css']
})
export class UpdatePersonComponent implements OnInit {
  private fb = inject(FormBuilder);
  private personService = inject(PersonService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  personId!: number;
  isLoading = false;
  showReactivarToggle = false;
  reactivarPerson = false;

  documentTypes = [
    { value: 'RC', label: 'Registro Civil' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' },
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

  ngOnInit(): void {
    this.personId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadPersonData();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      id: [this.personId],
      name: ['', [ Validators.required,  Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      documentType: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{6,10}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', Validators.required],
      bloodType: ['', Validators.required],
      status: [true],
    });
  }

  private loadPersonData(): void {
    this.isLoading = true;
    this.personService.getById(this.personId).subscribe({
      next: (person) => {
        const currentStatus = Boolean(person.status);
        this.form.patchValue({
          name: person.name,
          lastName: person.lastName,
          email: person.email,
          documentType: person.documentType,
          documentNumber: person.documentNumber,
          phone: person.phone,
          address: person.address,
          bloodType: person.bloodType,
          status: currentStatus
        });
        this.showReactivarToggle = !currentStatus;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar datos de la persona', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/persons']);
      }
    });
  }

  onToggleChange(event: MatSlideToggleChange): void {
    this.reactivarPerson = event.checked;
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

    this.personService.update(payload).subscribe({
      next: () => {
        this.snackBar.open('Persona actualizada exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/person']);
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
    this.router.navigate(['/person']);
  }
}