import { Component, OnInit, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { SellerModel, SellerTagModel } from 'src/app/shared/models';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/providers/common.service';
import { Plugins, GeolocationOptions } from '@capacitor/core';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-availablesellers',
  templateUrl: './availablesellers.page.html',
  styleUrls: ['./availablesellers.page.scss'],
})
export class AvailablesellersPage implements OnInit {
  sellers: SellerModel[];
  newtag: string;
  tagmax: number;
  tagsSearch: string;

  sellersLoaded: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public userSvc: UserService,
    private purchSvc: PurchaseService,
    private router: Router,
    private commonSvc: CommonService
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.tagmax = 3;
    if (this.userSvc.user) {
      this.loadData();
    } else {
      let userLoaded$ = this.userSvc.userLoaded.subscribe(() => {
        this.loadData();
        userLoaded$.unsubscribe();
      });
    }
  }

  loadData(emitSellersLoaded?: boolean) {
    this.commonSvc.headerMessage = 'Available Pubs';
    this.commonSvc.menuoptionsType = 'user';

    const options: GeolocationOptions = {
      timeout: 7000,
    };
    Geolocation.getCurrentPosition(options).then((res) => {
      this.userSvc.getSellersNearMe(res.coords.latitude, res.coords.longitude, 10).subscribe((sellers) => {
        this.sellers = sellers.result;

        this.sellers.forEach(a => a['showTagAdd'] = false);

        if (emitSellersLoaded) {
          this.sellersLoaded.emit();
        }
      });
    });
  }

  loadDataByTagSearch() {
    const options: GeolocationOptions = {
      timeout: 7000,
    };
    Geolocation.getCurrentPosition(options).then((res) => {
      this.userSvc.getSellersByTagSearch(this.tagsSearch, res.coords.latitude, res.coords.longitude).subscribe((sellers) => {
        this.sellers = sellers.result;

        this.sellers.forEach(a => a['showTagAdd'] = false);
      });
    });
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  isSellerFavorite(sellerid: string): boolean {
    let _isSellerFavorite = false;

    if (this.userSvc.user && this.userSvc.user.favorites && this.userSvc.user.favorites.length > 0) {
      _isSellerFavorite = this.userSvc.user.favorites.filter(a => a === sellerid).length > 0;
    }

    return _isSellerFavorite;
  }

  toggleFavorite(sellerid: string) {
    if (this.isSellerFavorite(sellerid)) {
      this.removeFavorite(sellerid);
    } else {
      this.addFavorite(sellerid);
    }
  }

  openSellerDetails(seller: SellerModel) {
    this.purchSvc.sellerName = seller.place.name;
    this.router.navigate(['user/purchase/seller', seller._id]);
  }

  addFavorite(sellerid: string) {
    this.userSvc.addFavorite(this.userSvc.user._id, sellerid).subscribe((res) => {
      if (!this.userSvc.user.favorites) {
        this.userSvc.user.favorites = [];
      }

      this.userSvc.user.favorites.push(sellerid);
    });
  }

  removeFavorite(sellerid: string) {
    this.userSvc.removeFavorite(this.userSvc.user._id, sellerid).subscribe((res) => {
      this.userSvc.user.favorites.splice(this.userSvc.user.favorites.findIndex(a => a === sellerid), 1);
    });
  }

  addTag(t: string, sellerId: string) {
    this.userSvc.addTag(sellerId, { tag: t, userid: this.userSvc.user._id }).subscribe((res) => {
      let _seller = this.sellers.find(a => a._id === sellerId);
      if (!_seller.tags) {
        _seller.tags = [];
      }

      this.loadData(true);
      let sellersLoaded$ = this.sellersLoaded.subscribe(() => {
        _seller['showTagAdd'] = false;
        this.newtag = '';
        sellersLoaded$.unsubscribe();
      });
    });
  }

  removeTag(t: SellerTagModel, sellerId: string) {
    this.userSvc.removeTag(sellerId, t).subscribe((res) => {
      this.loadData();
    });
  }
}
