import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { PurchasableItemModel, APIResponse, Purchase, Ingredient, Cart, CartPurchase } from 'src/app/shared/models';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import { ModalService } from 'src/app/providers/modal.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { LoadingService } from 'src/app/providers/loading.service';
import { CommonService } from 'src/app/providers/common.service';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { CartService } from 'src/app/providers/cart.service';

@Component({
  selector: 'app-purchaseentry',
  templateUrl: './purchaseentry.component.html',
  styleUrls: ['./purchaseentry.component.scss']
})
export class PurchaseentryComponent implements OnInit {
  @Input() userId: string;
  @Input() purchaseId: string;
  @Input() optionId: string;
  @Input() sellerId: string;

  tipType: 'NT' | '5%' | '10%' | '15%' | '20%' | 'C';
  public tipAmount: number;
  private _customTip: number;
  public get customTip(): number {
    return this._customTip;
  }
  public set customTip(value: number) {
    this._customTip = +value;
    if (this.tipType === 'C') {
      this.tipAmount = this._customTip;
    }
  }
  totalPrice: number;
  selectedOptionsUpcharge: number;
  fee: number;

  purchase: Purchase;
  purchasableItem: PurchasableItemModel;
  cartId: string;
  categories: string[];
  selectedOptions: Ingredient[];
  allGroupsSelected: boolean;
  instructions: string;

  faSquare = faSquare;
  faCheckSquare = faCheckSquare;

  isoptionselected = (item: Ingredient) => this.selectedOptions && this.selectedOptions.some(a => a.id === item.id);

  constructor(
    public userSvc: UserService,
    private modalSvc: ModalService,
    private loadingSvc: LoadingService,
    private common: CommonService,
    private purchaseSvc: PurchaseService,
    private cartSvc: CartService) { }

  ngOnInit() {
    if (this.purchaseId) {
      this.purchaseSvc.getPurchaseForUserById(this.purchaseId).subscribe((res) => {
        this.purchase = res.result;
      });
    }

    this.cartSvc.getCartByUserId(this.userSvc.user._id).subscribe((res) => {
      if (res && res.result && res.result._id) {
        this.cartId = res.result._id as string;
      }
    });

    if (this.optionId) {
      this.loadingSvc.addMessage('GetSellerOptions', 'Getting Items...');
      this.common.getFee().subscribe((feeres) => {
        this.fee = feeres.result as number;

        this.purchaseSvc.getSellerOptionByIds(this.sellerId, this.optionId).subscribe((res) => {
          this.purchasableItem = res.result;
          this.categories = [];
          this.purchasableItem.ingredients.forEach((a) => {
            if (!this.categories.includes(a.category)) {
              this.categories.push(a.category);
            }
          });
          this.totalPrice = this.purchasableItem.price;
          this.setTipAmount('20%');
          this.loadingSvc.removeMessage('GetSellerOptions');
        });
      });
    }
  }

  setOptionSelected(item: Ingredient) {
    if (!this.selectedOptions) {
      this.selectedOptions = [];
    }
    let _selectedCategoryIndex = this.selectedOptions ? this.selectedOptions.findIndex(a => a.category === item.category) : null;
    if (_selectedCategoryIndex > -1) {
      this.selectedOptions.splice(_selectedCategoryIndex, 1, item);
    } else {
      this.selectedOptions.push(item);
    }
    this.allGroupsSelected = this.getUniqueOptionCategories() === this.getUniqueSelectedOptionCategories();

    this.setTotalPrice();
  }

  setTotalPrice() {
    this.selectedOptionsUpcharge = this.selectedOptions ? this.selectedOptions.map(a => +a.upcharge).reduce((a, b) => a + b, 0) : 0;
    this.totalPrice = this.purchasableItem.price + this.selectedOptionsUpcharge;
  }

  setTipAmount(_tipType: 'NT' | '5%' | '10%' | '15%' | '20%' | 'C') {
    this.tipType = _tipType;
    switch (_tipType) {
      case 'NT':
        this.customTip = null;
        this.tipAmount = 0;
        break;
      case '5%':
        this.customTip = null;
        this.tipAmount = +((this.totalPrice * .05).toFixed(2));
        break;
      case '10%':
        this.customTip = null;
        this.tipAmount = +((this.totalPrice * .1).toFixed(2));
        break;
      case '15%':
        this.customTip = null;
        this.tipAmount = +((this.totalPrice * .15).toFixed(2));
        break;
      case '20%':
        this.customTip = null;
        this.tipAmount = +((this.totalPrice * .2).toFixed(2));
        break;
      case 'C':
        if (!this.customTip) {
          this.tipAmount = 0;
        }
        break;
    }
  }

