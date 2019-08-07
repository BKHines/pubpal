import { Component, OnInit } from '@angular/core';
import { UserModel, SellerModel } from 'src/app/shared/models';
import { UserService } from 'src/app/providers/user.service';
import { Router } from '@angular/router';
import { SellerService } from 'src/app/providers/seller.service';

import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registeringUser: boolean;
  localUser: UserModel;
  localSeller: SellerModel;
  password: string;
  registrationFailed: boolean;

  faCheckSquare = faCheckSquare;
  faSquare = faSquare;

  constructor(
    public userSvc: UserService,
    public sellerSvc: SellerService,
    private router: Router) { }

  ngOnInit() {
    if (this.registeringUser) {
      this.initializeUser();
    } else {
      this.initializeSeller();
    }
  }

  initializeUser() {
    if (this.userSvc.user) {
      this.localUser = Object.assign({}, this.userSvc.user);
    } else {
      this.localUser = {
        email: '',
        firstname: '',
        lastname: ''
      };
    }
  }

  initializeSeller() {
    if (this.sellerSvc.seller) {
      this.localSeller = Object.assign({}, this.sellerSvc.seller);
    } else {
      this.localSeller = {
        email: '',
        firstname: '',
        lastname: '',
        place: {
          name: '',
          description: '',
          address: {
            address: '',
            city: '',
            state: '',
            zip: '',
            latitude: 0.0,
            longitude: 0.0
          }
        }
      };
    }
  }

  addUser() {
    this.registrationFailed = false;
    this.localUser.enabled = true;
    this.localUser['password'] = this.password;

    this.userSvc.addUser(this.localUser).subscribe((res) => {
      this.localUser._id = res.result;
      this.localUser['password'] = '';
      this.userSvc.login(this.localUser.email, this.password);
      this.userSvc.loginComplete.subscribe((status) => {
        if (status) {
          this.router.navigate(['']);
        } else {
          this.registrationFailed = true;
        }
      });

      // TODO: show modal that user was successfully added
    }, (err) => {
      this.registrationFailed = true;
    });
  }

  resetUser() {
    this.localUser = null;
    this.router.navigate(['']);
  }

  addSeller() {
    this.registrationFailed = false;
    this.localSeller.enabled = true;
    this.localSeller['password'] = this.password;

    this.sellerSvc.addSeller(this.localSeller).subscribe((res) => {
      this.localSeller._id = res.result;
      this.localSeller['password'] = '';
      this.sellerSvc.login(this.localSeller.email, this.password);
      this.sellerSvc.loginComplete.subscribe((status) => {
        if (status) {
          this.router.navigate(['']);
        } else {
          this.registrationFailed = true;
        }
      });

      // TODO: show modal that user was successfully added
    }, (err) => {
      this.registrationFailed = true;
    });
  }

  resetSeller() {
    this.localSeller = null;
    this.router.navigate(['']);
  }
}
