import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { PurchasableItemModel, Ingredient, APIResponse } from 'src/app/shared/models';
import { SellerService } from 'src/app/providers/seller.service';
import { ModalService } from 'src/app/providers/modal.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { NgForm } from '@angular/forms';
import { LoadingService } from 'src/app/providers/loading.service';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PurchaseService } from 'src/app/providers/purchase.service';

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
  categoryTypes: string[];
  categories: string[];
  ingCategoryGroups: string[];

  @ViewChild('ingentry', { static: false }) entryingredient: ElementRef;

  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;

  constructor(
    private sellerSvc: SellerService,
    private modalSvc: ModalService,
    private loadingSvc: LoadingService) { }

  ngOnInit() {
    this.categoryTypes = CONSTANTS.categorytypes;

    this.sellerSvc.getSellerCategories(this.sellerSvc.seller._id).subscribe((res: APIResponse) => {
      this.categories = res.result as string[];
    });

    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.newPI.category);
    }).pipe(
      mergeMap((token: string) => this.getSellerCategories(token))
    );

    if (this.piId) {
      this.newPI = JSON.parse(JSON.stringify(this.sellerSvc.seller.items.find(a => a.id === this.piId)));
      if (!this.ingCategoryGroups) {
        this.ingCategoryGroups = [];
      }

      this.newPI.ingredients.map((a) => {
        if (this.ingCategoryGroups.filter(b => b === a.category).length === 0) {
          this.ingCategoryGroups.push(a.category);
        }
      });

    } else {
      this.resetNewPI();
    }
    this.resetIng();
  }

  getSellerCategories(token: string): Observable<any> {
    const query = new RegExp(token, 'i');

    if (this.newPI) {
      return of(
        this.categories.filter(a => {
          return query.test(a);
        })
      );
    } else {
      return of([]);
    }
  }

  resetNewPI() {
    this.newPI = {
      id: '',
      baseingredient: '',
      description: '',
      name: '',
      price: null
    };
  }

  resetIng() {
    this.newIngredient = {
      id: null,
      ingredient: '',
      description: '',
      upcharge: null,
      category: ''
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

    if (!this.ingCategoryGroups) {
      this.ingCategoryGroups = [];
    }

    if (this.ingCategoryGroups.filter(a => a === this.newIngredient.category).length === 0) {
      this.ingCategoryGroups.push(this.newIngredient.category);
    }

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
