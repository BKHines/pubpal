import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { Purchase, APIResponse, ChangePurchaseStatusRequest, StatusText, IModalFooterButton } from 'src/app/shared/models';
import { SellerService } from 'src/app/providers/seller.service';
import { CommonService } from 'src/app/providers/common.service';
import { LoadingService } from 'src/app/providers/loading.service';
import { ModalService } from 'src/app/providers/modal.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { PurchaseService } from 'src/app/providers/purchase.service';

@Component({
  selector: 'app-purchasequeue',
  templateUrl: './purchasequeue.component.html',
  styleUrls: ['./purchasequeue.component.scss']
})
export class PurchasequeueComponent implements OnInit, AfterViewInit {
  @ViewChild('cancelTemplate', { static: true }) canceltemplate: TemplateRef<any>;
  purchases: Purchase[];
  nextStatusText: StatusText;

  itemname: string;
  customername: string;
  cancelcomments: string;

  constructor(
    private sellerSvc: SellerService,
    private common: CommonService,
    private loadingSvc: LoadingService,
    private modalSvc: ModalService,
    private purchaseSvc: PurchaseService) { }

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
      this.purchaseSvc.getPurchasesBySellerId(this.sellerSvc.seller._id).subscribe((res: APIResponse) => {
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
    this.purchaseSvc.changePurchaseStatusBySeller(this.sellerSvc.seller._id, changeStatusReq).subscribe((res: APIResponse) => {
      this.loadData();
      this.loadingSvc.removeMessage('UpdateStatus');
    });
  }

  resetCancel() {
    this.itemname = '';
    this.customername = '';
    this.cancelcomments = '';
  }

  openCancelModal(_purch: Purchase) {
    this.itemname = _purch.itemname;
    this.customername = _purch.customername;

    const _modalHeader = this.modalSvc.createHeader('Cancel Order');
    const _modalBody = this.modalSvc.createBody(this.canceltemplate, null, 'md');
    const _footerButtons: IModalFooterButton[] = [
      {
        buttonText: 'Cancel Purchase',
        buttonClass: 'btn-danger',
        buttonOperation: () => {
          this.cancelOrder(_purch._id, this.cancelcomments);
          this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASE_CANCEL);
          this.resetCancel();
        }
      }, {
        buttonText: 'Nevermind',
        buttonClass: 'btn-primary',
        buttonOperation: () => {
          this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASE_CANCEL);
          this.resetCancel();
        }
      }
    ];
    const _modalFooter = this.modalSvc.createFooter(_footerButtons);
    this.modalSvc.showModal(CONSTANTS.MODAL_PURCHASE_CANCEL, _modalBody, _modalHeader, _modalFooter);
  }

  cancelOrder(_purchaseId: string, comments: string) {
    const cancelPurchaseRequest: ChangePurchaseStatusRequest = {
      purchaseid: _purchaseId,
      status: 'cancelled',
      message: comments
    };
    this.loadingSvc.addMessage('CancelPurchase', 'Cancelling Purchase...');
    this.purchaseSvc.cancelPurchaseBySeller(this.sellerSvc.seller._id, cancelPurchaseRequest).subscribe((res: APIResponse) => {
      this.loadData();
      this.loadingSvc.removeMessage('CancelPurchase');
    });
  }
}
