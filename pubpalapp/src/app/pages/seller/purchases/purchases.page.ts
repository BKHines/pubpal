import { Component, OnInit } from '@angular/core';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { Purchase, ChangePurchaseStatusRequest } from 'src/app/shared/models';
import { SellerService } from 'src/app/providers/seller.service';
import { CommonService } from 'src/app/providers/common.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
})
export class PurchasesPage implements OnInit {
  purchases: Purchase[];
  activepurchases: Purchase[];
  nextStatusText: string;

  itemname: string;
  customername: string;
  cancelcomments: string;

  constructor(
    private sellerSvc: SellerService,
    private common: CommonService,
    private purchaseSvc: PurchaseService
  ) { }

  ngOnInit() {
    this.loadData();
    this.sellerSvc.sellerLoaded.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    if (this.sellerSvc.seller) {
      this.common.headerMessage = 'Purchases';
      this.common.menuoptionsType = 'seller';
      this.purchaseSvc.getPurchasesBySellerId(this.sellerSvc.seller._id).subscribe((res) => {
        this.purchases = res.result;
        this.purchases.map(a => {
          a['nextstatustext'] = this.common.getNextStatusText(a.currentstatus);
          a['nextstatus'] = this.common.getNextStatus(a.currentstatus);
        });

        this.activepurchases = this.purchases.filter(a => a.currentstatus !== 'cancelled' && a.currentstatus !== 'pickedup');
      });
    }
  }

  updateToNextStatus(_purchase: Purchase) {
    const changeStatusReq: ChangePurchaseStatusRequest = {
      status: _purchase['nextstatus'],
      purchaseid: _purchase._id
    };
    this.purchaseSvc.changePurchaseStatusBySeller(this.sellerSvc.seller._id, changeStatusReq).subscribe((res) => {
      this.loadData();
    });
  }

  resetCancel() {
    this.itemname = '';
    this.customername = '';
    this.cancelcomments = '';
  }

  cancelOrder(_purchaseId: string, comments: string) {
    const cancelPurchaseRequest: ChangePurchaseStatusRequest = {
      purchaseid: _purchaseId,
      status: 'cancelled',
      message: comments
    };
    this.purchaseSvc.cancelPurchaseBySeller(this.sellerSvc.seller._id, cancelPurchaseRequest).subscribe((res) => {
      this.loadData();
    });
  }
}
