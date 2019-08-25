import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { PurchasableItemModel, APIResponse, Purchase, Ingredient } from 'src/app/shared/models';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import { ModalService } from 'src/app/providers/modal.service';
import { CONSTANTS } from 'src/app/shared/constants';

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

  purchase: Purchase;
  purchasableItem: PurchasableItemModel;
  selectedOptions: Ingredient[];
  instructions: string;

  faSquare = faSquare;
  faCheckSquare = faCheckSquare;

  constructor(private userSvc: UserService, private modalSvc: ModalService) { }

  ngOnInit() {
    if (this.purchaseId) {
      this.userSvc.getPurchaseById(this.purchaseId).subscribe((res: APIResponse) => {
        this.purchase = res.result;
      });
    }

    if (this.optionId) {
      this.userSvc.getSellerOptionByIds(this.sellerId, this.optionId).subscribe((res: APIResponse) => {
        this.purchasableItem = res.result;
        this.totalPrice = this.purchasableItem.price;
        this.setTipAmount('20%');
      });
    }
  }

  setTotalPrice(item: Ingredient) {
    this.selectedOptions = [item];
    this.totalPrice = this.purchasableItem.price + (this.selectedOptions ? this.selectedOptions[0].upcharge : 0);
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
        this.tipAmount = this.totalPrice * .05;
        break;
      case '10%':
        this.customTip = null;
        this.tipAmount = this.totalPrice * .1;
        break;
      case '15%':
        this.customTip = null;
        this.tipAmount = this.totalPrice * .15;
        break;
      case '20%':
        this.customTip = null;
        this.tipAmount = this.totalPrice * .2;
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
      sellerid: this.sellerId,
      itemname: this.purchasableItem.name,
      ingredients: this.selectedOptions.map(a => a.ingredient),
      price: +(this.totalPrice.toFixed(2)),
      fee: 0,
      tip: +(this.tipAmount.toFixed(2)),
      instructions: this.instructions,
      currentstatus: 'ordered',
      purchasehistory: [{
        purchasestatus: 'ordered',
        statusdate: new Date().toLocaleDateString()
      }]
    };
    this.userSvc.createPurchase(this.purchase).subscribe((res: APIResponse) => {
      this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASE);
      this.purchase._id = res.result;
    });
  }
}
