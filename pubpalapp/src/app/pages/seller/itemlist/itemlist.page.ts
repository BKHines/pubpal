import { Component, OnInit } from '@angular/core';
import { SellerService } from 'src/app/providers/seller.service';
import { AlertController } from '@ionic/angular';
import { PurchasableItemModel } from 'src/app/shared/models';
import { Router } from '@angular/router';
import { CONSTANTS } from 'src/app/shared/constants';
import { CommonService } from 'src/app/providers/common.service';

@Component({
  selector: 'app-itemlist',
  templateUrl: './itemlist.page.html',
  styleUrls: ['./itemlist.page.scss'],
})
export class ItemlistPage implements OnInit {
  categoryTypes: string[];
  filtertext: string;

  constructor(
    private alertCtrl: AlertController,
    public sellerSvc: SellerService,
    private router: Router,
    private commonSvc: CommonService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.categoryTypes = CONSTANTS.categorytypes;
    this.commonSvc.headerMessage = 'Your Items';
    this.commonSvc.menuoptionsType = 'seller';

    if (this.sellerSvc.seller.items) {
      this.sellerSvc.seller.items.forEach((si) => {
        si.iconurl = this.commonSvc.getDrinkIconUrl(si.name, si.baseingredient);
      });

    }
  }

  goToItemEntry(piId?: string) {
    if (piId) {
      this.router.navigate(['seller/items/entry', piId]);
    } else {
      this.router.navigate(['seller/items/newentry']);
    }
  }

  showUnavailablePopup(item: PurchasableItemModel) {
    this.alertCtrl.create({
      header: 'Is Item Unavailable?',
      message: `Are you sure you want to mark ${item.name} ${item.unavailable ? 'available' : 'unavailable'}?`,
      buttons: [
        {
          text: 'Nevermind',
          role: 'cancel'
        },
        {
          text: 'Yep',
          handler: () => {
            item.unavailable = !item.unavailable;
            this.sellerSvc.updatePurchasableItem(this.sellerSvc.seller._id, item).subscribe((res) => {
              if (res.result) {
                this.sellerSvc.seller.items.find(a => a.id === item.id).unavailable = item.unavailable;
              }
            });
          }
        }
      ]
    }).then((da) => {
      da.present();
    });

  }


  showDeleteConfirmationModal(item: PurchasableItemModel) {
    this.alertCtrl.create({
      header: 'Delete Item',
      message: `Are you sure you want to delete ${item.name}?  This is permanent can cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.sellerSvc.deletePurchasableItem(this.sellerSvc.seller._id, item.id).subscribe((res) => {
              if (res.result) {
                this.sellerSvc.seller.items = this.sellerSvc.seller.items.filter(a => a.id !== item.id);
              }
            });
          }
        }
      ]
    }).then((da) => {
      da.present();
    });

  }
}
