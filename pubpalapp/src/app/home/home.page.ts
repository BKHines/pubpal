import { Component } from '@angular/core';
import { CommonService } from '../providers/common.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public commonSvc: CommonService
  ) {}

  ionViewDidEnter() {
    this.commonSvc.headerMessage = 'PubPal';
  }
}
