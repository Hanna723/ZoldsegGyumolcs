import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../app.component.scss'],
})
export class RegisterComponent {
  hide = true;
  hide2 = true;
  registrationForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password2: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    postal_code: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    number: new FormControl('', [Validators.required]),
  },
  {
    validators: [ValidatorService.equals('password', 'password2')]
  });

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  onSubmit() {
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
            number: this.registrationForm.controls['number'].value
          },
        };
        this.userService
          .create(user)
          .then(() => {
            console.log('Success?');
            // popup?
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
