import { Component, OnInit } from '@angular/core';
import { SellerService } from 'src/app/providers/seller.service';
import { CommonService } from 'src/app/providers/common.service';
import { AlertController, ModalController } from '@ionic/angular';
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

  constructor(
    private sellerSvc: SellerService,
    private common: CommonService,
    private purchaseSvc: PurchaseService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
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
      this.purchaseSvc.getPurchasesBySellerId(this.sellerSvc.seller._id).subscribe((res) => {
        this.purchases = res.result;
        this.purchases.map(a => {
          a['nextstatustext'] = this.common.getNextStatusText(a.currentstatus);
          a['nextstatus'] = this.common.getNextStatus(a.currentstatus);
        });

        this.inactivepurchases = this.purchases.filter(a => a.currentstatus === 'cancelled' || a.currentstatus === 'pickedup');
      });
    }
  }

}
