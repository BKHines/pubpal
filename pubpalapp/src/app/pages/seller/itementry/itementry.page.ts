import { Component, OnInit, ViewChild, Sanitizer } from '@angular/core';
import { Ingredient, PurchasableItemModel } from 'src/app/shared/models';
import { Observable, of } from 'rxjs';
import { SellerService } from 'src/app/providers/seller.service';
import { CONSTANTS } from 'src/app/shared/constants';
import { mergeMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { IonInput, LoadingController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Plugins, CameraResultType, CameraSource, CameraOptions } from '@capacitor/core';

// import * as Tesseract from 'tesseract.js';
declare var OCRAD: any;
import * as $ from 'jquery';
import { CommonService } from 'src/app/providers/common.service';

@Component({
  selector: 'app-itementry',
  templateUrl: './itementry.page.html',
  styleUrls: ['./itementry.page.scss'],
})
export class ItementryPage implements OnInit {
  piId: string;
  entryFailed: boolean;
  newIngredient: Ingredient;

  newPI: PurchasableItemModel;
  categoryTypes: string[];
  categories: string[];
  ingCategoryGroups: string[];

  @ViewChild('ingentry') entryingredient: IonInput;
  @ViewChild('optentry') entryoption: IonInput;

  isOptionEntry: boolean;

  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;
  applyPriceFormat: boolean;
  applyIngUpchargeFormat: boolean;

  imgdata: string;

  constructor(
    private sellerSvc: SellerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private commonSvc: CommonService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.applyPriceFormat = true;
    this.piId = this.activatedRoute.snapshot.params['id'];
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
    this.commonSvc.headerMessage = this.piId ? 'Edit Item' : 'Add New Item';
    this.commonSvc.menuoptionsType = 'seller';
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

      this.isOptionEntry = /beer|shot|shots/i.test(this.newPI.category);
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

  optAddHandler(entryForm: NgForm) {
    if (!this.newPI.ingredients) {
      this.newPI.ingredients = [];
    }

    this.newPI.ingredients.forEach((i, idx) => {
      i.id = idx;
      i.upcharge = +i.upcharge;
    });
    this.newIngredient.id = this.newPI.ingredients.length;
    this.newIngredient.category = 'Alcohol';
    this.newPI.ingredients.push(this.newIngredient);

    this.ingCategoryGroups = ['Alcohol'];

    this.resetIng();
    this.entryoption.setFocus();
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

  showUnavailablePopup(item: PurchasableItemModel, ing: Ingredient) {
    this.alertCtrl.create({
      header: 'Is Ingredient Unavailable?',
      message: `Are you sure you want to mark ${ing.ingredient} ${ing.unavailable ? 'available' : 'unavailable'} for ${item.name}?`,
      buttons: [
        {
          text: 'Nevermind',
          role: 'cancel'
        },
        {
          text: 'Yep',
          handler: () => {
            let _ingUnavailable = item.ingredients.find(a => a.id === ing.id).unavailable;
            item.ingredients.find(a => a.id === ing.id).unavailable = !_ingUnavailable;
          }
        }
      ]
    }).then((da) => {
      da.present();
    });

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
            this.goToItems();
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
          this.goToItems();
        }, 200);
      });
    }
  }

  piResetHandler() {
    this.resetNewPI();
    this.goToItems();
  }

  goToItems() {
    this.router.navigate(['seller/items']);
  }

  isOptionEntryCheck(category: string) {
    return /beer|shot|shots/i.test(category);
  }

  captureLabel() {
    let _opts: CameraOptions = {
      quality: 40,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      saveToGallery: false
    };

    Plugins.Camera.getPhoto(_opts).then((imgRes) => {

      let arr = imgRes.dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      let file = new File([u8arr], 'test', { type: mime });
      const imgData = new FormData();
      imgData.append('file', file);

      this.sellerSvc.scrapeLabel(imgData).subscribe((res) => {
        this.alertCtrl.create({
          message: `Logo: ${res.result.logos.join('\n')} - Text: ${res.result.texts.join('\n')}`,
          buttons: [
            {
              text: 'Okay',
              role: 'cancel'
            }
          ]
        }).then((ac) => {
          ac.present();
        });
      })
    });
  }

  async addFromCamera() {
    let _opts: CameraOptions = {
      quality: 40,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      saveToGallery: false
    };

    Plugins.Camera.getPhoto(_opts).then((image) => {
      // this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));

      if (image && image.dataUrl) {
        this.loadingCtrl.create({ spinner: 'dots' }).then((lc) => {
          lc.present();
        });
        // let _bufferImage = Buffer.from(image.base64String);
        // if (_bufferImage) {
        //   console.log('image buffer found');
        // }

        // const worker = Tesseract.createWorker({
        //   logger: m => console.log(m),
        //   // langPath: './tessdata',
        // });
        // worker.load();
        // worker.loadLanguage('./assets/tessdata/eng');
        // worker.initialize('./assets/tessdata/eng');
        // worker.recognize(_bufferImage)
        //   .then(({ data: { text } }) => {
        //     console.log(text);
        //   }).finally(async () => {
        //     worker.terminate();
        //   });

        // Tesseract.recognize(_bufferImage, './assets/tessdata/eng', {
        //   logger: m => console.log(m),
        //   // corePath: './assets/tessdata/tesseract-core.js'
        // })
        // Tesseract.recognize(image.path, this.commonSvc.isApp ? 'assets/tessdata/eng' : 'eng', {
        //   logger: m => console.log(m)
        // }).catch((err) => {
        //   this.loadingCtrl.dismiss();
        //   console.error(err);
        //   this.alertCtrl.create({
        //     message: 'Your label could not be read. Please try again and make sure the text is visible.',
        //     buttons: [
        //       {
        //         text: 'Okay',
        //         role: 'cancel'
        //       }
        //     ]
        //   }).then((ac) => {
        //     ac.present();
        //   });
        // }).then((result: Tesseract.RecognizeResult) => {
        //   console.log('result ======<<<<>>>>>');
        //   this.loadingCtrl.dismiss();
        //   if (result && result.data) {
        //     console.log(result.data.text);
        //   } else {
        //     console.log('nope, no result data');
        //   }
        // });

        // const worker = Tesseract.createWorker({
        //   logger: m => console.log(m)
        //   // langPath: './tessdata',
        // });
        // worker.load();
        // worker.loadLanguage('./assets/tessdata/eng');
        // // worker.initialize('./assets/tessdata/eng');
        // worker.recognize(_bufferImage).then(({ data: { text } }) => {
        //   console.log('result ======<<<<>>>>>');
        //   console.log(text);
        //   worker.terminate();
        // }).catch(err => console.error(err));

        // OCRAD
        this.imgdata = image.dataUrl;
        setTimeout(() => {
          let _img = $('#imgdata_id');
          let context = document.createElement('canvas').getContext('2d');
          context.drawImage(_img[0] as CanvasImageSource, 0, 0);

          let imageData = context.getImageData(0, 0, _img.width(), _img.height());
          OCRAD(imageData, text => {
            console.log(text);
            this.loadingCtrl.dismiss();
          });
        }, 300);
      } else {
        this.loadingCtrl.dismiss();
        this.alertCtrl.create({
          message: 'Your label could not be read. Please try again and make sure the text is visible.',
          buttons: [
            {
              text: 'Okay',
              role: 'cancel'
            }
          ]
        }).then((ac) => {
          ac.present();
        });
      }
    });

  }
}
