import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/providers/modal.service';
import { PurchasableitementryComponent } from '../purchasableitementry/purchasableitementry.component';
import { BsModalRef } from 'ngx-bootstrap/modal/public_api';
import { CONSTANTS } from 'src/app/shared/constants';

@Component({
  selector: 'app-purhcasableitems',
  templateUrl: './purchasableitems.component.html',
  styleUrls: ['./purchasableitems.component.scss']
})
export class PurchasableitemsComponent implements OnInit {
  bsModalRef: BsModalRef;

  constructor(private modalSvc: ModalService) { }

  ngOnInit() {
  }

  showAddItemModal() {
    const _modHeader = this.modalSvc.createHeader('Add Menu Item', () => { this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASEITEM_ENTRY); });
    const _modBody = this.modalSvc.createBody(PurchasableitementryComponent, null, 'lg');
    this.bsModalRef = this.modalSvc.showModal(CONSTANTS.MODAL_PURCHASEITEM_ENTRY, _modBody, _modHeader, null, true, false, 'modal-no-padding-body');
  }
}
