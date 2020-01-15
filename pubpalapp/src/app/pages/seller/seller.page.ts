import { Component, OnInit } from '@angular/core';
import { SellerService } from 'src/app/providers/seller.service';
import { CommonService } from 'src/app/providers/common.service';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.page.html',
  styleUrls: ['./seller.page.scss'],
})
export class SellerPage implements OnInit {

  constructor(
    public sellerSvc: SellerService,
    private commonSvc: CommonService
  ) { }

  ngOnInit() {
    this.commonSvc.menuoptionsType = 'seller';
  }

  ionViewDidEnter() {
    this.commonSvc.headerMessage = `${this.sellerSvc.seller ? 'Welcome back ' + this.sellerSvc.seller.place.name + '!' : ''}`;
  }

}
