import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SellerModel, APIResponse, PurchasableItemModel, SellerTagModel } from 'src/app/shared/models';
import { UserService } from 'src/app/providers/user.service';
import { ModalService } from 'src/app/providers/modal.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { PurchaseentryComponent } from '../purchaseentry/purchaseentry.component';
import { LoadingService } from 'src/app/providers/loading.service';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';

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
    if (value) {
      this.getSellerInformation();
    }
  }
  showSelect: boolean;
  tags: SellerTagModel[];

  faFavorite = farStar;
  faDeleteTag = faTimesCircle;

  purchaseOptions: PurchasableItemModel[];

  constructor(
    private userSvc: UserService,
    private modalSvc: ModalService,
    private loadingSvc: LoadingService,
    private purchaseSvc: PurchaseService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.selectedSellerId = this.route.snapshot.params['id'];
      this.showSelect = false;
    } else {
      if (this.userSvc.user) {
        this.loadData();
      }
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

  getSellerInformation() {
    this.loadingSvc.addMessage('GetInfo', 'Getting Menu...');
    this.userSvc.getSellerTags(this.userSvc.user._id, this.selectedSellerId).subscribe((tagres: APIResponse) => {
      this.tags = tagres.result ? tagres.result as SellerTagModel[] : [];

      this.purchaseSvc.getSellerOptionsById(this.selectedSellerId).subscribe((res: APIResponse) => {
        this.purchaseOptions = res.result;
        this.loadingSvc.removeMessage('GetInfo');
      });
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
    this.loadingSvc.addMessage('AddFavorite', 'Adding Favorite...');
    this.userSvc.addFavorite(this.userSvc.user._id, this.selectedSellerId).subscribe((res: APIResponse) => {
      this.faFavorite = fasStar;
      if (!this.userSvc.user.favorites) {
        this.userSvc.user.favorites = [];
      }

      this.userSvc.user.favorites.push(this.selectedSellerId);
      this.loadingSvc.removeMessage('AddFavorite');
    });
  }

  removeFavorite() {
    this.loadingSvc.addMessage('RemoveFavorite', 'Removing Favorite...');
    this.userSvc.removeFavorite(this.userSvc.user._id, this.selectedSellerId).subscribe((res: APIResponse) => {
      this.faFavorite = farStar;

      this.userSvc.user.favorites.splice(this.userSvc.user.favorites.findIndex(a => a === this.selectedSellerId), 1);
      this.loadingSvc.removeMessage('RemoveFavorite');
    });
  }

  addTag(tagText: string) {
    this.loadingSvc.addMessage('AddTag', 'Adding Tag...');
    const _newTag: SellerTagModel = { tag: tagText, userid: this.userSvc.user._id };
    this.userSvc.addTag(this.selectedSellerId, _newTag).subscribe((res: APIResponse) => {
      this.getSellerInformation();
      this.loadingSvc.removeMessage('AddTag');
    });
  }

  removeTag(tag: SellerTagModel) {
    this.loadingSvc.addMessage('RemoveTag', 'Removing Tag...');
    this.userSvc.removeTag(this.selectedSellerId, tag).subscribe((res: APIResponse) => {
      this.getSellerInformation();
      this.loadingSvc.removeMessage('RemoveTag');
    });
  }
}
