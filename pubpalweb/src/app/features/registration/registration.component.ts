import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/shared/models';
import { UserService } from 'src/app/providers/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  localUser: UserModel;
  password: string;

  constructor(public userSvc: UserService, private router: Router) { }

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
    this.localUser.enabled = true;
    // TODO: use password to set token on user service
    this.userSvc.addUser(this.localUser).subscribe((res) => {
      // TODO: show modal that user was successfully added
      this.localUser._id = res.result;
      this.userSvc.user = Object.assign({}, this.localUser);
      this.router.navigate(['']);
    });
  }

  resetUser() {
    this.localUser = null;
    this.router.navigate(['']);
  }
}
