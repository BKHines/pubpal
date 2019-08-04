import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../providers/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public userSvc: UserService, private router: Router) { }

  canActivate(): boolean {
    if (!this.userSvc.authToken) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
}
