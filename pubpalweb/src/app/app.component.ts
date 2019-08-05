import { Component, OnInit } from '@angular/core';
import { LocalstoreService } from './providers/localstore.service';
import { CONSTANTS } from './shared/constants';
import { UserService } from './providers/user.service';
import { PubpalcryptoService } from './providers/pubpalcrypto.service';
import { APIResponse } from './shared/models';
import { ModalService } from './providers/modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal/public_api';
import { LoginComponent } from './features/login/login.component';

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

  showLogin() {
    const _modHeader = this.modalSvc.createHeader('Login', () => { alert('You Closed'); });
    const _modBody = this.modalSvc.createBody(LoginComponent, null, 'lg');
    // const _modFooter = this.modalSvc.createFooter([
    //   { buttonText: 'Add Procedure', buttonOperation: () => { alert('You Added'); } }
    // ]);
    this.bsModalRef = this.modalSvc.showModal(_modBody, _modHeader);
  }
}
