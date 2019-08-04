import { Component, OnInit } from '@angular/core';
import { LocalstoreService } from './providers/localstore.service';
import { CONSTANTS } from './shared/constants';
import { UserService } from './providers/user.service';
import { PubpalcryptoService } from './providers/pubpalcrypto.service';
import { APIResponse } from './shared/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'PubPal';
  localStorageChecked: boolean;

  constructor(
    private localStoreSvc: LocalstoreService,
    private userSvc: UserService,
    private pubpalCryptoSvc: PubpalcryptoService) { }

  ngOnInit() {
    const storedKey = this.localStoreSvc.get(CONSTANTS.KEY_STORE_KEY);
    const storedEmail = this.localStoreSvc.get(CONSTANTS.KEY_STORE_USEREMAIL);

    if (storedKey) {
      this.pubpalCryptoSvc.getIp().subscribe((ipres: APIResponse) => {
        this.userSvc.authToken = this.pubpalCryptoSvc.generateToken(storedEmail, storedKey, ipres.result);

        this.userSvc.getUserByEmail(storedEmail).subscribe((userres) => {
          this.userSvc.user = userres.result;
          this.localStorageChecked = true;
        }, (err) => {
          this.userSvc.logout();
          this.localStoreSvc.removeMultiple([CONSTANTS.KEY_STORE_KEY, CONSTANTS.KEY_STORE_USEREMAIL]);
          this.localStorageChecked = true;
        });
      });
    } else {
      this.localStorageChecked = true;
    }
  }
}
