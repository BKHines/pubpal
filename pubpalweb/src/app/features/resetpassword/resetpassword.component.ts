import { Component, OnInit } from '@angular/core';
import { ResetpasswordService } from 'src/app/providers/resetpassword.service';
import { LoadingService } from 'src/app/providers/loading.service';
import { APIResponse } from 'src/app/shared/models';
import { TokenService } from 'src/app/providers/token.service';

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
    private tokenSvc: TokenService
  ) { }

  ngOnInit() {

  }

  resetPassword() {
    this.loadingSvc.addMessage('ResetPassword', 'Resetting Password...');
    this.tokenSvc.getIp().subscribe((ipres) => {
      this.pwResetSvc.createPasswordResetRequest(this.email, ipres.result as string).subscribe((res) => {
        this.resetStarted = true;
        this.loadingSvc.removeMessage('ResetPassword');
      });
    });
  }
}
