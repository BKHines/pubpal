import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalstoreService } from './providers/localstore.service';
import { CONSTANTS } from './shared/constants';
import { TokenService } from './providers/token.service';
import { SellerService } from './providers/seller.service';
import { UserService } from './providers/user.service';
import { Router } from '@angular/router';
import { PurchaseService } from './providers/purchase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  localStorageChecked: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private localStoreSvc: LocalstoreService,
    private tokenSvc: TokenService,
    private sellerSvc: SellerService,
    private userSvc: UserService,
    private router: Router,
    private purchaseSvc: PurchaseService,
    private toastCtrl: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
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
}
