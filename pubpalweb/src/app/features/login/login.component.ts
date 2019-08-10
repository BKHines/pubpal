import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
// import { Router } from '@angular/router';
import { ModalService } from 'src/app/providers/modal.service';
import { LoadingService } from 'src/app/providers/loading.service';
import { SellerService } from 'src/app/providers/seller.service';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  loginFailed: boolean;
  private _userType: 'user' | 'seller';
  set userType(value: 'user' | 'seller') {
    this._userType = value;
    this.faUser = this.userType === 'user' ? faCheckSquare :  faSquare;
    this.faSeller = this.userType === 'seller' ? faCheckSquare :  faSquare;
  }
  get userType() {
    return this._userType;
  }

  faSeller = faSquare;
  faUser = faCheckSquare;

  constructor(
    private userSvc: UserService,
    private sellerSvc: SellerService,
    // private router: Router,
    private loadingSvc: LoadingService,
    private modalSvc: ModalService
  ) { }

  ngOnInit() {
    this.userType = 'user';
  }

  resetForm() {
    this.email = '';
    this.password = '';
    // this.router.navigate(['']);
    this.modalSvc.hideModal('login');
  }

  login() {
    this.loginFailed = false;
    this.loadingSvc.addMessage('StartLogin', 'Logging in...');

    if (this.userType === 'user') {
      this.userSvc.login(this.email, this.password);
      let userlogin$ = this.userSvc.loginComplete.subscribe((status) => {
        this.loadingSvc.removeMessage('StartLogin');
        if (status) {
          // this.router.navigate(['']);
          this.modalSvc.hideModal('login');
        } else {
          this.loginFailed = true;
        }
        userlogin$.unsubscribe();
      }, (usererr) => {
        userlogin$.unsubscribe();
      });
    } else if (this.userType === 'seller') {
      this.sellerSvc.login(this.email, this.password);
      let sellerlogin$ = this.sellerSvc.loginComplete.subscribe((status) => {
        this.loadingSvc.removeMessage('StartLogin');
        if (status) {
          // this.router.navigate(['']);
          this.modalSvc.hideModal('login');
        } else {
          this.loginFailed = true;
        }
        sellerlogin$.unsubscribe();
      }, (sellererr) => {
        sellerlogin$.unsubscribe();
      });
    }
  }
}
