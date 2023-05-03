import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user.service';

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
    password: new FormControl('', [Validators.required]),
    password2: new FormControl('', [Validators.required]),
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
            city: '',
            country: '',
            postal_code: '',
            street: '',
            number: '',
          },
        };
        this.userService.create(user).then(() => {
          console.log("Success?");
        }).catch((err) => {
          console.error(err);
        })
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
