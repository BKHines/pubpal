import { Component, OnInit, Input, TemplateRef, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IModalFooterButton } from '../models';

@Component({
  selector: 'app-modalcontainer',
  templateUrl: './modalcontainer.component.html',
  styleUrls: ['./modalcontainer.component.scss']
})
export class ModalcontainerComponent implements OnInit, AfterViewInit {
  @Input() title: string;
  @Input() closeOperation: any;
  @Input() footerButtons: IModalFooterButton[];

  @Input() bodyTemplate: TemplateRef<any> | any;
  @Input() bodyContentData: any;

  @ViewChild('bodycontainer', { read: ViewContainerRef, static: true }) bodycontainer: ViewContainerRef;

  isComponent: boolean;
  actualTemplateRef: TemplateRef<any>;

  constructor(
    private compFactoryResolver: ComponentFactoryResolver,
    public bsModalRef: BsModalRef) { }

  ngOnInit() {
    if (this.bodyTemplate instanceof TemplateRef) {
      this.actualTemplateRef = this.bodyTemplate;
    }
  }

  ngAfterViewInit() {
    if (!(this.bodyTemplate instanceof TemplateRef)) {
      this.isComponent = true;
      let compFactory = this.compFactoryResolver.resolveComponentFactory(this.bodyTemplate);

      let componentRef = this.bodycontainer.createComponent(compFactory);

      for (let prop in this.bodyContentData) {
        if (this.bodyContentData[prop]) {
          componentRef.instance[prop] = this.bodyContentData[prop];
        }
      }
    }
  }

  callCloseOperation() {
    if (this.closeOperation) {
      this.closeOperation();
    }
    this.bsModalRef.hide();
  }
}
