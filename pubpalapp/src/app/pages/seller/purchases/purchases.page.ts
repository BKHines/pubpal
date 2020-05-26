import { Component, OnInit } from '@angular/core';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { Purchase, ChangePurchaseStatusRequest } from 'src/app/shared/models';
import { SellerService } from 'src/app/providers/seller.service';
import { CommonService } from 'src/app/providers/common.service';
import { ModalController } from '@ionic/angular';
import { CancelorderPage } from 'src/app/shared/modals/cancelorder/cancelorder.page';

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
    private purchaseSvc: PurchaseService,
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

  async openCancelModal(purchase: Purchase) {
    const modal = await this.modalCtrl.create({
      component: CancelorderPage,
      componentProps: {
        purchaseId: purchase._id,
        customername: purchase.customername,
        itemname: purchase.category && purchase.category.toLowerCase() === 'beer' ? purchase.ingredients[0] : purchase.itemname,
        price: purchase.price,
        currentstatus: purchase.currentstatus
      }
    });
    modal.onDidDismiss().then(() => {
      this.loadData();
    });
    return await modal.present();
  }
}
