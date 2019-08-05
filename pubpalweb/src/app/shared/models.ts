import { TemplateRef } from '@angular/core';

export interface APIResponse {
    status: string;
    result: any;
    errormessage: any;
}

export interface UserModel {
    _id?: string;
    email: string;
    enabled?: boolean;
    firstname: string;
    lastname: string;
}

export interface IModalHeader {
    modalTitle?: string;
    closeOperation?(): any;
}

export interface IModalBody {
    bodyTemplate: TemplateRef<any> | any;
    bodyContent?: any;
    modalSize?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
}

export interface IModalFooterButton {
    buttonText: string;
    buttonOperation(): any;
}

export interface IModalFooter {
    modalButtons?: IModalFooterButton[];
}
