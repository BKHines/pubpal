import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SellerModel, APIResponse, PurchasableItemModel } from 'src/app/shared/models';
import { UserService } from 'src/app/providers/user.service';
import { ModalService } from 'src/app/providers/modal.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { PurchaseentryComponent } from '../purchaseentry/purchaseentry.component';
import { LoadingService } from 'src/app/providers/loading.service';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar, fas } from '@fortawesome/free-solid-svg-icons';

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
    if (this.isSellerFavorite(this._selectedSellerId)) {
      this.faFavorite = fasStar;
    } else {
      this.faFavorite = farStar;
    }
    this.getSellerOptions();
  }

  faFavorite = farStar;

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

  isSellerFavorite(sellerid: string): boolean {
    let _isSellerFavorite = false;

    if (this.userSvc.user.favorites && this.userSvc.user.favorites.length > 0) {
      _isSellerFavorite = this.userSvc.user.favorites.filter(a => a === sellerid).length > 0;
    }

    return _isSellerFavorite;
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

  toggleFavorite() {
    if (this.isSellerFavorite(this.selectedSellerId)) {
      this.removeFavorite();
    } else {
      this.addFavorite();
    }
  }

  addFavorite() {
    this.userSvc.addFavorite(this.userSvc.user._id, this.selectedSellerId).subscribe((res: APIResponse) => {
      this.faFavorite = fasStar;
      if (!this.userSvc.user.favorites) {
        this.userSvc.user.favorites = [];
      }

      this.userSvc.user.favorites.push(this.selectedSellerId);
    });
  }

  removeFavorite() {
    this.userSvc.removeFavorite(this.userSvc.user._id, this.selectedSellerId).subscribe((res: APIResponse) => {
      this.faFavorite = farStar;

      this.userSvc.user.favorites.splice(this.userSvc.user.favorites.findIndex(a => a === this.selectedSellerId), 1);
    });
  }
}
