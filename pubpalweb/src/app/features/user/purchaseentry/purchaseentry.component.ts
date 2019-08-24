import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { PurchasableItemModel, APIResponse, Purchase } from 'src/app/shared/models';

@Component({
  selector: 'app-purchaseentry',
  templateUrl: './purchaseentry.component.html',
  styleUrls: ['./purchaseentry.component.scss']
})
export class PurchaseentryComponent implements OnInit {
  @Input() purchaseId: string;
  @Input() optionId: string;
  @Input() sellerId: string;

  purchase: Purchase;
  option: PurchasableItemModel;

  constructor(private userSvc: UserService) { }

  ngOnInit() {
    if (this.purchaseId) {
      this.userSvc.getPurchaseById(this.purchaseId).subscribe((res: APIResponse) => {
        this.purchase = res.result;
      });
    }

    if (this.optionId) {
      this.userSvc.getSellerOptionByIds(this.sellerId, this.optionId).subscribe((res: APIResponse) => {
        this.option = res.result;
      });
    }
  }

}
