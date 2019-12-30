import { Component, OnInit } from '@angular/core';
import { SellerService } from 'src/app/providers/seller.service';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.page.html',
  styleUrls: ['./seller.page.scss'],
})
export class SellerPage implements OnInit {

  constructor(
    public sellerSvc: SellerService
  ) { }

  ngOnInit() {
  }

}
