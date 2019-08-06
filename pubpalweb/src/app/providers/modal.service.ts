import { Injectable, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalcontainerComponent } from '../shared/modalcontainer/modalcontainer.component';
import { IModalHeader, IModalBody, IModalFooterButton, IModalFooter } from '../shared/models';
import { LoadingComponent } from '../shared/loading/loading.component';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  bsModalRef: BsModalRef;

  constructor(
    private bsModalSvc: BsModalService,
    private loadingSvc: LoadingService
  ) {
    this.loadingSvc.messagesUpdated.subscribe(() => {
      console.log(`${this.loadingSvc.messages.length}`);
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

  createBody(modalBody: TemplateRef<any> | any, modalContent?: any, modalSize?: 'xs' | 'sm' | 'md' | 'lg' | 'full'): IModalBody {
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
      ignoreBackdropClick,
      keyboard: enableKeyboard
    };

    const _modalRef = this.bsModalSvc.show(ModalcontainerComponent, _modalOptions);

    return _modalRef;
  }

  showLoadingModal() {
    const _modBody = this.createBody(LoadingComponent, null, 'md');
    this.bsModalRef = this.showModal(_modBody, null, null, true, false, 'bg-primary modal-no-padding loading-modal');
  }

  hideLoadingModal() {
    setTimeout(() => {
      this.bsModalRef.hide();
    }, 200);
  }
}
