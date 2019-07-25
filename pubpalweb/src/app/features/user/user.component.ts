import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { UserModel } from 'src/app/shared/models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  localUser: UserModel;
  password: string;

  constructor(public userSvc: UserService) { }

  ngOnInit() {
    this.localUser = Object.assign({}, this.userSvc.user);
  }

  addUser() {
    this.userSvc.addUser(this.localUser).subscribe((res) => {

    });
  }

  updateUser() {
    this.userSvc.updateUser(this.localUser).subscribe((res) => {

    });
  }

  restoreUser() {
    this.localUser = Object.assign({}, this.userSvc.user);
  }

  resetUser() {
    this.localUser = null;
  }
}
