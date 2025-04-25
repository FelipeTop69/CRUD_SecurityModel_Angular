// src/app/utils/validators.ts
import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    static onlyNumbers(maxLength: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value = control.value;
            if (!value) return null;

            // Validar que solo contenga números
            if (!/^\d*$/.test(value)) {
                return { onlyNumbers: true };
            }

            // Validar longitud máxima
            if (value.length > maxLength) {
                return { maxLength: { requiredLength: maxLength } };
            }

            return null;
        };
    }

    static strongPassword(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value = control.value;
            if (!value) return null;

            // Debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

            const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

            return !valid ? { strongPassword: true } : null;
        };
    }
}