import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/providers/user.service';

@Component({
  selector: 'app-userlogin',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  loginFailed: boolean;

  constructor(
    private router: Router,
    private userSvc: UserService
  ) { }

  ngOnInit() {
  }

  resetUser() {
    this.password = '';
    this.router.navigate(['']);
  }

  login() {
    this.loginFailed = false;

    this.userSvc.login(this.email, this.password);
    let userlogin$ = this.userSvc.loginComplete.subscribe((status) => {
      if (status) {
        this.router.navigate(['user']);
      } else {
        this.loginFailed = true;
      }
      userlogin$.unsubscribe();
    }, (usererr) => {
      userlogin$.unsubscribe();
    });
  }
}
