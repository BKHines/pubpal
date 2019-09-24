import { Component, OnInit, EventEmitter } from '@angular/core';
import { PubpalcryptoService } from 'src/app/providers/pubpalcrypto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetpasswordService } from 'src/app/providers/resetpassword.service';
import { LoadingService } from 'src/app/providers/loading.service';
import { ChangePasswordResetRequest } from 'src/app/shared/models';

@Component({
  selector: 'app-resetpasswordupdate',
  templateUrl: './resetpasswordupdate.component.html',
  styleUrls: ['./resetpasswordupdate.component.scss']
})
export class ResetpasswordupdateComponent implements OnInit {
  resetid: string;
  email: string;
  newpassword: string;
  confirmpassword: string;
  ip: string;
  passwordUpdateFailed: boolean;

  ipLoaded: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private resetPWSvc: ResetpasswordService,
    private ppCrypto: PubpalcryptoService,
    private activeRoute: ActivatedRoute,
    private route: Router,
    private loadingSvc: LoadingService
  ) { }

  ngOnInit() {
    this.resetid = this.activeRoute.snapshot.params['id'];
    this.email = this.activeRoute.snapshot.params['email'];
    this.ppCrypto.getIp().subscribe((res) => {
      this.ip = res.result as string;
    });
  }

  changePasswordHandler() {
    if (!this.ip) {
      let _ip$ = this.ipLoaded.subscribe(() => {
        _ip$.unsubscribe();
        this.changePassword();
      });
    } else {
      this.changePassword();
    }
  }

  changePassword() {
    this.loadingSvc.addMessage('UpdatePassword', 'Updating Password...');
    let _cprr: ChangePasswordResetRequest = {
      resetid: this.resetid,
      email: this.email,
      newpassword : this.newpassword,
      confirmpassword: this.confirmpassword,
      ip: this.ip
    };
    this.resetPWSvc.updatePasswordReset(_cprr).subscribe((res) => {
      this.loadingSvc.removeMessage('UpdatedPassword');
      this.route.navigate(['login']);
    });
  }
}
