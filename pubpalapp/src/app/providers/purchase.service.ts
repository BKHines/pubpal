import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, PurchasableItemModel, Purchase, ChangePurchaseStatusRequest, StatusType } from '../shared/models';
import { UserService } from './user.service';
import { CommonService } from './common.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService extends BaseService {
  sellerName: string;
  purchases: Purchase[];
  purchaseStatusChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private http: HttpClient,
    private userSvc: UserService,
    private commonSvc: CommonService
  ) {
    super();
  }

  startPolling() {
    this.hideLoading = true;
    this.getPurchasesByUserId(this.userSvc.user._id).subscribe((res) => {
      if (res && res.result) {
        if (this.purchases) {
          if (res.result.some(a => this.purchases.filter(b => b._id === a._id && b.currentstatus !== a.currentstatus).length > 0)) {
            let _msgs = [];
            let _updatedPurchases = res.result.filter(a => this.purchases.filter(b => b._id === a._id && b.currentstatus !== a.currentstatus).length > 0);
            this.purchases = res.result;
            _updatedPurchases.forEach((p) => {
              switch (p.currentstatus) {
                case 'accepted':
                case 'cancelled':
                case 'ordered':
                case 'pickedup':
                  _msgs.push(`Your order has been updated: ${p.itemname} has been ${this.commonSvc.getStatusDisplayText(p.currentstatus)}`);
                  break;
                case 'inprogress':
                case 'ready':
                  _msgs.push(`Your order has been updated: ${p.itemname} is ${this.commonSvc.getStatusDisplayText(p.currentstatus)}`);
                  break;
              }
            });
            this.purchaseStatusChanged.emit(_msgs.join('\n'));
          }

        } else {
          this.purchases = res.result;
        }

        if (res.result.some(a => !(/cancelled|pickedup/.test(a.currentstatus)))) {
          setTimeout(() => {
            this.startPolling();
          }, 5000);
        }
      }
    });
  }

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
    const headers = this.getPubPalHeaders();
    const params: HttpParams = new HttpParams()
      .set('personid', personid);

    return this.http.get<APIResponse<Purchase[]>>(`api/purchase/getpurchasesbyuserid`, { params, headers });
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
      return this.http.put<APIResponse<boolean>>(`api/purchaexse/pickeduppurchasebyuser`, changeStatusReq, { params });
    }
  }

  getPurchasesBySellerId(personid: string): Observable<APIResponse<Purchase[]>> {
    const params: HttpParams = new HttpParams()
      .set('personid', personid);

    return this.http.get<APIResponse<Purchase[]>>(`api/purchase/getpurchasesbysellerid`, { params });
  }

  getPurchasesBySellerIdAndDate(personid: string, activitydate: string): Observable<APIResponse<Purchase[]>> {
    const params: HttpParams = new HttpParams()
      .set('personid', personid)
      .set('activitydate', activitydate);

    return this.http.get<APIResponse<Purchase[]>>(`api/purchase/getpurchasesbyselleridanddate`, { params });
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
