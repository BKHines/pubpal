import { TemplateRef } from '@angular/core';

export interface APIResponse {
    status: string;
    result: any;
    errormessage: any;
}

export interface PersonModel {
    _id?: string;
    email: string;
    enabled?: boolean;
    firstname: string;
    lastname: string;
}

export interface UserModel extends PersonModel {
    waivedfeetokens: number;
}

export interface SellerModel extends PersonModel {
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
    category: string;
}

export interface PurchasableItemModel {
    id: string;
    name: string;
    description?: string;
    price: number;
    baseingredient: string;
    category?: string;
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

export type StatusType = 'ordered' | 'accepted' | 'inprogress' | 'ready' | 'pickedup' | 'cancelled';
export type StatusText = 'Accept' | 'In Progress' | 'Ready' | 'Picked Up' | 'Complete' | 'Unknown';

export interface PurchaseHistory {
    purchasestatus: StatusType;
    statusdate: string;
    message?: string;
}

export interface Purchase {
    _id?: string;
    userid: string;
    customername: string;
    sellerid: string;
    itemname: string;
    ingredients: string[];
    price: number;
    fee: number;
    feewaived: boolean;
    tip: number;
    instructions?: string;
    currentstatus: StatusType;
    purchasehistory: PurchaseHistory[];
}

export interface ChangePurchaseStatusRequest {
    purchaseid?: string;
    status: StatusType;
    message?: string;
}
