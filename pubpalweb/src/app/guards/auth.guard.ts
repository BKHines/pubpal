import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../providers/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private tokenSvc: TokenService, private router: Router) { }

  canActivate(): boolean {
    if (!this.tokenSvc.authToken) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
}
