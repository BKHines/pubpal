import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { UserModel } from 'src/app/shared/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
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

  updateUser() {
    this.userSvc.updateUser(this.localUser).subscribe((res) => {
      // TODO: show modal that user was successfully updated
      this.userSvc.user = Object.assign({}, this.localUser);
      this.router.navigate(['']);
    });
  }

  restoreUser() {
    this.localUser = Object.assign({}, this.userSvc.user);
    this.router.navigate(['']);
  }

  resetUser() {
    this.localUser = null;
    this.router.navigate(['']);
  }
}
