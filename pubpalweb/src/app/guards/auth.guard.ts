import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../providers/token.service';
import { LocalstoreService } from '../providers/localstore.service';
import { CONSTANTS } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private tokenSvc: TokenService, private localStoreSvc: LocalstoreService, private router: Router) { }

  canActivate(): boolean {
    if (!this.tokenSvc.authToken && !this.localStoreSvc.get(CONSTANTS.KEY_STORE_KEY)) {
      this.router.navigate(['']);
      return false;
    } else {
      return true;
    }
  }
}
