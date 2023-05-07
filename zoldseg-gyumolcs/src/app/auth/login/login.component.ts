import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/shared/services/auth.service';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../app.component.scss'],
})
export class LoginComponent {
  hide = true;
  loginForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    },
    {
      validators: [
        ValidatorService.emailNotExists(this.userService, 'email'),
      ],
    }
  );

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService
      .login(
        this.loginForm.controls['email'].value,
        this.loginForm.controls['password'].value
      )
      .then(() => {
        this.router.navigateByUrl('/products/list');
      })
      .catch((err) => {
        this.loginForm.controls['password'].setErrors({'wrong': true});
      });
  }
}
