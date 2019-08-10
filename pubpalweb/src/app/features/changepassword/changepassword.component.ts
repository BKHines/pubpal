import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/providers/user.service';
import { SellerService } from 'src/app/providers/seller.service';
import { TokenService } from 'src/app/providers/token.service';
import { ChangePasswordRequest, APIResponse } from 'src/app/shared/models';
import { PubpalcryptoService } from 'src/app/providers/pubpalcrypto.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  newpassword: string;
  conpassword: string;

  passwordUpdated: boolean;
  passwordUpdateFailed: boolean;

  constructor(
    private router: Router,
    private userSvc: UserService,
    private sellerSvc: SellerService,
  ) { }

  ngOnInit() {
  }

  updatePassword() {
    this.passwordUpdateFailed = false;
    this.passwordUpdated = true;
    if (this.userSvc.user) {
      let cpr: ChangePasswordRequest = {
        id: this.userSvc.user._id,
        newpassword: this.newpassword,
        confirmpassword: this.conpassword
      };

      this.userSvc.changePassword(cpr).subscribe((res) => {
        if (res.result) {
          this.passwordUpdated = true;
          this.userSvc.login(this.userSvc.user.email, cpr.newpassword);
        } else {
          this.passwordUpdated = false;
          this.passwordUpdateFailed = true;
        }
      }, (err) => {
        this.passwordUpdateFailed = true;
      });
    } else if (this.sellerSvc.seller) {
      let cpr: ChangePasswordRequest = {
        id: this.sellerSvc.seller._id,
        newpassword: this.newpassword,
        confirmpassword: this.conpassword
      };

      this.sellerSvc.changePassword(cpr).subscribe((res) => {
        if (res.result) {
          this.passwordUpdated = true;
          this.sellerSvc.login(this.sellerSvc.seller.email, cpr.newpassword);
        } else {
          this.passwordUpdated = false;
          this.passwordUpdateFailed = true;
        }
      }, (err) => {
        this.passwordUpdateFailed = true;
      });
    }
  }

  cancelUpdate() {
    this.router.navigate(['']);
  }
}
