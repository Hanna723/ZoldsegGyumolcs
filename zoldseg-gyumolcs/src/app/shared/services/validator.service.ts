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

  static emailExists(userService: UserService, email: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(email);
      if (!control?.errors) {
        userService.getByEmail(control?.value).subscribe((data) => {
          if (data.length !== 0) {
            control?.setErrors({
              exists: {
                takenEmail: control?.value,
              },
            });
          }
        });
        return null;
      }
      return null;
    };
  }

  static emailNotExists(userService: UserService, email: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(email);
      if (!control?.errors) {
        userService.getByEmail(control?.value).subscribe((data) => {
          if (data.length === 0) {
            control?.setErrors({
              notExists: {
                email: control?.value,
              },
            });
          }
        });
        return null;
      }
      return null;
    };
  }
}
