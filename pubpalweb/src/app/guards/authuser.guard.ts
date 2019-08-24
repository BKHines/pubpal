import { Injectable } from '@angular/core';
import { UserService } from '../providers/user.service';
import { LocalstoreService } from '../providers/localstore.service';
import { Router, CanActivate } from '@angular/router';
import { CONSTANTS } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthuserGuard implements CanActivate {
  constructor(private userSvc: UserService, private localStoreSvc: LocalstoreService, private router: Router) { }

  canActivate(): boolean {
    let userType = this.localStoreSvc.get(CONSTANTS.KEY_STORE_USERTYPE);
    if (!this.userSvc.user && !this.localStoreSvc.get(CONSTANTS.KEY_STORE_USEREMAIL) && (!userType || userType !== 'user')) {
      this.router.navigate(['']);
      return false;
    } else {
      return true;
    }
  }
}
