import { Component, OnInit } from '@angular/core';
import { LocalstoreService } from './providers/localstore.service';
import { CONSTANTS } from './shared/constants';
import { UserService } from './providers/user.service';
import { APIResponse } from './shared/models';
import { ModalService } from './providers/modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal/public_api';
import { LoginComponent } from './features/login/login.component';
import { TokenService } from './providers/token.service';
import { SellerService } from './providers/seller.service';
import { CartService } from './providers/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'PubPal';
  localStorageChecked: boolean;

  bsModalRef: BsModalRef;

  constructor(
    private localStoreSvc: LocalstoreService,
    private modalSvc: ModalService,
    private userSvc: UserService,
    private sellerSvc: SellerService,
    private tokenSvc: TokenService,
    private cartSvc: CartService) { }

  ngOnInit() {
    const storedKey = this.localStoreSvc.get(CONSTANTS.KEY_STORE_KEY);
    const storedEmail = this.localStoreSvc.get(CONSTANTS.KEY_STORE_USEREMAIL);
    const storedType = this.localStoreSvc.get(CONSTANTS.KEY_STORE_USERTYPE);

    if (storedKey) {
      this.tokenSvc.getIp().subscribe((ipres) => {
        this.tokenSvc.authToken = this.tokenSvc.generateToken(storedEmail, storedKey, ipres.result);

        switch (storedType) {
          case 'seller':
              this.sellerSvc.getSellerByEmail(storedEmail).subscribe((sellerres) => {
                this.sellerSvc.seller = sellerres.result;
                this.localStorageChecked = true;
              }, (err) => {
                this.sellerSvc.logout();
                this.localStoreSvc.removeMultiple([CONSTANTS.KEY_STORE_KEY, CONSTANTS.KEY_STORE_USEREMAIL, CONSTANTS.KEY_STORE_USERTYPE]);
                this.localStorageChecked = true;
              });
              break;
          default:
            this.userSvc.getUserByEmail(storedEmail).subscribe((userres) => {
              this.userSvc.user = userres.result;
              this.localStorageChecked = true;
              this.cartSvc.loadCart(this.userSvc.user._id);
            }, (err) => {
              this.userSvc.logout();
              this.localStoreSvc.removeMultiple([CONSTANTS.KEY_STORE_KEY, CONSTANTS.KEY_STORE_USEREMAIL, CONSTANTS.KEY_STORE_USERTYPE]);
              this.localStorageChecked = true;
            });
            break;
          }
        });
    } else {
      this.localStorageChecked = true;
    }
  }

  showLogin() {
    const _modHeader = this.modalSvc.createHeader('Login', () => { this.modalSvc.hideModal(CONSTANTS.MODAL_LOGIN); });
    const _modBody = this.modalSvc.createBody(LoginComponent, null, 'lg');
    this.bsModalRef = this.modalSvc.showModal(CONSTANTS.MODAL_LOGIN, _modBody, _modHeader);
  }
}
