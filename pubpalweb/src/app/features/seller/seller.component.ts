import { Component, OnInit } from '@angular/core';
import { SellerModel } from 'src/app/shared/models';
import { SellerService } from 'src/app/providers/seller.service';
import { Router } from '@angular/router';
import { CONSTANTS } from 'src/app/shared/constants';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss']
})
export class SellerComponent implements OnInit {
  localSeller: SellerModel;
  password: string;

  states: string[];

  constructor(public sellerSvc: SellerService, private router: Router) { }

  ngOnInit() {
    this.states = CONSTANTS.states;
    this.loadData();
    this.sellerSvc.sellerLoaded.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    if (this.sellerSvc.seller) {
      this.localSeller = Object.assign({}, this.sellerSvc.seller);
    } else {
      this.localSeller = null;
    }
  }

  updateSeller() {
    this.sellerSvc.updateSeller(this.localSeller).subscribe((res) => {
      // TODO: show modal that user was successfully updated
      this.sellerSvc.seller = Object.assign({}, this.localSeller);
      this.router.navigate(['']);
    });
  }

  restoreSeller() {
    this.localSeller = Object.assign({}, this.sellerSvc.seller);
    this.router.navigate(['']);
  }
}
