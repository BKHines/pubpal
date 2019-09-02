import { Injectable, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalcontainerComponent } from '../shared/modalcontainer/modalcontainer.component';
import { IModalHeader, IModalBody, IModalFooterButton, IModalFooter } from '../shared/models';
import { LoadingComponent } from '../shared/loading/loading.component';
import { LoadingService } from './loading.service';
import { CONSTANTS } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  bsModalRefs: { key: string, modal: BsModalRef }[];

  constructor(
    private bsModalSvc: BsModalService,
    private loadingSvc: LoadingService
  ) {
    this.bsModalRefs = [];
    this.loadingSvc.messagesUpdated.subscribe(() => {
      if (this.loadingSvc.messages.length === 0) {
        this.hideLoadingModal();
      } else {
        this.showLoadingModal();
      }
    });
  }

  createHeader(modalTitle?: string, closeOperation?: any): IModalHeader {
    const _modalHeader: IModalHeader = {
      modalTitle,
      closeOperation
    };

    return _modalHeader;
  }

  createBody(modalBody: TemplateRef<any> | any, modalContent?: any, modalSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): IModalBody {
    const _modalBody: IModalBody = {
      bodyTemplate: modalBody,
      bodyContent: modalContent,
      modalSize
    };

    return _modalBody;
  }

  createFooter(modalButtons: IModalFooterButton[]): IModalFooter {
    const _modalFooter: IModalFooter = {
      modalButtons
    };

    return _modalFooter;
  }

  showModal(
    key: string,
    _modalBody: IModalBody,
    _modalHeader?: IModalHeader,
    _modalFooter?: IModalFooter,
    ignoreBackdropClick?: boolean,
    enableKeyboard?: boolean,
    cssClass?: string
  ): BsModalRef {
    let _initState = {};

    if (_modalBody.bodyContent) {
      let _bodyContentData = {};
      for (const propKey in _modalBody.bodyContent) {
        if (_modalBody.bodyContent.hasOwnProperty(propKey)) {
          _bodyContentData[propKey] = _modalBody.bodyContent[propKey];
        }
      }
      _initState['bodyContentData'] = _bodyContentData;
    }

    if (_modalHeader) {
      if (_modalHeader.modalTitle) {
        _initState['title'] = _modalHeader.modalTitle;
      }

      if (_modalHeader.closeOperation) {
        _initState['closeOperation'] = _modalHeader.closeOperation;
      }
    }

    _initState['bodyTemplate'] = _modalBody.bodyTemplate;

    if (_modalFooter && _modalFooter.modalButtons) {
      _initState['footerButtons'] = _modalFooter.modalButtons;
    }

    let _modalOptions: ModalOptions = {
      initialState: _initState,
      class: `pubpal-modal modal-${_modalBody.modalSize ? _modalBody.modalSize : 'md'}${cssClass ? ' ' + cssClass : ''}`,
      animated: true,
      ignoreBackdropClick: ignoreBackdropClick ? ignoreBackdropClick : true,
      keyboard: enableKeyboard ? enableKeyboard : false
    };

    const _bsModalRef = this.bsModalSvc.show(ModalcontainerComponent, _modalOptions);
    this.bsModalRefs.push({ key, modal: _bsModalRef });
    // console.log(this.bsModalRefs, key);

    return _bsModalRef;
  }

  hideModal(key: string) {
    console.log(`${this.bsModalRefs.length}`, key, 'hideModal');
    const _modalIndex = this.bsModalRefs.findIndex(a => a.key === key);
    const _modalRef = this.bsModalRefs.find(a => a.key === key);
    if (_modalRef) {
      _modalRef.modal.hide();
    }
    this.bsModalRefs.splice(_modalIndex, 1);
    // console.log(`${this.bsModalRefs.length}`, key, 'hideModal');
  }

  showLoadingModal() {
    if (!this.bsModalRefs.find(a => a.key === CONSTANTS.MODAL_LOADING)) {
      const _modBody = this.createBody(LoadingComponent, null, 'md');
      this.showModal(CONSTANTS.MODAL_LOADING, _modBody, null, null, true, false, 'bg-primary modal-no-padding loading-modal');
    }
  }

  hideLoadingModal() {
    setTimeout(() => {
      // console.log(`${this.bsModalRefs.length}`, 'hideLoadingModal');
      const _modalIndex = this.bsModalRefs.findIndex(a => a.key === CONSTANTS.MODAL_LOADING);
      const _modalRef = this.bsModalRefs.find(a => a.key === CONSTANTS.MODAL_LOADING);
      if (_modalRef) {
        _modalRef.modal.hide();
      }
      this.bsModalRefs.splice(_modalIndex, 1);
      // console.log(`${this.bsModalRefs.length}`, 'hideLoadingModal');
    }, 300);
  }
}
