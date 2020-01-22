import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { SellerModel, SellerTagModel } from 'src/app/shared/models';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/providers/common.service';

@Component({
  selector: 'app-availablesellers',
  templateUrl: './availablesellers.page.html',
  styleUrls: ['./availablesellers.page.scss'],
})
export class AvailablesellersPage implements OnInit {
  sellers: SellerModel[];
  showTagAdd: boolean;
  newtag: string;
  tagmax: number;

  constructor(
    public userSvc: UserService,
    private purchSvc: PurchaseService,
    private router: Router,
    private commonSvc: CommonService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.tagmax = 10;
    if (this.userSvc.user) {
      this.loadData();
    } else {
      let userLoaded$ = this.userSvc.userLoaded.subscribe(() => {
        this.loadData();
        userLoaded$.unsubscribe();
      });
    }
  }

  loadData() {
    this.commonSvc.headerMessage = 'Available Sellers';
    this.commonSvc.menuoptionsType = 'user';
    this.userSvc.getSellersNearMe(39.344, -84.537, 10).subscribe((res) => {
      this.sellers = res.result;
    });
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

      _seller.tags.push({ tag: t, userid: this.userSvc.user._id });
      this.showTagAdd = false;
      this.newtag = '';
    });
  }

  removeTag(t: SellerTagModel, sellerId: string) {
    this.userSvc.removeTag(sellerId, t).subscribe((res) => {
      let _seller = this.sellers.find(a => a._id === sellerId);
      _seller.tags.splice(_seller.tags.findIndex(a => a.tag === t.tag && a.userid === t.userid), 1);
    });
  }
}
