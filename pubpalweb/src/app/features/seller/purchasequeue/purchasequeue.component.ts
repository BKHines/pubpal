import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Purchase, APIResponse, ChangePurchaseStatusRequest, StatusText } from 'src/app/shared/models';
import { SellerService } from 'src/app/providers/seller.service';
import { CommonService } from 'src/app/providers/common.service';
import { LoadingService } from 'src/app/providers/loading.service';

@Component({
  selector: 'app-purchasequeue',
  templateUrl: './purchasequeue.component.html',
  styleUrls: ['./purchasequeue.component.scss']
})
export class PurchasequeueComponent implements OnInit, AfterViewInit {
  purchases: Purchase[];
  nextStatusText: StatusText;

  constructor(private sellerSvc: SellerService, private common: CommonService, private loadingSvc: LoadingService) { }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.sellerSvc.sellerLoaded.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    if (this.sellerSvc.seller) {
      this.loadingSvc.addMessage('GettingPurchases', 'Checking Purchases...');
      this.sellerSvc.getPurchasesById(this.sellerSvc.seller._id).subscribe((res: APIResponse) => {
        this.purchases = res.result;
        this.purchases.map(a => {
          a['nextstatustext'] = this.common.getNextStatusText(a.currentstatus);
          a['nextstatus'] = this.common.getNextStatus(a.currentstatus);
        });
        this.loadingSvc.removeMessage('GettingPurchases');
      });
    }
  }

  updateToNextStatus(_purchase: Purchase) {
    const changeStatusReq: ChangePurchaseStatusRequest = {
      status: _purchase['nextstatus'],
      purchaseid: _purchase._id
    };
    this.loadingSvc.addMessage('UpdateStatus', 'Updating Purchase Status...');
    this.sellerSvc.changePurchaseStatus(this.sellerSvc.seller._id, changeStatusReq).subscribe((res: APIResponse) => {
      this.loadData();
      this.loadingSvc.removeMessage('UpdateStatus');
    });
  }
}
