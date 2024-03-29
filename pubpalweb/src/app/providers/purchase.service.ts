import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APIResponse, Purchase, ChangePurchaseStatusRequest, PurchasableItemModel } from '../shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient) { }

  getSellerOptionsById(sellerId: string): Observable<APIResponse<PurchasableItemModel[]>> {
    const params: HttpParams = new HttpParams()
      .set('id', sellerId);

    return this.http.get<APIResponse<PurchasableItemModel[]>>(`api/purchase/getselleroptionsbyid`, { params });
  }

  getSellerOptionByIds(sellerId: string, optionId: string): Observable<APIResponse<PurchasableItemModel>> {
    const params: HttpParams = new HttpParams()
      .set('id', sellerId)
      .set('optionId', optionId);

    return this.http.get<APIResponse<PurchasableItemModel>>(`api/purchase/getselleroptionbyids`, { params });
  }

  getPurchasesByUserId(personid: string): Observable<APIResponse<Purchase[]>> {
    const params: HttpParams = new HttpParams()
      .set('personid', personid);

    return this.http.get<APIResponse<Purchase[]>>(`api/purchase/getpurchasesbyuserid`, { params });
  }

  getPurchaseForUserById(purchaseid: string): Observable<APIResponse<Purchase>> {
    const params: HttpParams = new HttpParams()
      .set('id', purchaseid);

    return this.http.get<APIResponse<Purchase>>(`api/purchase/GetPurchaseForUserById`, { params });
  }

  createPurchase(purchase: Purchase): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`api/purchase/createpurchasebyuser`, purchase);
  }

  updatePurchaseByUser(purchase: Purchase): Observable<APIResponse<boolean>> {
    return this.http.put<APIResponse<boolean>>(`api/purchase/updatepurchasebyuser`, purchase);
  }

  changePurchaseStatusByUser(id: string, changeStatusReq: ChangePurchaseStatusRequest): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    if (changeStatusReq.status === 'cancelled') {
      return this.http.put<APIResponse<boolean>>(`api/purchase/cancelpurchasebyuser`, changeStatusReq, { params });
    } else {
      return this.http.put<APIResponse<boolean>>(`api/purchase/pickeduppurchasebyuser`, changeStatusReq, { params });
    }
  }

  getPurchasesBySellerId(personid: string): Observable<APIResponse<Purchase[]>> {
    const params: HttpParams = new HttpParams()
      .set('personid', personid);

    return this.http.get<APIResponse<Purchase[]>>(`api/purchase/getpurchasesbysellerid`, { params });
  }

  getPurchaseForSellerById(purchaseid: string): Observable<APIResponse<Purchase>> {
    const params: HttpParams = new HttpParams()
      .set('id', purchaseid);

    return this.http.get<APIResponse<Purchase>>(`api/purchase/GetPurchaseForSellerById`, { params });
  }

  changePurchaseStatusBySeller(id: string, changeStatusReq: ChangePurchaseStatusRequest): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse<boolean>>(`api/purchase/changepurchasestatusbyseller`, changeStatusReq, { params });
  }

  cancelPurchaseBySeller(id: string, changeStatusReq: ChangePurchaseStatusRequest): Observable<APIResponse<boolean>> {
    const params: HttpParams = new HttpParams()
      .set('id', id);

    return this.http.put<APIResponse<boolean>>(`api/purchase/cancelpurchasebyseller`, changeStatusReq, { params });
  }
}
