import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  user?: firebase.default.User | null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
      this.authService.isLoggedIn().subscribe(user => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      })
  }

  logOut(): void {
    this.authService.logOut();
  }
}
