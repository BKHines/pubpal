import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { UserModel } from 'src/app/shared/models';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/providers/common.service';

@Component({
  selector: 'app-userregistration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  localUser: UserModel;
  password: string;
  registrationFailed: boolean;

  constructor(
    private router: Router,
    private userSvc: UserService,
    private commonSvc: CommonService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.userSvc.user) {
      this.localUser = Object.assign({}, this.userSvc.user);
    } else {
      this.localUser = {
        email: '',
        firstname: '',
        lastname: '',
        waivedfeetokens: 0,
        feediscount: 1
      };
    }
    this.commonSvc.headerMessage = 'Register New User';
    this.commonSvc.menuoptionsType = 'user';
  }

  resetUser() {
    this.localUser = {
      email: '',
      firstname: '',
      lastname: '',
      waivedfeetokens: 0,
      feediscount: 1
    };
    this.password = '';
    this.router.navigate(['']);
  }

  register() {
    this.registrationFailed = false;
    this.localUser.enabled = true;
    this.localUser['password'] = this.password;

    this.userSvc.addUser(this.localUser).subscribe((res) => {
      this.localUser._id = res.result;
      this.localUser['password'] = '';
      this.userSvc.login(this.localUser.email, this.password);
      this.userSvc.loginComplete.subscribe((status) => {
        if (status) {
          this.router.navigate(['user']);
        } else {
          this.registrationFailed = true;
        }
      });

      // TODO: show modal that user was successfully added
    }, (err) => {
      this.registrationFailed = true;
    });
  }
}
