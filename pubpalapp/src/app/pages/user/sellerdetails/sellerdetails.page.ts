import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/providers/user.service';
import { PurchaseService } from 'src/app/providers/purchase.service';
import { PurchasableItemModel } from 'src/app/shared/models';

@Component({
  selector: 'app-sellerdetails',
  templateUrl: './sellerdetails.page.html',
  styleUrls: ['./sellerdetails.page.scss'],
})
export class SellerdetailsPage implements OnInit {
  sellerId: string;
  purchaseOptions: PurchasableItemModel[];

  constructor(
    private route: ActivatedRoute,
    private userSvc: UserService,
    public purchSvc: PurchaseService
  ) { }

  ngOnInit() {
    this.sellerId = this.route.snapshot.params['id'];

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
        this.purchaseOptions = res.result;
      });
    }

    if (!this.purchSvc.sellerName) {
      this.userSvc.getSellerNamesByIds([this.sellerId]).subscribe((res) => {
        this.purchSvc.sellerName = res.result && res.result.length > 0 ? res.result[0].name : '';
      });
    }
  }
}
