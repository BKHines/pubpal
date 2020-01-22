import { Component, OnInit } from '@angular/core';
import { SellerModel } from 'src/app/shared/models';
import { Router } from '@angular/router';
import { SellerService } from 'src/app/providers/seller.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { CommonService } from 'src/app/providers/common.service';

@Component({
  selector: 'app-sellerregistration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  registeringUser: boolean;
  localSeller: SellerModel;
  password: string;
  registrationFailed: boolean;

  states: string[];

  constructor(
    public sellerSvc: SellerService,
    private router: Router,
    private commonSvc: CommonService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.states = CONSTANTS.states;
    this.registeringUser = false;

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

    this.commonSvc.headerMessage = 'Register New Seller';
    this.commonSvc.menuoptionsType = 'seller';
  }

  register() {
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

  reset() {
    this.localSeller = null;
    this.router.navigate(['']);
  }
}
