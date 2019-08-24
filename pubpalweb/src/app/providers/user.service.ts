import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { APIResponse, UserModel, ChangePasswordRequest, Purchase, ChangePurchaseStatusRequest } from '../shared/models';
import { PubpalcryptoService } from './pubpalcrypto.service';
import { LocalstoreService } from './localstore.service';
import { CONSTANTS } from '../shared/constants';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user: UserModel;
  get user(): UserModel {
    return this._user;
  }

  set user(value: UserModel) {
    this._user = value;
    this.userLoaded.emit();
  }

  userLoaded: EventEmitter<void> = new EventEmitter<void>();
  loginComplete: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private tokenSvc: TokenService,
    private pubpalCryptoSvc: PubpalcryptoService,
    private localStoreSvc: LocalstoreService) { }

  login(email: string, password: string) {
    this.pubpalCryptoSvc.getIp().subscribe((ipres: APIResponse) => {
      const IP = ipres.result;
      const KEY = this.pubpalCryptoSvc.getKey(password);

      this.tokenSvc.authToken = this.pubpalCryptoSvc.generateToken(email, KEY, IP);

      this.getUserByEmail(email).subscribe((userres) => {
        this.user = userres.result;
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_USEREMAIL, this.user.email);
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_KEY, KEY);
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_USERTYPE, 'user');
        this.loginComplete.emit(true);
      }, (err) => {
        this.loginComplete.emit(false);
      });
    }, (err) => {
      this.loginComplete.emit(false);
    });
  }

  getUserById(id: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.get<APIResponse>(`api/user/getuserbyid`, { params });
  }

  getUserByEmail(email: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('email', email);

    return this.http.get<APIResponse>(`api/user/getuserbyemail`, { params });
  }

  getUserByName(name: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('name', name);

    return this.http.get<APIResponse>(`api/user/getuserbyname`, { params });
  }

  addUser(user: UserModel): Observable<APIResponse> {
    return this.http.post<APIResponse>(`api/user`, user);
  }

  updateUser(user: UserModel): Observable<APIResponse> {
    return this.http.put<APIResponse>(`api/user`, user);
  }

  changePassword(cpr: ChangePasswordRequest): Observable<APIResponse> {
    return this.http.put<APIResponse>(`api/user/updatepassword`, cpr);
  }

  deleteUser(id: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse>(`api/user/deleteuser`, null, { params });
  }

  disableUser(id: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse>(`api/user/disableuser`, null, { params });
  }

  logout() {
    this.user = null;
    this.tokenSvc.authToken = '';
  }

  getSellerOptionsById(sellerId: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', sellerId);

    return this.http.get<APIResponse>(`api/user/getselleroptionsbyid`, { params });
  }

  getSellerOptionByIds(sellerId: string, optionId: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', sellerId)
      .set('optionId', optionId);

    return this.http.get<APIResponse>(`api/user/getselleroptionbyids`, { params });
  }

  getPurchasesById(personid: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('personid', personid);

    return this.http.get<APIResponse>(`api/user/getpurchasesbyuserid`, { params });
  }

  getPurchaseById(purchaseid: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', purchaseid);

    return this.http.get<APIResponse>(`api/user/GetPurchaseForUserById`, { params });
  }

  getSellersNearMe(lat: number, lng: number, miles: number): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('miles', miles.toString());

    return this.http.get<APIResponse>(`api/user/getsellersbylocation`, { params });
  }

  createPurchase(purchase: Purchase): Observable<APIResponse> {
    return this.http.post<APIResponse>(`api/usercreatepurchasebyuser`, purchase);
  }

  updatePurchase(purchase: Purchase): Observable<APIResponse> {
    return this.http.put<APIResponse>(`api/user/updatepurchasebyuser`, purchase);
  }

  cancelPurchase(id: string, changeStatusReq: ChangePurchaseStatusRequest): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse>(`api/user/cancelpurchasebyuser`, changeStatusReq, { params });
  }
}
