import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { APIResponse, Purchase } from 'src/app/shared/models';
import { PurchaseService } from 'src/app/providers/purchase.service';

@Component({
  selector: 'app-purchasehistory',
  templateUrl: './purchasehistory.component.html',
  styleUrls: ['./purchasehistory.component.scss']
})
export class PurchasehistoryComponent implements OnInit {
  purchases: Purchase[];
  itemname: string;
  customername: string;
  cancelcomments: string;

  constructor(
    private userSvc: UserService,
    private purchaseSvc: PurchaseService) { }

  ngOnInit() {
    this.loadData();
    this.userSvc.userLoaded.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    if (this.userSvc.user) {
      this.purchaseSvc.getPurchasesByUserId(this.userSvc.user._id).subscribe((res: APIResponse) => {
        this.purchases = res.result as Purchase[];
      });
    }
  }

}
