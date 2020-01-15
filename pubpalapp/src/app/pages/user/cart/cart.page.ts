import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { CartService } from 'src/app/providers/cart.service';
import { SellerName } from 'src/app/shared/models';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/providers/common.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  constructor(
    public userSvc: UserService,
    public cartSvc: CartService,
    private router: Router,
    private commonSvc: CommonService
  ) { }

  ngOnInit() {
    if (this.userSvc.user) {
      this.loadCart();
    }

    let _userLoaded$ = this.userSvc.userLoaded.subscribe(() => {
      this.loadCart();
      _userLoaded$.unsubscribe();
    });
  }

  loadCart() {
    this.commonSvc.headerMessage = 'Your Cart';
    this.commonSvc.menuoptionsType = 'user';
    this.cartSvc.loadCart(this.userSvc.user._id);

    let _cartLoaded$ = this.cartSvc.cartLoaded.subscribe(() => {
      if (this.cartSvc.cart && this.cartSvc.cart.purchases && this.cartSvc.cart.purchases.length > 0) {
        let sellerIds = [...new Set(this.cartSvc.cart.purchases.map(a => a.sellerid))];
        this.userSvc.getSellerNamesByIds(sellerIds).subscribe((sellernameres) => {
          let _sellernames = sellernameres.result as SellerName[];
          this.cartSvc.cart.purchases.forEach((a) => {
            a['sellername'] = _sellernames.filter(b => b.sellerid === a.sellerid)[0].name;
          });
        });
      }
      _cartLoaded$.unsubscribe();
    });
  }

  deletePurchase(purchaseid: string) {
    this.cartSvc.removePurchaseFromCart(this.cartSvc.cart._id, purchaseid).subscribe((res) => {
      if (res.result === true) {
        this.cartSvc.loadCart(this.userSvc.user._id);

        let _cartloaded$ = this.cartSvc.cartLoaded.subscribe(() => {
          if (!this.cartSvc.cart || !this.cartSvc.cart.purchases || this.cartSvc.cart.purchases.length === 0) {
            if (this.cartSvc.cart) {
              this.cartSvc.deleteCart(this.cartSvc.cart._id).subscribe((deleteres) => {
                this.cartSvc.loadCart(this.userSvc.user._id);
                this.router.navigate(['user']);
              });
            } else {
              this.router.navigate(['user']);
            }
          }
          _cartloaded$.unsubscribe();
        });
      }
    });
  }

  makePurchases() {
    this.cartSvc.makePurchase(this.cartSvc.cart._id).subscribe((res) => {
      this.cartSvc.loadCart(this.userSvc.user._id);
    });
  }

  clearCart() {
    this.cartSvc.deleteCart(this.cartSvc.cart._id).subscribe((res) => {
      this.cartSvc.loadCart(this.userSvc.user._id);
      this.router.navigate(['user']);
    });
  }
}
