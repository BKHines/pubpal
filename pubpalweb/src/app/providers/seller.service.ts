import { Injectable, EventEmitter } from '@angular/core';
import { SellerModel, APIResponse, PurchasableItemModel } from '../shared/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PubpalcryptoService } from './pubpalcrypto.service';
import { LocalstoreService } from './localstore.service';
import { CONSTANTS } from '../shared/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  seller: SellerModel;
  authToken: string;

  loginComplete: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private pubpalCryptoSvc: PubpalcryptoService,
    private localStoreSvc: LocalstoreService) { }

  login(email: string, password: string) {
    this.pubpalCryptoSvc.getIp().subscribe((ipres: APIResponse) => {
      const IP = ipres.result;
      const KEY = this.pubpalCryptoSvc.getKey(password);

      this.authToken = this.pubpalCryptoSvc.generateToken(email, KEY, IP);

      this.getSellerByEmail(email).subscribe((sellerres) => {
        this.seller = sellerres.result;
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_USEREMAIL, this.seller.email);
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_KEY, KEY);
        this.loginComplete.emit(true);
      }, (err) => {
        this.loginComplete.emit(false);
      });
    }, (err) => {
      this.loginComplete.emit(false);
    });
  }

  getSellerById(id: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.get<APIResponse>(`api/seller/getsellerbyid`, { params });
  }

  getSellerByEmail(email: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('email', email);

    return this.http.get<APIResponse>(`api/seller/getsellerbyemail`, { params });
  }

  getSellerByName(name: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('name', name);

    return this.http.get<APIResponse>(`api/seller/getsellerbyname`, { params });
  }

  addSeller(seller: SellerModel): Observable<APIResponse> {
    return this.http.post<APIResponse>(`api/seller`, seller);
  }

  updateSeller(seller: SellerModel): Observable<APIResponse> {
    return this.http.put<APIResponse>(`api/seller`, seller);
  }

  addPurchasableItem(id: string, item: PurchasableItemModel): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse>(`api/seller/additem`, item, { params });
  }

  deletePurchasableItem(id: string, itemid: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id)
      .set('itemid', itemid);

    return this.http.put<APIResponse>(`api/seller/deleteitem`, null, { params });
  }

  deleteseller(id: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse>(`api/seller/deleteseller`, null, { params });
  }

  disableseller(id: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse>(`api/seller/disableseller`, null, { params });
  }

  logout() {
    this.seller = null;
    this.authToken = '';
  }
}