  cancel() {
    this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASE);
  }

  addPurchase() {
    this.purchase = {
      userid: this.userSvc.user._id,
      customername: this.userSvc.user.firstname + ' ' + this.userSvc.user.lastname.substring(0, 1),
      sellerid: this.sellerId,
      itemname: this.purchasableItem.name,
      ingredients: this.selectedOptions.map(a => a.ingredient),
      price: +(this.totalPrice.toFixed(2)),
      fee: this.fee * (this.userSvc.user.feediscount ? ((100 - this.userSvc.user.feediscount) / 100.0) : 1.0),
      feewaived: this.userSvc.user.waivedfeetokens > 0,
      tip: +(this.tipAmount.toFixed(2)),
      instructions: this.instructions ? this.instructions : '',
      currentstatus: 'ordered',
      purchasehistory: [{
        purchasestatus: 'ordered',
        statusdate: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
      }]
    };
    this.loadingSvc.addMessage('CreatePurchase', 'Creating Purchase...');
    this.purchaseSvc.createPurchase(this.purchase).subscribe((res) => {
      this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASE);
      this.purchase._id = res.result;
      this.loadingSvc.removeMessage('CreatePurchase');
    });
  }

  addPurchaseToCart() {
    if (this.cartId) {
      let _purchase: CartPurchase = {
        userid: this.userSvc.user._id,
        customername: this.userSvc.user.firstname + ' ' + this.userSvc.user.lastname.substring(0, 1),
        sellerid: this.sellerId,
        itemname: this.purchasableItem.name,
        ingredients: this.selectedOptions.map(a => a.ingredient),
        price: +(this.totalPrice.toFixed(2)),
        fee: this.fee * (this.userSvc.user.feediscount ? ((100 - this.userSvc.user.feediscount) / 100.0) : 1.0),
        feewaived: this.userSvc.user.waivedfeetokens > 0,
        tip: +(this.tipAmount.toFixed(2)),
        instructions: this.instructions ? this.instructions : '',
        currentstatus: 'ordered',
        purchasehistory: [{
          purchasestatus: 'ordered',
          statusdate: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        }]
      };
      this.loadingSvc.addMessage('AddToCart', 'Adding Purchase To Cart...');
      this.cartSvc.addPurchaseToCart(this.cartId, _purchase).subscribe((res) => {
        this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASE);
        this.loadingSvc.removeMessage('AddToCart');
        this.cartSvc.loadCart(this.userSvc.user._id);
      });
    } else {
      let _purchase: CartPurchase = {
        userid: this.userSvc.user._id,
        customername: this.userSvc.user.firstname + ' ' + this.userSvc.user.lastname.substring(0, 1),
        sellerid: this.sellerId,
        itemname: this.purchasableItem.name,
        ingredients: this.selectedOptions.map(a => a.ingredient),
        price: +(this.totalPrice.toFixed(2)),
        fee: this.fee * (this.userSvc.user.feediscount ? ((100 - this.userSvc.user.feediscount) / 100.0) : 1.0),
        feewaived: this.userSvc.user.waivedfeetokens > 0,
        tip: +(this.tipAmount.toFixed(2)),
        instructions: this.instructions ? this.instructions : '',
        currentstatus: 'ordered',
        purchasehistory: [{
          purchasestatus: 'ordered',
          statusdate: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        }]
      };
      let _cart: Cart = {
        purchases: [_purchase]
      };

      this.loadingSvc.addMessage('AddToCart', 'Adding Purchase To Cart...');
      this.cartSvc.createCart(_cart).subscribe((res) => {
        this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASE);
        this.cartId = res.result;
        this.loadingSvc.removeMessage('AddToCart');
        this.cartSvc.loadCart(this.userSvc.user._id);
      });
    }
  }

  private getUniqueSelectedOptionCategories() {
    let _uniqueSelectedOptions: Ingredient[] = [];
    this.selectedOptions.forEach((a) => {
      if (!_uniqueSelectedOptions.find(b => b.category === a.category)) {
        _uniqueSelectedOptions.push(a);
      }
    });
    return _uniqueSelectedOptions.length;
  }

  private getUniqueOptionCategories() {
    let _uniqueIngredients: Ingredient[] = [];
    if (this.purchasableItem && this.purchasableItem.ingredients) {
      this.purchasableItem.ingredients.forEach((a) => {
        if (!_uniqueIngredients.find(b => b.category === a.category)) {
          _uniqueIngredients.push(a);
        }
      });
    }
    return _uniqueIngredients.length;
  }
}
