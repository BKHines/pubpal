import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faBeer, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/providers/user.service';
import { LocalstoreService } from 'src/app/providers/localstore.service';
import { CONSTANTS } from '../constants';
import { Router } from '@angular/router';
import { SellerService } from 'src/app/providers/seller.service';
import { TokenService } from 'src/app/providers/token.service';
import { ModalService } from 'src/app/providers/modal.service';
import { CartService } from 'src/app/providers/cart.service';
import { Cart } from '../models';
import { CartviewerComponent } from 'src/app/features/user/cartviewer/cartviewer.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  faBeer = faBeer;
  faShoppingCart = faShoppingCart;

  cart: Cart;

  @Input() showuserlinks: boolean;

  @Output() loginClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public userSvc: UserService,
    public sellerSvc: SellerService,
    public tokenSvc: TokenService,
    private localStoreSvc: LocalstoreService,
    private modalSvc: ModalService,
    public cartSvc: CartService,
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

  openCartViewer() {
    const _modHeader = this.modalSvc.createHeader('Cart', () => { this.modalSvc.hideModal(CONSTANTS.MODAL_CART_VIEWER); });
    const _modBody = this.modalSvc.createBody(CartviewerComponent, null, 'lg');
    this.modalSvc.showModal(CONSTANTS.MODAL_CART_VIEWER, _modBody, _modHeader);
  }
}
