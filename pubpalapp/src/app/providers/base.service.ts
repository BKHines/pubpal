import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  hideLoading: boolean;

  getPubPalHeaders(): HttpHeaders {
    if (this.hideLoading) {
      this.hideLoading = false;
      return new HttpHeaders().set('hide-loading', 'true');
    } else {
      return new HttpHeaders().set('hide-loading', 'false');
    }
  }
}
