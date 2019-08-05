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
}
