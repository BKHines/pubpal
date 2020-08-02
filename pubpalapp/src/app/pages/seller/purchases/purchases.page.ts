import { Component, OnInit } from '@angular/core';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { Purchase, ChangePurchaseStatusRequest } from 'src/app/shared/models';
import { SellerService } from 'src/app/providers/seller.service';
import { CommonService } from 'src/app/providers/common.service';
import { ModalController, AlertController } from '@ionic/angular';
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

        this.activepurchases = this.purchases.filter(a => a.currentstatus !== 'cancelled' && a.currentstatus !== 'pickedup');
      });
    }
  }

  updateToNextStatus(_purchase: Purchase) {
    let _itemname = /beer|shot|shots/i.test(_purchase.category) ? _purchase.ingredients[0] : _purchase.itemname;
    let _nextStatus = this.common.getNextStatusText(_purchase.currentstatus);
    this.alertCtrl.create({
      header: 'Update Order Status?',
      message: `Are you sure you want to update the status of the order of ${_itemname} for ${_purchase.customername} to ${_nextStatus}?`,
      buttons: [
        {
          text: 'Nevermind',
          role: 'cancel'
        },
        {
          text: 'Yep',
          handler: () => {
            const changeStatusReq: ChangePurchaseStatusRequest = {
              status: _purchase['nextstatus'],
              purchaseid: _purchase._id
            };
            this.purchaseSvc.changePurchaseStatusBySeller(this.sellerSvc.seller._id, changeStatusReq).subscribe((res) => {
              this.loadData();
            });
          }
        }
      ]
    }).then((da) => {
      da.present();
    });
  }

  isOption(category: string) {
    return /beer|shot|shots/i.test(category);
  }

  async openCancelModal(purchase: Purchase) {
    const modal = await this.modalCtrl.create({
      component: CancelorderPage,
      componentProps: {
        purchaseId: purchase._id,
        customername: purchase.customername,
        itemname: /beer|shot|shots/i.test(purchase.category) ? purchase.ingredients[0] : purchase.itemname,
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
