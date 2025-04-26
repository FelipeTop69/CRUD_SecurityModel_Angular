// src/app/utils/validators.ts
import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    static strongPassword(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value = control.value;
            if (!value) return null;

            // Debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecialChar = /[!@#$%^_&*+(),.?":{}|<>]/.test(value);

            const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

            return !valid ? { strongPassword: true } : null;
        };
    }
}