import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faBeer } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/providers/user.service';
import { LocalstoreService } from 'src/app/providers/localstore.service';
import { CONSTANTS } from '../constants';
import { Router } from '@angular/router';
import { SellerService } from 'src/app/providers/seller.service';
import { TokenService } from 'src/app/providers/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  faBeer = faBeer;
  @Input() showuserlinks: boolean;

  @Output() loginClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public userSvc: UserService,
    public sellerSvc: SellerService,
    public tokenSvc: TokenService,
    private localStoreSvc: LocalstoreService,
    private router: Router) { }

  ngOnInit() {
  }

  loginClick() {
    this.loginClicked.emit();
  }

  logout() {
    if (this.userSvc.user) {
      this.userSvc.logout();
    } else if (this.sellerSvc.seller) {
      this.sellerSvc.logout();
    }
    this.localStoreSvc.removeMultiple([CONSTANTS.KEY_STORE_KEY, CONSTANTS.KEY_STORE_USEREMAIL, CONSTANTS.KEY_STORE_USERTYPE]);
    this.router.navigate(['']);
  }
}
