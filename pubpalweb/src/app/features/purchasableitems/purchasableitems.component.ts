import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from 'src/app/providers/modal.service';
import { PurchasableitementryComponent } from '../purchasableitementry/purchasableitementry.component';
import { BsModalRef } from 'ngx-bootstrap/modal/public_api';
import { CONSTANTS } from 'src/app/shared/constants';
import { SellerService } from 'src/app/providers/seller.service';
import { PurchasableItemModel } from 'src/app/shared/models';

@Component({
  selector: 'app-purhcasableitems',
  templateUrl: './purchasableitems.component.html',
  styleUrls: ['./purchasableitems.component.scss']
})
export class PurchasableitemsComponent implements OnInit {
  addItemModal: BsModalRef;
  deleteConfirmModal: BsModalRef;
  @ViewChild('deletConfirm', { static: true }) deleteConfirmTemplate: TemplateRef<any>;

  constructor(
    private modalSvc: ModalService,
    public sellerSvc: SellerService) { }

  ngOnInit() {
  }

  showAddItemModal() {
    const _modHeader = this.modalSvc.createHeader('Add Menu Item', () => { this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASEITEM_ENTRY); });
    const _modBody = this.modalSvc.createBody(PurchasableitementryComponent, null, 'xl');
    this.addItemModal = this.modalSvc.showModal(CONSTANTS.MODAL_PURCHASEITEM_ENTRY, _modBody, _modHeader, null, true, false, 'modal-no-padding-body');
  }

  showEditItemModal(editPI: PurchasableItemModel) {
    const _modHeader = this.modalSvc.createHeader('Edit Menu Item', () => { this.modalSvc.hideModal(CONSTANTS.MODAL_PURCHASEITEM_ENTRY); });
    const _modBody = this.modalSvc.createBody(PurchasableitementryComponent, { piId: editPI.id }, 'xl');
    this.addItemModal = this.modalSvc.showModal(CONSTANTS.MODAL_PURCHASEITEM_ENTRY, _modBody, _modHeader, null, true, false, 'modal-no-padding-body');
  }

  showDeleteConfirmationModal(id: string) {
    const _modHeader = this.modalSvc.createHeader('Delete Menu Item');
    const _modBody = this.modalSvc.createBody(this.deleteConfirmTemplate, null, 'md');
    const _modFooter = this.modalSvc.createFooter([
      {
        buttonText: 'Delete',
        buttonClass: 'btn-danger',
        buttonOperation: () => {
          this.sellerSvc.deletePurchasableItem(this.sellerSvc.seller._id, id).subscribe((res) => {
            if (res.result) {
              this.sellerSvc.seller.items = this.sellerSvc.seller.items.filter(a => a.id !== id);
              this.deleteConfirmModal.hide();
            }
          });
        }
      }, {
        buttonText: 'Cancel',
        buttonClass: 'btn-success',
        buttonOperation: () => {
          this.deleteConfirmModal.hide();
        }
      }
    ]);
    this.deleteConfirmModal = this.modalSvc.showModal(CONSTANTS.MODAL_PURCHASEITEM_ENTRY, _modBody, _modHeader, _modFooter);
  }
}
