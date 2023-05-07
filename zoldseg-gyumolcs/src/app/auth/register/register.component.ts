import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/User';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../app.component.scss'],
})
export class RegisterComponent {
  hide = true;
  hide2 = true;
  registrationForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      password2: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      postal_code: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required]),
    },
    {
      validators: [ValidatorService.equals('password', 'password2'), ValidatorService.emailExists(this.userService, 'email')],
    }
  );

  constructor(
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  onSubmit(): void {
    this.authService
      .signup(
        this.registrationForm.controls['email'].value,
        this.registrationForm.controls['password'].value
      )
      .then((credentials) => {
        const user: User = {
          id: credentials.user?.uid as string,
          email: this.registrationForm.controls['email'].value,
          address: {
            country: this.registrationForm.controls['country'].value,
            postal_code: this.registrationForm.controls['postal_code'].value,
            city: this.registrationForm.controls['city'].value,
            street: this.registrationForm.controls['street'].value,
            number: this.registrationForm.controls['number'].value,
          },
        };
        this.userService
          .create(user)
          .then(() => {
            this.authService.logOut();
            this.openDialog();
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '350px',
      height: '130px',
      data: {
        title: 'Registration succesful!',
        button: 'Ok',
      },
    });
  }
}
