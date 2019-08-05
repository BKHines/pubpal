import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { APIResponse, UserModel } from '../shared/models';
import { PubpalcryptoService } from './pubpalcrypto.service';
import { LocalstoreService } from './localstore.service';
import { CONSTANTS } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: UserModel;
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

      this.getUserByEmail(email).subscribe((userres) => {
        this.user = userres.result;
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_USEREMAIL, this.user.email);
        this.localStoreSvc.set(CONSTANTS.KEY_STORE_KEY, KEY);
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
    this.authToken = '';
  }
}
