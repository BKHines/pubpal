import { Component, OnInit } from '@angular/core';
import { Purchase, ChangePurchaseStatusRequest } from 'src/app/shared/models';
import { UserService } from 'src/app/providers/user.service';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { CommonService } from 'src/app/providers/common.service';

@Component({
  selector: 'app-purchasehistory',
  templateUrl: './purchasehistory.page.html',
  styleUrls: ['./purchasehistory.page.scss'],
})
export class PurchasehistoryPage implements OnInit {
  activepurchases: Purchase[];
  inactivepurchases: Purchase[];
  showinactivepurchases: boolean;
  itemname: string;
  customername: string;
  showCancelComments: boolean;
  cancelcomments: string;

  constructor(
    private userSvc: UserService,
    private purchSvc: PurchaseService,
    private commonSvc: CommonService
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
    this.commonSvc.headerMessage = 'Your Purchase History';
    this.commonSvc.menuoptionsType = 'user';
    if (this.userSvc.user) {
      this.purchSvc.getPurchasesByUserId(this.userSvc.user._id).subscribe((res) => {
        this.activepurchases = [];
        this.inactivepurchases = [];
        res.result.forEach((p) => {
          if (/cancelled|pickedup/i.test(p.currentstatus)) {
            this.inactivepurchases.push(p);
          } else {
            this.activepurchases.push(p);
          }
        });
      });
    }
  }

  changeStatus(purchase: Purchase, newstatus: 'cancelled' | 'pickedup') {
    const _changestatusreq: ChangePurchaseStatusRequest = {
      purchaseid: purchase._id,
      message: this.cancelcomments,
      status: newstatus
    };
    this.purchSvc.changePurchaseStatusByUser(this.userSvc.user._id, _changestatusreq).subscribe((res) => {
      if (res.result) {
        this.loadData();
      }
    });
  }

}
