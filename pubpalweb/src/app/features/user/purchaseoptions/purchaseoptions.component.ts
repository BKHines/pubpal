import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SellerModel, APIResponse, PurchasableItemModel } from 'src/app/shared/models';
import { UserService } from 'src/app/providers/user.service';
import { ModalService } from 'src/app/providers/modal.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { PurchaseentryComponent } from '../purchaseentry/purchaseentry.component';

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

  constructor(private userSvc: UserService, private modalSvc: ModalService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.userSvc.userLoaded.subscribe(() => {
      this.userSvc.getSellersNearMe(-1, -1, 1).subscribe((res: APIResponse) => {
        this.sellers = res.result;
      });
    });
  }

  openPurchaseModal(optionId: string) {
    const _modHeader = this.modalSvc.createHeader('Make Purchase', () => { this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASE); });
    const _modBody = this.modalSvc.createBody(PurchaseentryComponent, { optionId, sellerId: this.selectedSellerId }, 'xl');
    this.modalSvc.showModal(CONSTANTS.MODAL_PURCHASE, _modBody, _modHeader, null, true, false, 'modal-no-padding-body');
  }

  getSellerOptions() {
    this.userSvc.getSellerOptionsById(this.selectedSellerId).subscribe((res: APIResponse) => {
      this.purchaseOptions = res.result;
    });
  }
}
