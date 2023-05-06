import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor() {}

  static equals(string1: string, string2: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(string1);
      const equalsControl = controls.get(string2);

      if (
        !control?.errors &&
        !equalsControl?.errors &&
        control?.value !== equalsControl?.value
      ) {
        equalsControl?.setErrors({
          equals: {
            actualValue: equalsControl?.value,
            requiredValue: control?.value,
          },
        });
        return { equals: true };
      }
      return null;
    };
  }
}
