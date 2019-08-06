import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
// import { Router } from '@angular/router';
import { ModalService } from 'src/app/providers/modal.service';
import { LoadingService } from 'src/app/providers/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  loginFailed: boolean;

  constructor(
    private userSvc: UserService,
    // private router: Router,
    private loadingSvc: LoadingService,
    private modalSvc: ModalService
    ) { }

  ngOnInit() {
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
    this.userSvc.login(this.email, this.password);
    this.userSvc.loginComplete.subscribe((status) => {
      this.loadingSvc.removeMessage('StartLogin');
      if (status) {
        // this.router.navigate(['']);
        this.modalSvc.hideModal('login');
      } else {
        this.loginFailed = true;
      }
    }, (err) => {
      this.loadingSvc.removeMessage('StartLogin');
    });
  }
}
