import { Component, OnInit } from '@angular/core';
import { Purchase } from 'src/app/shared/models';
import { UserService } from 'src/app/providers/user.service';
import { PurchaseService } from 'src/app/providers/purchase.service';

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
  cancelcomments: string;

  constructor(
    private userSvc: UserService,
    private purchSvc: PurchaseService
  ) { }

  ngOnInit() {
    this.loadData();
    this.userSvc.userLoaded.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    if (this.userSvc.user) {
      this.purchSvc.getPurchasesByUserId(this.userSvc.user._id).subscribe((res) => {
        this.activepurchases = [];
        this.inactivepurchases = [];
        res.result.forEach((p) => {
          if (!/cancelled|pickedup/i.test(p.currentstatus)) {
            this.activepurchases.push(p);
          } else {
            this.inactivepurchases.push(p);
          }
        });
      });
    }
  }

}
