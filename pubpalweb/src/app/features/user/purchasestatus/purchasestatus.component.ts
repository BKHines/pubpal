import { Component, OnInit } from '@angular/core';
import { Purchase, APIResponse } from 'src/app/shared/models';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/providers/user.service';

@Component({
  selector: 'app-purchasestatus',
  templateUrl: './purchasestatus.component.html',
  styleUrls: ['./purchasestatus.component.scss']
})
export class PurchasestatusComponent implements OnInit {
  purchaseid: string;
  purchase: Purchase;

  constructor(private activeRoute: ActivatedRoute, private userSvc: UserService) { }

  ngOnInit() {
    this.purchaseid = this.activeRoute.snapshot.params['id'];
    this.loadData();
    this.userSvc.userLoaded.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    if (this.userSvc.user) {
      this.userSvc.getPurchaseById(this.purchaseid).subscribe((res: APIResponse) => {
        this.purchase = res.result as Purchase;
      });
    }
  }
}
