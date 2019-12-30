import { Component, OnInit, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UserService } from 'src/app/providers/user.service';
import { LocalstoreService } from 'src/app/providers/localstore.service';
import { Router } from '@angular/router';
import { CONSTANTS } from '../../constants';
import { SellerService } from 'src/app/providers/seller.service';
import { CartService } from 'src/app/providers/cart.service';

@Component({
  selector: 'app-pp-menuoptions',
  templateUrl: './pp-menuoptions.component.html',
  styleUrls: ['./pp-menuoptions.component.scss'],
})
export class PpMenuoptionsComponent implements OnInit {
  @Input() usertype: 'user' | 'seller';

  cartCount: number;

  constructor(
    private menuCtrl: MenuController,
    private userSvc: UserService,
    private sellerSvc: SellerService,
    private cartSvc: CartService,
    private localStoreSvc: LocalstoreService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.userSvc.user) {
      this.loadCart();
    } else {
      let _userLoaded$ = this.userSvc.userLoaded.subscribe(() => {
        this.loadCart();
        _userLoaded$.unsubscribe();
      });
    }
  }

  goHome() {
    this.menuCtrl.close();
    if (this.usertype === 'user') {
      this.router.navigate(['user']);
    } else {
      this.router.navigate(['seller']);
    }
  }

  loadCart() {
    this.cartSvc.loadCart(this.userSvc.user._id);
  }

  goToCart() {
    this.menuCtrl.close();
    this.router.navigateByUrl('user/cart');
  }

  goSellerPurchases() {
    this.menuCtrl.close();
    this.router.navigateByUrl('seller/purchases');
  }

  logout() {
    this.menuCtrl.close();
    if (this.usertype === 'user') {
      this.userSvc.logout();
    } else {
      this.sellerSvc.logout();
    }
    this.localStoreSvc.removeMultiple([CONSTANTS.KEY_STORE_KEY, CONSTANTS.KEY_STORE_USEREMAIL, CONSTANTS.KEY_STORE_USERTYPE]);
    this.router.navigate(['']);
  }
}
