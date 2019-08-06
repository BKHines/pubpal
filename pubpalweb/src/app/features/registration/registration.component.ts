import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/shared/models';
import { UserService } from 'src/app/providers/user.service';
import { Router } from '@angular/router';
import { PubpalcryptoService } from 'src/app/providers/pubpalcrypto.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  localUser: UserModel;
  password: string;
  registrationFailed: boolean;

  constructor(
    public userSvc: UserService,
    private router: Router) { }

  ngOnInit() {
    if (this.userSvc.user) {
      this.localUser = Object.assign({}, this.userSvc.user);
    } else {
      this.localUser = {
        email: '',
        firstname: '',
        lastname: ''
      };
    }
  }

  addUser() {
    this.registrationFailed = false;
    this.localUser.enabled = true;
    this.localUser['password'] = this.password;

    this.userSvc.addUser(this.localUser).subscribe((res) => {
      this.localUser._id = res.result;
      this.localUser['password'] = '';
      this.userSvc.login(this.localUser.email, this.password);
      this.userSvc.loginComplete.subscribe((status) => {
        if (status) {
          this.router.navigate(['']);
        } else {
          this.registrationFailed = true;
        }
      });

      // TODO: show modal that user was successfully added
     }, (err) => {
       this.registrationFailed = true;
     });
  }

  resetUser() {
    this.localUser = null;
    this.router.navigate(['']);
  }
}