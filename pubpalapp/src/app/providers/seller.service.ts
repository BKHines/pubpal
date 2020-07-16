import { Injectable, EventEmitter } from '@angular/core';
import { SellerModel, APIResponse, ChangePasswordRequest, PurchasableItemModel } from '../shared/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TokenService } from './token.service';
import { LocalstoreService } from './localstore.service';
import { CONSTANTS } from '../shared/constants';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SellerService extends BaseService {
  private _seller: SellerModel;
  get seller(): SellerModel {
    return this._seller;
  }

  set seller(value: SellerModel) {
    this._seller = value;
    if (value) {
      if (!this.seller.place.location) {
        this.seller.place.location = {
          type: 'Point',
          coordinates: [0, 0]
        };
      }
      this.sellerLoaded.emit();
    }
  }

  sellerLoaded: EventEmitter<void> = new EventEmitter<void>();

  loginComplete: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private tokenSvc: TokenService,
    private localStoreSvc: LocalstoreService,
    private commonSvc: CommonService
  ) {
    super();
  }

  login(email: string, password: string) {
    this.tokenSvc.getIp().subscribe((ipres) => {
      const IP = ipres.result;
      const KEY = this.tokenSvc.getKey(password);

      this.tokenSvc.authToken = this.tokenSvc.generateToken(email, KEY, IP);

      this.getSellerByEmail(email).subscribe((sellerres) => {
        this.seller = sellerres.result;
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_USEREMAIL, this.seller.email);
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_KEY, KEY);
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_USERTYPE, 'seller');
        this.loginComplete.emit(true);
      }, (err) => {
        this.loginComplete.emit(false);
        this.commonSvc.showAlertMessage(`LOGIN: ${err}`);
      });
    }, (err) => {
      this.loginComplete.emit(false);
      this.commonSvc.showAlertMessage(`IP: ${err}`);
    });
  }

  getSellerById(id: string): Observable<APIResponse<SellerModel>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.get<APIResponse<SellerModel>>(`api/seller/getsellerbyid`, { params });
  }

  getSellerByEmail(email: string): Observable<APIResponse<SellerModel>> {
    const params: HttpParams = new HttpParams()
      .set('email', email);

    return this.http.get<APIResponse<SellerModel>>(`api/seller/getsellerbyemail`, { params });
  }

  getSellerByName(name: string): Observable<APIResponse<SellerModel>> {
    const params: HttpParams = new HttpParams()
      .set('name', name);

    return this.http.get<APIResponse<SellerModel>>(`api/seller/getsellerbyname`, { params });
  }

  addSeller(seller: SellerModel): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`api/seller`, seller);
  }

  updateSeller(seller: SellerModel): Observable<APIResponse<boolean>> {
    return this.http.put<APIResponse<boolean>>(`api/seller`, seller);
  }

  changePassword(cpr: ChangePasswordRequest): Observable<APIResponse<boolean>> {
    return this.http.put<APIResponse<boolean>>(`api/seller/updatepassword`, cpr);
  }

  addPurchasableItem(id: string, item: PurchasableItemModel): Observable<APIResponse<string>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse<string>>(`api/seller/additem`, item, { params });
  }

  updatePurchasableItem(id: string, item: PurchasableItemModel): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse<boolean>>(`api/seller/updateitem`, item, { params });
  }

  deletePurchasableItem(id: string, itemid: string): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id)
      .set('itemid', itemid);

    return this.http.put<APIResponse<boolean>>(`api/seller/deleteitem`, null, { params });
  }

  deleteseller(id: string): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse<boolean>>(`api/seller/deleteseller`, null, { params });
  }

  disableseller(id: string): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse<boolean>>(`api/seller/disableseller`, null, { params });
  }

  logout() {
    this.seller = null;
    this.tokenSvc.authToken = '';
  }

  getSellerCategories(id: string): Observable<APIResponse<string[]>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.get<APIResponse<string[]>>(`api/seller/getsellercategories`, { params });
  }
}
