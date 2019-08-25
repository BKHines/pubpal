import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { PurchasableItemModel, Ingredient } from 'src/app/shared/models';
import { SellerService } from 'src/app/providers/seller.service';
import { ModalService } from 'src/app/providers/modal.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { NgForm } from '@angular/forms';
import { LoadingService } from 'src/app/providers/loading.service';

@Component({
  selector: 'app-purchasableitementry',
  templateUrl: './purchasableitementry.component.html',
  styleUrls: ['./purchasableitementry.component.scss']
})
export class PurchasableitementryComponent implements OnInit {
  @Input() piId: string;
  entryFailed: boolean;
  newIngredient: Ingredient;

  newPI: PurchasableItemModel;

  @ViewChild('ingentry', { static: false }) entryingredient: ElementRef;
  @ViewChild('ingpriceentry', { static: true }) entryingprice: ElementRef;

  constructor(private sellerSvc: SellerService, private modalSvc: ModalService, private loadingSvc: LoadingService) { }

  ngOnInit() {
    if (this.piId) {
      this.newPI = JSON.parse(JSON.stringify(this.sellerSvc.seller.items.find(a => a.id === this.piId)));
    } else {
      this.resetNewPI();
    }
    this.resetIng();
  }

  resetNewPI() {
    this.newPI = {
      id: '',
      baseingredient: '',
      description: '',
      name: '',
      price: null,
      requireingredients: false
    };
  }

  resetIng() {
    this.newIngredient = {
      id: null,
      ingredient: '',
      description: '',
      upcharge: null
    };
  }

  ingAddHandler(entryForm: NgForm) {
    if (!this.newPI.ingredients) {
      this.newPI.ingredients = [];
    }

    this.newPI.ingredients.forEach((i, idx) => {
      i.id = idx;
      i.upcharge = +i.upcharge;
    });
    this.newIngredient.id = this.newPI.ingredients.length;
    this.newPI.ingredients.push(this.newIngredient);
    this.resetIng();
    this.entryingredient.nativeElement.focus();
    this.resetForm(entryForm);
  }

  ingResetHandler(entryForm: NgForm) {
    this.resetIng();
    this.resetForm(entryForm);
  }

  ingDeleteHandler(id: number) {
    this.newPI.ingredients.splice(id, 1);
    this.setIndices();
  }

  setIndices() {
    this.newPI.ingredients.forEach((i, idx) => {
      i.id = idx;
    });
  }

  resetForm(entryForm: NgForm) {
    entryForm.form.markAsPristine();
    entryForm.form.markAsUntouched();
    entryForm.form.updateValueAndValidity();
  }

  piAddUpdateHandler() {
    this.newPI.price = +this.newPI.price;
    if (this.newPI.ingredients) {
      this.newPI.ingredients.forEach((i) => {
        i.upcharge = +i.upcharge;
      });
    }

    if (this.piId) {
      this.loadingSvc.addMessage('UpdatingPI', 'Updating Item...');
      this.sellerSvc.updatePurchasableItem(this.sellerSvc.seller._id, this.newPI).subscribe((res) => {
        if (!this.sellerSvc.seller.items) {
          this.sellerSvc.seller.items = [];
        }
        if (res.result) {
          const updateIdx = this.sellerSvc.seller.items.findIndex(a => a.id === this.piId);
          this.sellerSvc.seller.items[updateIdx] = JSON.parse(JSON.stringify(this.newPI));
          setTimeout(() => {
            this.loadingSvc.removeMessage('UpdatingPI');
            this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASEITEM_ENTRY);
            this.resetNewPI();
          }, 200);
        }
      });
    } else {
      this.loadingSvc.addMessage('AddingPI', 'Adding Item...');
      this.sellerSvc.addPurchasableItem(this.sellerSvc.seller._id, this.newPI).subscribe((res) => {
        if (!this.sellerSvc.seller.items) {
          this.sellerSvc.seller.items = [];
        }
        this.newPI.id = res.result;
        this.sellerSvc.seller.items.push(this.newPI);
        setTimeout(() => {
          this.loadingSvc.removeMessage('AddingPI');
          this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASEITEM_ENTRY);
          this.resetNewPI();
        }, 200);
      });
    }
  }

  piResetHandler() {
    this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASEITEM_ENTRY);
    this.resetNewPI();
  }
}
