import { Injectable, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalcontainerComponent } from '../shared/modalcontainer/modalcontainer.component';
import { IModalHeader, IModalBody, IModalFooterButton, IModalFooter } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private bsModalSvc: BsModalService) { }

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

  showModal(_modalBody: IModalBody, _modalHeader?: IModalHeader, _modalFooter?: IModalFooter): BsModalRef {
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
      class: `pubpal-modal modal-${_modalBody.modalSize ? _modalBody.modalSize : 'md'}`,
      animated: true
    };

    const _modalRef = this.bsModalSvc.show(ModalcontainerComponent, _modalOptions);

    return _modalRef;
  }
}
