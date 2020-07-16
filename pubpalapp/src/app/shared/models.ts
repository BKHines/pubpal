import { TemplateRef } from '@angular/core';

export interface APIResponse<T> {
    status: string;
    result: T;
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
    feediscount: number;
    favorites?: string[];
}

export interface SellerModel extends PersonModel {
    place: PlaceModel;
    fee?: number;
    items?: PurchasableItemModel[];
    tags?: SellerTagModel[];
}

export interface SellerTagModel {
    tag: string;
    userid: string;
}

export interface AddressModel {
    address: string;
    city: string;
    state: string;
    zip: string;
    county?: string;
    country?: string;
}

export interface LocationModel {
    type: string;
    coordinates: number[];
}

export interface PlaceModel {
    name: string;
    description?: string;
    imageurl?: string;
    address: AddressModel;
    location: LocationModel;
}

export interface Ingredient {
    id: number;
    ingredient: string;
    description?: string;
    upcharge: number;
    category: string;
    unavailable?: boolean;
}

export interface PurchasableItemModel {
    id: string;
    name: string;
    description?: string;
    price: number;
    baseingredient: string;
    category?: string;
    ingredients?: Ingredient[];
    unavailable?: boolean;
    iconurl?: string;
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

export interface ChangePasswordResetRequest {
    email: string;
    newpassword: string;
    confirmpassword: string;
    resetid: string;
    ip: string;
}

export type StatusType = 'ordered' | 'accepted' | 'inprogress' | 'ready' | 'pickedup' | 'cancelled';
export type StatusText = 'Accept' | 'In Progress' | 'Ready' | 'Picked Up' | 'Complete' | 'Unknown';
export type StatusDisplayText = 'ordered' | 'accepted' | 'in progress' | 'ready to be picked up' | 'picked up' | 'completed' | 'cancelled';
export type ServiceType = 'paypal';

export interface PurchaseHistory {
    purchasestatus: StatusType;
    statusdate: string;
    message?: string;
}

export interface PurchaseCreateWithResponse {
    purchaseid: string;
    responseurl: string;
}

export interface PurchaseWithServiceType {
    purchase: Purchase;
    servicetype: ServiceType;
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
    category?: string;
    instructions?: string;
    currentstatus: StatusType;
    purchasehistory: PurchaseHistory[];
    paid: boolean;
}

export interface CartPurchase extends Purchase {
    cartid?: string;
}

export interface Cart {
    _id?: string;
    purchases: CartPurchase[];
}

export interface ChangePurchaseStatusRequest {
    purchaseid?: string;
    status: StatusType;
    message?: string;
}

export interface SellerName {
    name: string;
    sellerid: string;
}
