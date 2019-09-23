import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, Cart, CartPurchase } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  getCartById(id: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.get<APIResponse>(`api/cart/getcartbyid`, { params });
  }

  getCartByUserId(userid: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('userid', userid);

    return this.http.get<APIResponse>(`api/cart/getcartbyuserid`, { params });
  }

  getCartPurchaseByCartPurchaseId(id: string, cartpurchaseid: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id)
      .set('cartpurchaseid', cartpurchaseid);

    return this.http.get<APIResponse>(`api/cart/getcartpurchasebycartpurchaseid`, { params });
  }

  createCart(cart: Cart): Observable<APIResponse> {
    return this.http.post<APIResponse>(`api/cart`, cart);
  }

  addPurchaseToCart(id: string, cartPurchase: CartPurchase): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.patch<APIResponse>(`api/cart/addpurchasetocart`, cartPurchase, { params });
  }

  removePurchaseFromCart(id: string, cartpurchaseid: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id)
      .set('cartpurchaseid', cartpurchaseid);

    return this.http.patch<APIResponse>(`api/cart/removepurchasefromcart`, null, { params });
  }

  deleteCart(id: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse>(`api/cart/deletecart`, null, { params });
  }

  makePurchase(id: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse>(`api/cart/makepurchases`, null, { params });
  }
}
