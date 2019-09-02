import { Component, OnInit } from '@angular/core';
import { Purchase, APIResponse, ChangePurchaseStatusRequest } from 'src/app/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/providers/user.service';
import { LoadingService } from 'src/app/providers/loading.service';
import { PurchaseService } from 'src/app/providers/purchase.service';

@Component({
  selector: 'app-purchasestatus',
  templateUrl: './purchasestatus.component.html',
  styleUrls: ['./purchasestatus.component.scss']
})
export class PurchasestatusComponent implements OnInit {
  purchaseid: string;
  purchase: Purchase;

  cancelcomments: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private userSvc: UserService,
    private router: Router,
    private loadingSvc: LoadingService,
    private purchaseSvc: PurchaseService) { }

  ngOnInit() {
    this.purchaseid = this.activeRoute.snapshot.params['id'];
    this.loadData();
    this.userSvc.userLoaded.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    if (this.userSvc.user) {
      this.loadingSvc.addMessage('GettingPurchase', 'Getting purchase details...');
      this.purchaseSvc.getPurchaseForUserById(this.purchaseid).subscribe((res: APIResponse) => {
        this.purchase = res.result as Purchase;
        this.loadingSvc.removeMessage('GettingPurchase');
      });
    }
  }

  cancelPurchase() {
    const cancelReq: ChangePurchaseStatusRequest = {
      purchaseid: this.purchaseid,
      status: 'cancelled',
      message: this.cancelcomments
    };
    this.loadingSvc.addMessage('CancelPurchase', 'Cancelling Purchase...');
    this.purchaseSvc.cancelPurchaseByUser(this.userSvc.user._id, cancelReq).subscribe((res: APIResponse) => {
      this.router.navigate(['purchasehistory']);
      this.loadingSvc.removeMessage('CancelPurchase');
    });
  }

  resetForm() {
    this.cancelcomments = '';
  }
}
