import { Component, OnInit } from '@angular/core';
import { ResetpasswordService } from 'src/app/providers/resetpassword.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/providers/loading.service';
import { ChangePasswordResetRequest, APIResponse } from 'src/app/shared/models';
import { PubpalcryptoService } from 'src/app/providers/pubpalcrypto.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  email: string;
  resetStarted: boolean;

  constructor(
    private pwResetSvc: ResetpasswordService,
    private loadingSvc: LoadingService,
    private pubpalCryptoSvc: PubpalcryptoService
  ) { }

  ngOnInit() {

  }

  resetPassword() {
    this.loadingSvc.addMessage('ResetPassword', 'Resetting Password...');
    this.pubpalCryptoSvc.getIp().subscribe((ipres: APIResponse) => {
      this.pwResetSvc.createPasswordResetRequest(this.email, ipres.result as string).subscribe((res) => {
        this.resetStarted = true;
        this.loadingSvc.removeMessage('ResetPassword');
      });
    });
  }
}
