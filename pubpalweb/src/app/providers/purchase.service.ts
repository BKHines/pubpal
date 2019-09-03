import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APIResponse, Purchase, ChangePurchaseStatusRequest } from '../shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient) { }

  getSellerOptionsById(sellerId: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', sellerId);

    return this.http.get<APIResponse>(`api/purchase/getselleroptionsbyid`, { params });
  }

  getSellerOptionByIds(sellerId: string, optionId: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', sellerId)
      .set('optionId', optionId);

    return this.http.get<APIResponse>(`api/purchase/getselleroptionbyids`, { params });
  }

  getPurchasesByUserId(personid: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('personid', personid);

    return this.http.get<APIResponse>(`api/purchase/getpurchasesbyuserid`, { params });
  }

  getPurchaseForUserById(purchaseid: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', purchaseid);

    return this.http.get<APIResponse>(`api/purchase/GetPurchaseForUserById`, { params });
  }

  createPurchase(purchase: Purchase): Observable<APIResponse> {
    return this.http.post<APIResponse>(`api/purchase/createpurchasebyuser`, purchase);
  }

  updatePurchaseByUser(purchase: Purchase): Observable<APIResponse> {
    return this.http.put<APIResponse>(`api/purchase/updatepurchasebyuser`, purchase);
  }

  cancelPurchaseByUser(id: string, changeStatusReq: ChangePurchaseStatusRequest): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse>(`api/purchase/cancelpurchasebyuser`, changeStatusReq, { params });
  }

  getPurchasesBySellerId(personid: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('personid', personid);

    return this.http.get<APIResponse>(`api/purchase/getpurchasesbysellerid`, { params });
  }

  getPurchaseForSellerById(purchaseid: string): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', purchaseid);

    return this.http.get<APIResponse>(`api/purchase/GetPurchaseForSellerById`, { params });
  }

  changePurchaseStatusBySeller(id: string, changeStatusReq: ChangePurchaseStatusRequest): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse>(`api/purchase/changepurchasestatusbyseller`, changeStatusReq, { params });
  }

  cancelPurchaseBySeller(id: string, changeStatusReq: ChangePurchaseStatusRequest): Observable<APIResponse> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse>(`api/purchase/cancelpurchasebyseller`, changeStatusReq, { params });
  }
}
