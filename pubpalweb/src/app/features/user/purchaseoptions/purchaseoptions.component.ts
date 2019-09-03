import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SellerModel, APIResponse, PurchasableItemModel } from 'src/app/shared/models';
import { UserService } from 'src/app/providers/user.service';
import { ModalService } from 'src/app/providers/modal.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { PurchaseentryComponent } from '../purchaseentry/purchaseentry.component';
import { LoadingService } from 'src/app/providers/loading.service';
import { PurchaseService } from 'src/app/providers/purchase.service';

@Component({
  selector: 'app-purchaseoptions',
  templateUrl: './purchaseoptions.component.html',
  styleUrls: ['./purchaseoptions.component.scss']
})
export class PurchaseoptionsComponent implements OnInit, AfterViewInit {
  sellers: SellerModel[];
  private _selectedSellerId: string;
  get selectedSellerId(): string {
    return this._selectedSellerId;
  }
  set selectedSellerId(value: string) {
    this._selectedSellerId = value;
    this.getSellerOptions();
  }

  purchaseOptions: PurchasableItemModel[];

  constructor(
    private userSvc: UserService,
    private modalSvc: ModalService,
    private loadingSvc: LoadingService,
    private purchaseSvc: PurchaseService) { }

  ngOnInit() {
    if (this.userSvc.user) {
      this.loadData();
    }
  }

  ngAfterViewInit() {
    this.userSvc.userLoaded.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    this.userSvc.getSellersNearMe(39.344, -84.537, 10).subscribe((res: APIResponse) => {
      this.sellers = res.result;
    });
  }

  openPurchaseModal(optionId: string) {
    const _modHeader = this.modalSvc.createHeader('Make Purchase', () => { this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASE); });
    const _modBody = this.modalSvc.createBody(PurchaseentryComponent, { optionId, sellerId: this.selectedSellerId }, 'xl');
    this.modalSvc.showModal(CONSTANTS.MODAL_PURCHASE, _modBody, _modHeader, null, true, false, 'modal-no-padding-body');
  }

  getSellerOptions() {
    this.loadingSvc.addMessage('GetOptions', 'Getting Menu...');
    this.purchaseSvc.getSellerOptionsById(this.selectedSellerId).subscribe((res: APIResponse) => {
      this.purchaseOptions = res.result;
      this.loadingSvc.removeMessage('GetOptions');
    });
  }
}
