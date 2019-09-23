import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { CartService } from 'src/app/providers/cart.service';
import { Cart, APIResponse, SellerModel, SellerName } from 'src/app/shared/models';
import { LoadingService } from 'src/app/providers/loading.service';
import { ModalService } from 'src/app/providers/modal.service';
import { CONSTANTS } from 'src/app/shared/constants';

@Component({
  selector: 'app-cartviewer',
  templateUrl: './cartviewer.component.html',
  styleUrls: ['./cartviewer.component.scss']
})
export class CartviewerComponent implements OnInit {
  constructor(
    public userSvc: UserService,
    public cartSvc: CartService,
    private loadingSvc: LoadingService,
    private modalSvc: ModalService
  ) { }

  ngOnInit() {
    if (this.userSvc.user) {
      this.cartSvc.loadCart(this.userSvc.user._id);
    }
  }

  loadCart() {
    this.loadingSvc.addMessage('LoadCart', 'Loading Your Cart...');
    this.cartSvc.loadCart(this.userSvc.user._id);

    this.cartSvc.cartLoaded.subscribe(() => {
      let sellerIds = [...new Set(this.cartSvc.cart.purchases.map(a => a.sellerid))];
      this.userSvc.getSellerNamesByIds(sellerIds).subscribe((sellernameres: APIResponse) => {
        let _sellernames = sellernameres.result as SellerName[];
        this.cartSvc.cart.purchases.forEach((a) => {
          a['sellername'] = _sellernames.filter(b => b.sellerid === a.sellerid)[0].name;
        });
        this.loadingSvc.removeMessage('LoadCart');
      });
    });
  }

  deletePurchase(purchaseid: string) {
    this.loadingSvc.addMessage('RemovePurchase', 'Removing Purchase...');
    this.cartSvc.removePurchaseFromCart(this.cartSvc.cart._id, purchaseid).subscribe((res) => {
      this.loadingSvc.removeMessage('RemovePurchase');
      if (res.result === true) {
        this.cartSvc.loadCart(this.userSvc.user._id);
      }
    });
  }

  makePurchases() {
    this.loadingSvc.addMessage('MakePurchase', 'Making Purchases...');
    this.cartSvc.makePurchase(this.cartSvc.cart._id).subscribe((res: APIResponse) => {
      this.loadingSvc.removeMessage('MakePurchase');
      this.modalSvc.hideModal(CONSTANTS.MODAL_CART_VIEWER);
      this.cartSvc.loadCart(this.userSvc.user._id);
    });
  }

  clearCart() {
    this.loadingSvc.addMessage('ClearCart', 'Clearing Cart...');
    this.cartSvc.deleteCart(this.cartSvc.cart._id).subscribe((res: APIResponse) => {
      this.loadingSvc.removeMessage('ClearCart');
      this.modalSvc.hideModal(CONSTANTS.MODAL_CART_VIEWER);
      this.cartSvc.loadCart(this.userSvc.user._id);
    });
  }
}
