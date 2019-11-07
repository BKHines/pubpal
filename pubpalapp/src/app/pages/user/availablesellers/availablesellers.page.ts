import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { SellerModel } from 'src/app/shared/models';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-availablesellers',
  templateUrl: './availablesellers.page.html',
  styleUrls: ['./availablesellers.page.scss'],
})
export class AvailablesellersPage implements OnInit, AfterViewInit {
  sellers: SellerModel[];

  constructor(
    private userSvc: UserService,
    private purchSvc: PurchaseService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.userSvc.user) {
      this.loadData();
    } else {
      let userLoaded$ = this.userSvc.userLoaded.subscribe(() => {
        this.loadData();
        userLoaded$.unsubscribe();
      });
    }
  }

  ngAfterViewInit() {

  }

  loadData() {
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
}
