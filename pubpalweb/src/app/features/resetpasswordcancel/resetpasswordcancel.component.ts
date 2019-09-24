import { Component, OnInit } from '@angular/core';
import { ResetpasswordService } from 'src/app/providers/resetpassword.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/providers/loading.service';
import { PubpalcryptoService } from 'src/app/providers/pubpalcrypto.service';
import { APIResponse } from 'src/app/shared/models';

@Component({
  selector: 'app-resetpasswordcancel',
  templateUrl: './resetpasswordcancel.component.html',
  styleUrls: ['./resetpasswordcancel.component.scss']
})
export class ResetpasswordcancelComponent implements OnInit {
  resetid: string;
  cancelling: boolean;
  cancelSuccess: boolean;
  cancelFailure: boolean;

  constructor(
    private pwResetSvc: ResetpasswordService,
    private activeRoute: ActivatedRoute,
    private loadingSvc: LoadingService,
    private pubpalCryptoSvc: PubpalcryptoService
  ) { }

  ngOnInit() {
    this.resetid = this.activeRoute.snapshot.params['id'];

    this.cancelling = true;
    this.loadingSvc.addMessage('CancelReset', 'Cancelling Password Reset...');
    this.pubpalCryptoSvc.getIp().subscribe((ipres: APIResponse) => {
      this.pwResetSvc.cancelPasswordReset(this.resetid, ipres.result as string).subscribe((res) => {
        this.loadingSvc.removeMessage('CancelReset');
        this.cancelSuccess = true;
        this.cancelling = false;
      }, (err) => {
        this.loadingSvc.removeMessage('CancelReset');
        this.cancelFailure = true;
        this.cancelling = false;
      });
    });
  }

}
