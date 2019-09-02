import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { PurchasableItemModel, APIResponse, Purchase, Ingredient } from 'src/app/shared/models';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import { ModalService } from 'src/app/providers/modal.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { LoadingService } from 'src/app/providers/loading.service';

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
  categories: string[];
  selectedOptions: Ingredient[];
  instructions: string;

  faSquare = faSquare;
  faCheckSquare = faCheckSquare;

  isoptionselected = (item: Ingredient) => this.selectedOptions && this.selectedOptions.some(a => a.id === item.id);

  constructor(private userSvc: UserService, private modalSvc: ModalService, private loadingSvc: LoadingService) { }

  ngOnInit() {
    if (this.purchaseId) {
      this.userSvc.getPurchaseById(this.purchaseId).subscribe((res: APIResponse) => {
        this.purchase = res.result;
      });
    }

    if (this.optionId) {
      this.loadingSvc.addMessage('GetSellerOptions', 'Getting Items...');
      this.userSvc.getSellerOptionByIds(this.sellerId, this.optionId).subscribe((res: APIResponse) => {
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
    }
  }

  setOptionSelected(item: Ingredient) {
    if (!this.selectedOptions) {
      this.selectedOptions = [];
    }
    let _selectedCategoryIndex = this.selectedOptions ? this.selectedOptions.findIndex(a => a.category === item.category) : null;
    if (_selectedCategoryIndex > -1) {
      console.log('in replace', _selectedCategoryIndex);
      this.selectedOptions.splice(_selectedCategoryIndex, 1, item);
    } else {
      console.log('in push', _selectedCategoryIndex);
      this.selectedOptions.push(item);
    }
    this.setTotalPrice();
  }

  setTotalPrice() {
    const _selectedOptionsUpcharge = this.selectedOptions ? this.selectedOptions.map(a => +a.upcharge).reduce((i) => +i, 0) : 0;
    this.totalPrice = this.purchasableItem.price + _selectedOptionsUpcharge;
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
      customername: this.userSvc.user.firstname + ' ' + this.userSvc.user.lastname.substring(0, 1),
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
        statusdate: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
      }]
    };
    this.loadingSvc.addMessage('CreatePurchase', 'Creating Purchase...');
    this.userSvc.createPurchase(this.purchase).subscribe((res: APIResponse) => {
      this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASE);
      this.purchase._id = res.result;
      this.loadingSvc.removeMessage('CreatePurchase');
    });
  }
}
