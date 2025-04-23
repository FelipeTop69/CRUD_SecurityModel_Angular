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
import { UserService } from '../../services/user.service';
import { RolUserService } from '../../services/rol-user.service';

@Component({
  selector: 'app-update-rolUser',
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
  templateUrl: './update-rol-user.component.html',
  styleUrls: ['./update-rol-user.component.css']
})
export class UpdateRolUserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private rolUserService = inject(RolUserService);
  private rolService = inject(RolService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  rols: any[] = [];
  noRolsAvailable = false;

  users: any[] = [];
  noUsersAvailable = false;


  form!: FormGroup;
  rolUserId!: number;
  isLoading = false;
  currentData: { rolId?: number } = {};
  showReactivarToggle = false;
  reactivarRolUser = false;

  ngOnInit(): void {
    this.rolUserId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadRolUserData();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      id: [this.rolUserId],
      rolId: [0, Validators.required],
      userId: [0],
      status: [true],
    });
    this.loadRols();
    this.loadUsers();
  }

  private loadRolUserData(): void {
    this.isLoading = true;
    this.rolUserService.getById(this.rolUserId).subscribe({
      next: (rolUser) => {
        const currentStatus = Boolean(rolUser.status);
        this.form.patchValue({
          rolId: rolUser.rolId,
          userId: rolUser.userId,
          status: currentStatus
        });

        this.currentData = { rolId: rolUser.rolId };
        this.showReactivarToggle = !currentStatus;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Error al cargar datos del rolUser', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/rolUser']);
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

  private loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        if (this.users.length === 0) {
          this.noUsersAvailable = true;
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
    this.reactivarRolUser = event.checked;
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

    this.rolUserService.update(payload).subscribe({
      next: () => {
        this.snackBar.open('RolUser actualizado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/rolUser']);
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
    this.router.navigate(['/rolUser']);
  }
}
