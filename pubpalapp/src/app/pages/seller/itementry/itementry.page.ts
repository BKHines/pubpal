import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Ingredient, PurchasableItemModel } from 'src/app/shared/models';
import { Observable, of } from 'rxjs';
import { SellerService } from 'src/app/providers/seller.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { mergeMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-itementry',
  templateUrl: './itementry.page.html',
  styleUrls: ['./itementry.page.scss'],
})
export class ItementryPage implements OnInit {
  @Input() piId: string;
  entryFailed: boolean;
  newIngredient: Ingredient;

  newPI: PurchasableItemModel;
  categoryTypes: string[];
  categories: string[];
  ingCategoryGroups: string[];

  @ViewChild('ingentry', { static: false }) entryingredient: IonInput;

  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;
  applyPriceFormat: boolean;
  applyIngUpchargeFormat: boolean;

  constructor(
    private sellerSvc: SellerService) { }

  ngOnInit() {
    this.categoryTypes = CONSTANTS.categorytypes;

    if (this.sellerSvc.seller) {
      this.loadData();
    } else {
      let _sellerLoaded$ = this.sellerSvc.sellerLoaded.subscribe(() => {
        this.loadData();
        _sellerLoaded$.unsubscribe();
      });
    }
    this.resetIng();
  }

  loadData() {
    this.sellerSvc.getSellerCategories(this.sellerSvc.seller._id).subscribe((res) => {
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
  }

  updatePrice(price: string) {
    if (this.newPI) {
      this.newPI.price = +(price.replace('$', ''));
    }
  }

  updateIngUpcharge(price: string) {
    if (this.newIngredient) {
      this.newIngredient.upcharge = +(price.replace('$', ''));
    }
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
    this.entryingredient.setFocus();
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
      this.sellerSvc.updatePurchasableItem(this.sellerSvc.seller._id, this.newPI).subscribe((res) => {
        if (!this.sellerSvc.seller.items) {
          this.sellerSvc.seller.items = [];
        }
        if (res.result) {
          const updateIdx = this.sellerSvc.seller.items.findIndex(a => a.id === this.piId);
          this.sellerSvc.seller.items[updateIdx] = JSON.parse(JSON.stringify(this.newPI));
          setTimeout(() => {
            this.resetNewPI();
          }, 200);
        }
      });
    } else {
      this.sellerSvc.addPurchasableItem(this.sellerSvc.seller._id, this.newPI).subscribe((res) => {
        if (!this.sellerSvc.seller.items) {
          this.sellerSvc.seller.items = [];
        }
        this.newPI.id = res.result;
        this.sellerSvc.seller.items.push(this.newPI);
        setTimeout(() => {
          this.resetNewPI();
        }, 200);
      });
    }
  }

  piResetHandler() {
    this.resetNewPI();
  }
}
