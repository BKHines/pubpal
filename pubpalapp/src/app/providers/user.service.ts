import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { APIResponse, UserModel, ChangePasswordRequest, SellerTagModel, SellerModel, SellerName } from '../shared/models';
import { LocalstoreService } from './localstore.service';
import { CONSTANTS } from '../shared/constants';
import { TokenService } from './token.service';
// import { CartService } from './cart.service';

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

  currentHours: number;

  userLoaded: EventEmitter<void> = new EventEmitter<void>();
  loginComplete: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private tokenSvc: TokenService,
    // private cartSvc: CartService,
    private localStoreSvc: LocalstoreService) { }

  login(email: string, password: string) {
    this.tokenSvc.getIp().subscribe((ipres) => {
      const IP = ipres.result;
      const KEY = this.tokenSvc.getKey(password);

      this.tokenSvc.authToken = this.tokenSvc.generateToken(email, KEY, IP);

      this.getUserByEmail(email).subscribe((userres) => {
        this.user = userres.result;
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_USEREMAIL, this.user.email);
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_KEY, KEY);
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_USERTYPE, 'user');
        this.loginComplete.emit(true);
        // this.cartSvc.loadCart(this.user._id);
      }, (err) => {
        this.loginComplete.emit(false);
      });
    }, (err) => {
      this.loginComplete.emit(false);
    });
  }

  getUserById(id: string): Observable<APIResponse<UserModel>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.get<APIResponse<UserModel>>(`api/user/getuserbyid`, { params });
  }

  getUserByEmail(email: string): Observable<APIResponse<UserModel>> {
    const params: HttpParams = new HttpParams()
      .set('email', email);

    return this.http.get<APIResponse<UserModel>>(`api/user/getuserbyemail`, { params });
  }

  getUserByName(name: string): Observable<APIResponse<UserModel>> {
    const params: HttpParams = new HttpParams()
      .set('name', name);

    return this.http.get<APIResponse<UserModel>>(`api/user/getuserbyname`, { params });
  }

  addUser(user: UserModel): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`api/user`, user);
  }

  updateUser(user: UserModel): Observable<APIResponse<boolean>> {
    return this.http.put<APIResponse<boolean>>(`api/user`, user);
  }

  changePassword(cpr: ChangePasswordRequest): Observable<APIResponse<boolean>> {
    return this.http.put<APIResponse<boolean>>(`api/user/updatepassword`, cpr);
  }

  deleteUser(id: string): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse<boolean>>(`api/user/deleteuser`, null, { params });
  }

  disableUser(id: string): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse<boolean>>(`api/user/disableuser`, null, { params });
  }

  logout() {
    this.user = null;
    this.tokenSvc.authToken = '';
  }

  getSellersNearMe(lat: number, lng: number, miles: number): Observable<APIResponse<SellerModel[]>> {
    const params: HttpParams = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('miles', miles.toString());

    return this.http.get<APIResponse<SellerModel[]>>(`api/user/getsellersbylocation`, { params });
  }

  addFavorite(userid: string, sellerid: string): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('userid', userid)
      .set('sellerid', sellerid);

    return this.http.put<APIResponse<boolean>>(`api/user/addfavorite`, null, { params });
  }

  removeFavorite(userid: string, sellerid: string): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('userid', userid)
      .set('sellerid', sellerid);

    return this.http.put<APIResponse<boolean>>(`api/user/removefavorite`, null, { params });
  }

  addTag(sellerid: string, tag: SellerTagModel): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('sellerid', sellerid);

    return this.http.put<APIResponse<boolean>>(`api/user/addsellertagbyuser`, tag, { params });
  }

  removeTag(sellerid: string, tag: SellerTagModel): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('sellerid', sellerid);

    return this.http.put<APIResponse<boolean>>(`api/user/removesellertagbyuser`, tag, { params });
  }

  getSellerNamesByIds(sellerids: string[]): Observable<APIResponse<SellerName[]>> {
    return this.http.put<APIResponse<SellerName[]>>(`api/user/getsellernamesbyids`, sellerids);
  }

  getSellerTags(userid: string, sellerid: string): Observable<APIResponse<SellerTagModel[]>> {
    const params: HttpParams = new HttpParams()
      .set('userid', userid)
      .set('sellerid', sellerid);

    return this.http.get<APIResponse<SellerTagModel[]>>(`api/user/getsellertagsforuser`, { params });
  }

  getSellersByTagSearch(searchText: string, lat?: number, lng?: number): Observable<APIResponse<SellerModel[]>> {
    let params: HttpParams = new HttpParams();

    if (lat && lng) {
      params = new HttpParams().set('tagSearchText', searchText).set('lat', lat.toString()).set('lng', lng.toString());
    } else {
      params = new HttpParams().set('tagSearchText', searchText);
    }

    return this.http.get<APIResponse<SellerModel[]>>(`api/user/getsellersbytagsearch`, { params });
  }
}
