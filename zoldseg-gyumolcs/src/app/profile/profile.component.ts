import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/User';
import { AuthService } from '../shared/services/auth.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../app.component.scss'],
})
export class ProfileComponent implements OnInit {
  hide = true;
  hide2 = true;
  email?: string;
  id?: string;
  profileForm: FormGroup = new FormGroup({
    country: new FormControl('', [Validators.required]),
    postal_code: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    number: new FormControl('', [Validators.required]),
  });
  subscription?: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      this.id = JSON.parse(loggedInUser).uid;
      this.subscription = this.userService
        .getById(JSON.parse(loggedInUser).uid)
        .subscribe((user) => {
          (this.email = user?.email),
            this.profileForm.setValue({
              country: user?.address.country,
              postal_code: user?.address.postal_code,
              city: user?.address.city,
              street: user?.address.street,
              number: user?.address.number,
            });
        });
    }
  }

  onSubmit(): void {
    if (this.id && this.email) {
      const user: User = {
        id: this.id,
        email: this.email,
        address: {
          city: this.profileForm.controls['city'].value,
          country: this.profileForm.controls['country'].value,
          postal_code: this.profileForm.controls['postal_code'].value,
          street: this.profileForm.controls['street'].value,
          number: this.profileForm.controls['number'].value,
        },
      };

      this.userService.update(user).then(() => {
        this.openDialog('Profile successfully updated!', 'Ok');
      });
    }
  }

  deleteProfile(): void {
    const dialogRef = this.openDialog(
      'Warning! Your profile will be deleted forever!',
      'Cancel',
      true
    );
    const dialogSubscription =
      dialogRef.componentInstance.deleteEvent.subscribe(() => {
        if (this.id) {
          this.subscription?.unsubscribe();
          this.userService.delete(this.id).then(() => {
            this.authService.deleteUser();
          });
        }
        dialogSubscription.unsubscribe();
      });
  }

  openDialog(title: string, button: string, del: boolean = false): MatDialogRef<DialogComponent, any> {
    return this.dialog.open(DialogComponent, {
      width: '350px',
      height: del ? '155px' : '130px',
      data: {
        title: title,
        button: button,
        delete: del,
      },
    });
  }
}
