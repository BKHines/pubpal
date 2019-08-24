import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SellerService } from '../providers/seller.service';
import { LocalstoreService } from '../providers/localstore.service';
import { CONSTANTS } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthsellerGuard implements CanActivate {
  constructor(private sellerSvc: SellerService, private localStoreSvc: LocalstoreService, private router: Router) { }

  canActivate(): boolean {
    let userType = this.localStoreSvc.get(CONSTANTS.KEY_STORE_USERTYPE);
    if (!this.sellerSvc.seller && !this.localStoreSvc.get(CONSTANTS.KEY_STORE_USEREMAIL) && (!userType || userType !== 'seller')) {
      this.router.navigate(['']);
      return false;
    } else {
      return true;
    }
  }
}
