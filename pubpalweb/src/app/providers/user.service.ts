import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, UserModel } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: UserModel;
  authToken: string;

  constructor(private http: HttpClient) { }

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
