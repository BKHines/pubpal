import { Component, OnInit } from '@angular/core';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { UserService } from 'src/app/providers/user.service';
import { PurchasableItemModel, Ingredient, Purchase } from 'src/app/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/providers/common.service';

@Component({
  selector: 'app-purchaseoptions',
  templateUrl: './purchaseoptions.page.html',
  styleUrls: ['./purchaseoptions.page.scss'],
})
export class PurchaseoptionsPage implements OnInit {
  sellerId: string;
  optionId: string;
  option: PurchasableItemModel;
  purchase: Purchase;

  instructions: string;

  categoryGroups: string[];
  selectedIngredients: Ingredient[];
  allGroupsSelected: boolean;

  totalPrice: number;
  ingredientUpcharge: number;
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
  fee: number;

  constructor(
    private purchSvc: PurchaseService,
    public userSvc: UserService,
    private route: ActivatedRoute,
    private commonSvc: CommonService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sellerId = this.route.snapshot.params['id'];
    this.optionId = this.route.snapshot.params['optionid'];

    if (this.sellerId) {
      if (this.userSvc.user) {
        this.loadData();
      } else {
        let userLoaded$ = this.userSvc.userLoaded.subscribe(() => {
          this.loadData();
          userLoaded$.unsubscribe();
        });
      }
    }
  }

  loadData() {
    if (this.userSvc.user) {
      this.purchSvc.getSellerOptionsById(this.sellerId).subscribe((res) => {
        this.option = res.result.find(a => a.id === this.optionId);
        this.totalPrice = this.option.price;
        this.setTipAmount('10%');

        if (!this.categoryGroups) {
          this.categoryGroups = [];
        }

        this.option.ingredients.map((a) => {
          if (this.categoryGroups.filter(b => b === a.category).length === 0) {
            this.categoryGroups.push(a.category);
          }
        });
      });

      this.commonSvc.getFee().subscribe((res) => {
        this.fee = res.result;
      });
    }
  }

  selectIngredient(ing: Ingredient) {
    if (!this.selectedIngredients) {
      this.selectedIngredients = [];
    }
    let _selectedCategoryIndex = this.selectedIngredients ? this.selectedIngredients.findIndex(a => a.category === ing.category) : null;
    if (_selectedCategoryIndex > -1) {
      this.selectedIngredients.splice(_selectedCategoryIndex, 1, ing);
    } else {
      this.selectedIngredients.push(ing);
    }
    this.allGroupsSelected = this.getUniqueOptionCategories() === this.getUniqueSelectedOptionCategories();

    this.setTotalPrice();
  }

  setTotalPrice() {
    this.ingredientUpcharge = this.selectedIngredients ? this.selectedIngredients.map(a => +a.upcharge).reduce((a, b) => a + b, 0) : 0;
    this.totalPrice = this.option.price + this.ingredientUpcharge;
  }

  isCategorySelected(category: string) {
    return this.selectedIngredients && this.selectedIngredients.findIndex(a => a.category === category) > -1;
  }

  getCategorySelection(category: string) {
    return this.selectedIngredients ? this.selectedIngredients.find(a => a.category === category) : null;
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

  clearEntry() {
    this.purchase = null;
    this.selectedIngredients = [];
    this.ingredientUpcharge = 0;
    this.totalPrice = this.option.price;
    this.setTipAmount('10%');
  }

  cancel() {
    this.clearEntry();
    this.router.navigate(['user/purchase/seller', this.sellerId]);
  }

  addPurchase() {
    this.purchase = {
      userid: this.userSvc.user._id,
      customername: this.userSvc.user.firstname + ' ' + this.userSvc.user.lastname.substring(0, 1),
      sellerid: this.sellerId,
      itemname: this.option.name,
      ingredients: this.selectedIngredients.map(a => a.ingredient),
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
    this.purchSvc.createPurchase(this.purchase).subscribe((res) => {
      this.purchase._id = res.result;
      this.clearEntry();
      this.router.navigate(['user/purchase/seller', this.sellerId]);
    });
  }

  addPurchaseToCart() {
    // if (this.cartId) {
    //   let _purchase: CartPurchase = {
    //     userid: this.userSvc.user._id,
    //     customername: this.userSvc.user.firstname + ' ' + this.userSvc.user.lastname.substring(0, 1),
    //     sellerid: this.sellerId,
    //     itemname: this.purchasableItem.name,
    //     ingredients: this.selectedOptions.map(a => a.ingredient),
    //     price: +(this.totalPrice.toFixed(2)),
    //     fee: this.fee * (this.userSvc.user.feediscount ? ((100 - this.userSvc.user.feediscount) / 100.0) : 1.0),
    //     feewaived: this.userSvc.user.waivedfeetokens > 0,
    //     tip: +(this.tipAmount.toFixed(2)),
    //     instructions: this.instructions ? this.instructions : '',
    //     currentstatus: 'ordered',
    //     purchasehistory: [{
    //       purchasestatus: 'ordered',
    //       statusdate: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
    //     }]
    //   };
    //   this.cartSvc.addPurchaseToCart(this.cartId, _purchase).subscribe((res) => {
    //     this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASE);
    //     this.cartSvc.loadCart(this.userSvc.user._id);
    //   });
    // } else {
    //   let _purchase: CartPurchase = {
    //     userid: this.userSvc.user._id,
    //     customername: this.userSvc.user.firstname + ' ' + this.userSvc.user.lastname.substring(0, 1),
    //     sellerid: this.sellerId,
    //     itemname: this.purchasableItem.name,
    //     ingredients: this.selectedOptions.map(a => a.ingredient),
    //     price: +(this.totalPrice.toFixed(2)),
    //     fee: this.fee * (this.userSvc.user.feediscount ? ((100 - this.userSvc.user.feediscount) / 100.0) : 1.0),
    //     feewaived: this.userSvc.user.waivedfeetokens > 0,
    //     tip: +(this.tipAmount.toFixed(2)),
    //     instructions: this.instructions ? this.instructions : '',
    //     currentstatus: 'ordered',
    //     purchasehistory: [{
    //       purchasestatus: 'ordered',
    //       statusdate: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
    //     }]
    //   };
    //   let _cart: Cart = {
    //     purchases: [_purchase]
    //   };

    //   this.loadingSvc.addMessage('AddToCart', 'Adding Purchase To Cart...');
    //   this.cartSvc.createCart(_cart).subscribe((res) => {
    //     this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASE);
    //     this.cartId = res.result;
    //     this.loadingSvc.removeMessage('AddToCart');
    //     this.cartSvc.loadCart(this.userSvc.user._id);
    //   });
    // }
  }

  private getUniqueSelectedOptionCategories() {
    let _uniqueSelectedOptions: Ingredient[] = [];
    this.selectedIngredients.forEach((a) => {
      if (!_uniqueSelectedOptions.find(b => b.category === a.category)) {
        _uniqueSelectedOptions.push(a);
      }
    });
    return _uniqueSelectedOptions.length;
  }

  private getUniqueOptionCategories() {
    let _uniqueIngredients: Ingredient[] = [];
    if (this.option && this.option.ingredients) {
      this.option.ingredients.forEach((a) => {
        if (!_uniqueIngredients.find(b => b.category === a.category)) {
          _uniqueIngredients.push(a);
        }
      });
    }
    return _uniqueIngredients.length;
  }
}
