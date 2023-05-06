import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @Input() orderAmount: number = 0;
  user?: firebase.default.User | null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((user) => {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(this.user));
      if (this.user && !localStorage.getItem('order')) {
        this.createEmptyOrder(this.user?.uid);
      }
    });
  }

  

  logOut(): void {
    this.authService.logOut();
    localStorage.removeItem('order');
  }

  createEmptyOrder(uid: string) {
    const order: Order = {
      user: uid,
      products: [],
      price: 0,
      time: new Date(),
    };

    localStorage.setItem('order', JSON.stringify(order));
  }
}
