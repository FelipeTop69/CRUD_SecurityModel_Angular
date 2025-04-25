import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../utils/validators';


@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    MatIconModule
  ],
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  userId!: number;
  isLoading = false;
  showReactivarToggle = false;
  reactivarUsuario = false;
  hidePassword = true;

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadUserData();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      id: [this.userId],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.strongPassword()
      ]],
      personId: [0],
      status: [true],
    });
  }

  private loadUserData(): void {
    this.isLoading = true;
    this.userService.getById(this.userId).subscribe({
      next: (user) => {
        const currentStatus = Boolean(user.status);
        const isAdmin = this.authService.getUserRole() === "Administrador";
        this.form.patchValue({
          username: user.username,
          personId: user.personId,
          status: currentStatus
        });
        
        // Mostrar toggle solo si el usuario está inactivo
        this.showReactivarToggle = !currentStatus && isAdmin;
        this.isLoading = false;
        // console.log(isAdmin)
      },
      error: (err) => {
        this.snackBar.open('Error al cargar datos del usuario', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/user']);
      }
    });
  }

  onToggleChange(event: MatSlideToggleChange): void {
    this.reactivarUsuario = event.checked;
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
    const payload = {
      ...this.form.value,
      password: this.form.value.password || undefined
    };

    this.userService.update(payload).subscribe({
      next: () => {
        this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/user']);
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
    this.router.navigate(['/user']);
  }
}