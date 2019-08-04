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
    private pubpalCryptoSvc: PubpalcryptoService,
    private userSvc: UserService,
    private localSvc: LocalstoreService,
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
    this.pubpalCryptoSvc.getIp().subscribe((ipres: APIResponse) => {
      const IP = ipres.result;
      const KEY = this.pubpalCryptoSvc.getKey(this.password);

      this.userSvc.authToken = this.pubpalCryptoSvc.generateToken(this.email, KEY, IP);

      this.userSvc.getUserByEmail(this.email).subscribe((userres) => {
        this.userSvc.user = userres.result;
        this.localSvc.set(CONSTANTS.KEY_STORE_USEREMAIL, this.userSvc.user.email);
        this.localSvc.set(CONSTANTS.KEY_STORE_KEY, KEY);
        this.router.navigate(['']);
      }, (err) => {
        this.loginFailed = true;
      });
    });
  }
}
