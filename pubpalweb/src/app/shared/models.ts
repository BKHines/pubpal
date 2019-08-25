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

export interface SellerModel extends UserModel {
    place: PlaceModel;
    items?: PurchasableItemModel[];
}

export interface AddressModel {
    address: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
    county?: string;
    country?: string;
}

export interface PlaceModel {
    name: string;
    description?: string;
    address: AddressModel;
}

export interface Ingredient {
    id: number;
    ingredient: string;
    description?: string;
    upcharge: number;
}

export interface PurchasableItemModel {
    id: string;
    name: string;
    description?: string;
    price: number;
    baseingredient: string;
    requireingredients: boolean;
    ingredients?: Ingredient[];
}

export interface IModalHeader {
    modalTitle?: string;
    closeOperation?(): any;
}

export interface IModalBody {
    bodyTemplate: TemplateRef<any> | any;
    bodyContent?: any;
    modalSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface IModalFooterButton {
    buttonText: string;
    buttonClass?: string;
    buttonOperation(): any;
}

export interface IModalFooter {
    modalButtons?: IModalFooterButton[];
}

export interface ChangePasswordRequest {
    id: string;
    newpassword: string;
    confirmpassword: string;
}

export interface PurchaseHistory {
    purchasestatus: 'ordered' | 'accepted' | 'inprogress' | 'ready' | 'pickedup' | 'cancelled';
    statusdate: string;
    message?: string;
}

export interface Purchase {
    _id?: string;
    userid: string;
    sellerid: string;
    itemname: string;
    ingredients: string[];
    price: number;
    fee: number;
    tip: number;
    instructions?: string;
    currentstatus: 'ordered' | 'accepted' | 'inprogress' | 'ready' | 'pickedup' | 'cancelled';
    purchasehistory: PurchaseHistory[];
}

export interface ChangePurchaseStatusRequest {
    purchaseid?: string;
    status: 'ordered' | 'accepted' | 'inprogress' | 'ready' | 'pickedup' | 'cancelled';
    message?: string;
}
