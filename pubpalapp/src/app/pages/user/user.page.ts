import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { CommonService } from 'src/app/providers/common.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  constructor(
    public userSvc: UserService,
    public commonSvc: CommonService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadData();
    this.userSvc.userLoaded.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    if (this.userSvc.user) {
      this.commonSvc.headerMessage = 'Welcome back ' + this.userSvc.user.firstname + '!';
      this.commonSvc.menuoptionsType = 'user';
    }
  }
}
