import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalstoreService } from './providers/localstore.service';
import { CONSTANTS } from './shared/constants';
import { TokenService } from './providers/token.service';
import { SellerService } from './providers/seller.service';
import { UserService } from './providers/user.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.setLocalUserIfAny();
    });
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
