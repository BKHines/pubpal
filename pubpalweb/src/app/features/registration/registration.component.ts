import { Component, OnInit } from '@angular/core';
import { UserModel, SellerModel } from 'src/app/shared/models';
import { UserService } from 'src/app/providers/user.service';
import { Router } from '@angular/router';
import { SellerService } from 'src/app/providers/seller.service';

import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import { CONSTANTS } from 'src/app/shared/constants';

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

  faSeller = faCheckSquare;
  faUser = faSquare;

  states: string[];

  constructor(
    public userSvc: UserService,
    public sellerSvc: SellerService,
    private router: Router) { }

  ngOnInit() {
    this.states = CONSTANTS.states;
    if (this.registeringUser) {
      this.initializeUser();
    } else {
      this.initializeSeller();
    }
  }

  initializeUser() {
    this.registeringUser = true;
    this.faUser = faCheckSquare;
    this.faSeller = faSquare;
    if (this.userSvc.user) {
      this.localUser = Object.assign({}, this.userSvc.user);
    } else {
      this.localUser = {
        email: '',
        firstname: '',
        lastname: '',
        waivedfeetokens: 0,
        feediscount: 1
      };
    }
  }

  initializeSeller() {
    this.registeringUser = false;
    this.faUser = faSquare;
    this.faSeller = faCheckSquare;
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
          },
          location: {
            type: 'Point',
            coordinates: [0, 0]
          }
        }
      };
    }
  }

  addHandler() {
    if (this.registeringUser) {
      this.addUser();
    } else {
      this.addSeller();
    }
  }

  resetHandler() {
    this.resetUser();
    this.resetSeller();
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
