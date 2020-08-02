import { Component, OnInit } from '@angular/core';
import { SellerService } from 'src/app/providers/seller.service';
import { CommonService } from 'src/app/providers/common.service';
import { LoadingController } from '@ionic/angular';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { Purchase } from 'src/app/shared/models';

@Component({
  selector: 'app-purchasehistory',
  templateUrl: './purchasehistory.page.html',
  styleUrls: ['./purchasehistory.page.scss'],
})
export class PurchasehistoryPage implements OnInit {
  purchases: Purchase[];
  inactivepurchases: Purchase[];

  historyDate: string;

  constructor(
    private sellerSvc: SellerService,
    private common: CommonService,
    private purchaseSvc: PurchaseService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.historyDate = new Date().toISOString();
  }

  ionViewWillEnter() {
    this.loadData();
    this.sellerSvc.sellerLoaded.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    this.common.headerMessage = 'Purchases';
    this.common.menuoptionsType = 'seller';
    if (this.sellerSvc.seller) {
      this.loadingCtrl.create({ spinner: 'dots' }).then((lc) => {
        lc.present();
        this.purchaseSvc.getPurchasesBySellerIdAndDate(this.sellerSvc.seller._id, this.historyDate).subscribe((res) => {
          this.purchases = res.result;

          this.inactivepurchases = this.purchases.filter(a => a.currentstatus === 'cancelled' || a.currentstatus === 'pickedup');

          this.loadingCtrl.dismiss();
        }, (err) => {
          this.loadingCtrl.dismiss();
        });
      });
    }
  }

  isOptionEntry(category: string) {
    return /beer|shot|shots/i.test(category);
  }

  getPurchasesByDate(ionDate) {
    this.historyDate = ionDate.detail.value;
    this.loadData();
  }
}
