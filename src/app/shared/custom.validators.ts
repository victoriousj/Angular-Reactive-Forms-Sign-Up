import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static isNumber(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && isNaN(c.value)) {
        return { isNumber: true };
      }
      return null;
    };
  }
}
