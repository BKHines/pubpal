import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SellerService } from 'src/app/providers/seller.service';
import { CommonService } from 'src/app/providers/common.service';

@Component({
  selector: 'app-sellerlogin',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  loginFailed: boolean;

  constructor(
    private router: Router,
    private sellerSvc: SellerService,
    private commonSvc: CommonService
  ) { }

  ngOnInit() {
    this.commonSvc.headerMessage = 'Login';
    this.commonSvc.menuoptionsType = 'seller';
  }

  resetUser() {
    this.password = '';
    this.router.navigate(['']);
  }

  login() {
    this.loginFailed = false;

    this.sellerSvc.login(this.email, this.password);
    let sellerlogin$ = this.sellerSvc.loginComplete.subscribe((status) => {
      if (status) {
        this.router.navigate(['seller']);
      } else {
        this.loginFailed = true;
      }
      sellerlogin$.unsubscribe();
    }, (usererr) => {
      sellerlogin$.unsubscribe();
    });
  }
}
