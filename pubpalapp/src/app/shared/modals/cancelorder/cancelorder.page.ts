import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { SellerService } from 'src/app/providers/seller.service';
import { ChangePurchaseStatusRequest } from '../../models';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cancelorder',
  templateUrl: './cancelorder.page.html',
  styleUrls: ['./cancelorder.page.scss'],
})
export class CancelorderPage implements OnInit {
  @Input() purchaseId: string;
  @Input() customername: string;
  @Input() itemname: string;
  @Input() price: DecimalPipe;
  @Input() currentstatus: string;

  comments: string;

  constructor(
    private modalCtrl: ModalController,
    private purchaseSvc: PurchaseService,
    private sellerSvc: SellerService
  ) { }

  ngOnInit() {
  }

  cancelOrder() {
    const cancelPurchaseRequest: ChangePurchaseStatusRequest = {
      purchaseid: this.purchaseId,
      status: 'cancelled',
      message: this.comments
    };
    this.purchaseSvc.cancelPurchaseBySeller(this.sellerSvc.seller._id, cancelPurchaseRequest).subscribe((res) => {
      this.modalCtrl.dismiss({
        dismissed: true
      });
    });
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
}
