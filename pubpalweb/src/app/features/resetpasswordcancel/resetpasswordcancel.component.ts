import { Component, OnInit } from '@angular/core';
import { ResetpasswordService } from 'src/app/providers/resetpassword.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/providers/loading.service';
import { APIResponse } from 'src/app/shared/models';
import { TokenService } from 'src/app/providers/token.service';

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
    private tokenSvc: TokenService
  ) { }

  ngOnInit() {
    this.resetid = this.activeRoute.snapshot.params['id'];

    this.cancelling = true;
    this.loadingSvc.addMessage('CancelReset', 'Cancelling Password Reset...');
    this.tokenSvc.getIp().subscribe((ipres: APIResponse) => {
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
