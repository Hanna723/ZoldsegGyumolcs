import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/shared/services/auth.service';
import { Order } from 'src/app/shared/models/Order';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @Input() orderAmount: number = 0;
  @ViewChild('sidenav') sidenav?: MatSidenav;
  user?: firebase.default.User | null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((user) => {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(this.user));
      if (this.user && !localStorage.getItem('order')) {
        this.createEmptyOrder(this.user?.uid);
      }
    });

    this.router.events.subscribe(event => {
      this.sidenav?.close();
    })
  }

  logOut(): void {
    this.authService.logOut();
    localStorage.removeItem('order');
  }

  createEmptyOrder(uid: string): void {
    const order: Order = {
      user: uid,
      products: [],
      price: 0,
      time: new Date(),
    };

    localStorage.setItem('order', JSON.stringify(order));
  }
}
