import { Component, OnInit } from '@angular/core';
import { PurchasableItemModel, Ingredient } from 'src/app/shared/models';
import { SellerService } from 'src/app/providers/seller.service';
import { ModalService } from 'src/app/providers/modal.service';
import { CONSTANTS } from 'src/app/shared/constants';

@Component({
  selector: 'app-purchasableitementry',
  templateUrl: './purchasableitementry.component.html',
  styleUrls: ['./purchasableitementry.component.scss']
})
export class PurchasableitementryComponent implements OnInit {
  pi: PurchasableItemModel;
  entryFailed: boolean;
  newIngredient: Ingredient;

  constructor(private sellerSvc: SellerService, private modalSvc: ModalService) { }

  ngOnInit() {
    this.resetPI();
    this.resetIng();
  }

  resetPI() {
    this.pi = {
      id: '',
      baseingredient: '',
      description: '',
      name: '',
      price: -1,
      requireingredients: false
    };
  }

  resetIng() {
    this.newIngredient = {
      ingredient: '',
      upcharge: -1
    };
  }

  ingAddHandler() {
    if (!this.pi.ingredients) {
      this.pi.ingredients = [];
    }

    this.pi.ingredients.push(this.newIngredient);
    this.resetIng();
  }

  ingResetHandler() {
    this.resetIng();
  }

  piAddHandler() {
    this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASEITEM_ENTRY);
    this.resetPI();
  }

  piResetHandler() {
    this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASEITEM_ENTRY);
    this.resetPI();
  }
}
