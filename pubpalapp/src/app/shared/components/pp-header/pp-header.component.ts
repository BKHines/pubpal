import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/providers/cart.service';
import { UserService } from 'src/app/providers/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pp-header',
  templateUrl: './pp-header.component.html',
  styleUrls: ['./pp-header.component.scss'],
})
export class PpHeaderComponent implements OnInit {
  @Input() message: string;
  @Input() showcart: boolean;

  cartCount: number;

  constructor(
    public userSvc: UserService,
    public cartSvc: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.userSvc.user) {
      this.loadCart();
    } else {
      let _userLoaded$ = this.userSvc.userLoaded.subscribe(() => {
        this.loadCart();
        _userLoaded$.unsubscribe();
      });
    }
  }

  loadCart() {
    this.cartSvc.cartLoaded.subscribe(() => {
      if (this.cartSvc.cart) {
        this.cartCount = this.cartSvc.cart.purchases.length;
      } else {
        this.cartCount = 0;
      }
    });

    this.cartSvc.loadCart(this.userSvc.user._id);
  }

  goToCart() {
    this.router.navigateByUrl('user/cart');
  }
}
