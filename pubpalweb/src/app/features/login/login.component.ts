import { Component, OnInit } from '@angular/core';
import { PubpalcryptoService } from 'src/app/providers/pubpalcrypto.service';
import { APIResponse } from 'src/app/shared/models';
import { UserService } from 'src/app/providers/user.service';
import { LocalstoreService } from 'src/app/providers/localstore.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  loginFailed: boolean;

  constructor(
    private userSvc: UserService,
    private router: Router) { }

  ngOnInit() {
  }

  resetForm() {
    this.email = '';
    this.password = '';
    this.router.navigate(['']);
  }

  login() {
    this.loginFailed = false;
    this.userSvc.login(this.email, this.password);
    this.userSvc.loginComplete.subscribe((status) => {
      if (status) {
        this.router.navigate(['']);
      } else {
        this.loginFailed = true;
      }
    });
  }
}
