import { Component, OnInit } from '@angular/core';

import { Platform, ToastController, MenuController } from '@ionic/angular';
import { LocalstoreService } from './providers/localstore.service';
import { CONSTANTS } from './shared/constants';
import { TokenService } from './providers/token.service';
import { SellerService } from './providers/seller.service';
import { UserService } from './providers/user.service';
import { Router } from '@angular/router';
import { PurchaseService } from './providers/purchase.service';

import { Plugins, StatusBarStyle } from '@capacitor/core';
import { CommonService } from './providers/common.service';
import { CartService } from './providers/cart.service';
const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  localStorageChecked: boolean;
  cartCount: number;

  constructor(
    private platform: Platform,
    private localStoreSvc: LocalstoreService,
    private tokenSvc: TokenService,
    public sellerSvc: SellerService,
    public userSvc: UserService,
    private router: Router,
    private purchaseSvc: PurchaseService,
    private toastCtrl: ToastController,
    public commonSvc: CommonService,
    public cartSvc: CartService,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  ngOnInit() {

  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        StatusBar.setStyle({
          style: StatusBarStyle.Dark
        });
        SplashScreen.hide();
      }
      this.setLocalUserIfAny();

      let userLoaded$ = this.userSvc.userLoaded.subscribe(() => {
        this.purchaseSvc.getPurchasesByUserId(this.userSvc.user._id).subscribe((res) => {
          if (res && res.result && res.result.length > 0) {
            this.purchaseSvc.startPolling();
          }
        });
        userLoaded$.unsubscribe();
      });
      this.purchaseSvc.purchaseStatusChanged.subscribe((msg) => {
        this.toastCtrl.getTop().then((res) => {
          if (res) {
            res.dismiss();
          }
          this.showPurchaseStatusChanged(msg);
        });
      });
    });
  }

  async showPurchaseStatusChanged(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: 'View',
          handler: () => {
            this.router.navigate(['user/purchasehistory']);
          }
        }, {
          side: 'end',
          text: 'Close',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  setLocalUserIfAny() {
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
              this.router.navigate(['seller']);
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
              this.router.navigate(['user']);
              // this.cartSvc.loadCart(this.userSvc.user._id);
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

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  goHome() {
    this.menuCtrl.close();
    if (this.commonSvc.menuoptionsType === 'user') {
      this.router.navigate(['user']);
    } else {
      this.router.navigate(['seller']);
    }
  }

  makePurchase() {
    this.menuCtrl.close();
    this.router.navigateByUrl('user/purchase/sellers');
  }

  goToPurchaseHistory() {
    this.menuCtrl.close();
    this.router.navigateByUrl('user/purchasehistory');
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

  goSellerMenuItems() {
    this.menuCtrl.close();
    this.router.navigateByUrl('seller/items');
  }

  logout() {
    this.menuCtrl.close();
    if (this.commonSvc.menuoptionsType === 'user') {
      this.userSvc.logout();
    } else {
      this.sellerSvc.logout();
    }
    this.localStoreSvc.removeMultiple([CONSTANTS.KEY_STORE_KEY, CONSTANTS.KEY_STORE_USEREMAIL, CONSTANTS.KEY_STORE_USERTYPE]);
    this.router.navigate(['']);
  }

}
