import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, Cart, CartPurchase } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: Cart;
  cartLoaded: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient) { }

  loadCart(userid: string) {
    this.getCartByUserId(userid).subscribe((res) => {
      this.cart = res.result;
      this.cartLoaded.emit();
    });
  }

  getCartById(id: string): Observable<APIResponse<Cart>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.get<APIResponse<Cart>>(`api/cart/getcartbyid`, { params });
  }

  getCartByUserId(userid: string): Observable<APIResponse<Cart>> {
    const params: HttpParams = new HttpParams()
      .set('userid', userid);

    return this.http.get<APIResponse<Cart>>(`api/cart/getcartbyuserid`, { params });
  }

  getCartPurchaseByCartPurchaseId(id: string, cartpurchaseid: string): Observable<APIResponse<CartPurchase>> {
    const params: HttpParams = new HttpParams()
      .set('id', id)
      .set('cartpurchaseid', cartpurchaseid);

    return this.http.get<APIResponse<CartPurchase>>(`api/cart/getcartpurchasebycartpurchaseid`, { params });
  }

  createCart(cart: Cart): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`api/cart`, cart);
  }

  addPurchaseToCart(id: string, cartPurchase: CartPurchase): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.patch<APIResponse<boolean>>(`api/cart/addpurchasetocart`, cartPurchase, { params });
  }

  removePurchaseFromCart(id: string, cartpurchaseid: string): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id)
      .set('cartpurchaseid', cartpurchaseid);

    return this.http.patch<APIResponse<boolean>>(`api/cart/removepurchasefromcart`, null, { params });
  }

  deleteCart(id: string): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse<boolean>>(`api/cart/deletecart`, null, { params });
  }

  makePurchase(id: string): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse<boolean>>(`api/cart/makepurchases`, null, { params });
  }
}
