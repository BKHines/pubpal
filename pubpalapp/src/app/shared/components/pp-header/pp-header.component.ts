import { Component, OnInit, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UserService } from 'src/app/providers/user.service';
import { SellerService } from 'src/app/providers/seller.service';
import { CartService } from 'src/app/providers/cart.service';

@Component({
  selector: 'app-pp-header',
  templateUrl: './pp-header.component.html',
  styleUrls: ['./pp-header.component.scss'],
})
export class PpHeaderComponent implements OnInit {
  @Input() message: string;

  constructor(
    public userSvc: UserService,
    public sellerSvc: SellerService,
    public cartSvc: CartService,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }
}
