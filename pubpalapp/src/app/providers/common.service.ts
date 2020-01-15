import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, StatusType, StatusText, StatusDisplayText } from '../shared/models';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  isApp: boolean;
  menuoptionsType: 'user' | 'seller';
  headerMessage: string;

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController
  ) {
    if (document.URL.indexOf('http://localhost') === 0 || document.URL.indexOf('ionic') === 0 || document.URL.indexOf('https://localhost') === 0) {
      this.isApp = true;
    }
  }

  getFee(): Observable<APIResponse<number>> {
    return this.http.get<APIResponse<number>>(`api/common/getfee`);
  }

  getStatusDisplayText(_currStatus: StatusType): StatusDisplayText {
    switch (_currStatus) {
      case 'ordered':
        return 'ordered';
      case 'accepted':
        return 'accepted';
      case 'inprogress':
        return 'in progress';
      case 'ready':
        return 'ready to be picked up';
      case 'pickedup':
        return 'picked up';
      case 'cancelled':
        return 'cancelled';
    }
  }

  // 'ordered' | 'accepted' | 'inprogress' | 'ready' | 'pickedup' | 'cancelled'
  getNextStatusText(_currStatus: StatusType): StatusText {
    switch (_currStatus) {
      case 'ordered':
        return 'Accept';
      case 'accepted':
        return 'In Progress';
      case 'inprogress':
        return 'Ready';
      case 'ready':
        return 'Picked Up';
      case 'pickedup':
        return 'Complete';
      default:
        return 'Unknown';
    }
  }

  getNextStatus(_currStatus: StatusType): StatusType {
    switch (_currStatus) {
      case 'ordered':
        return 'accepted';
      case 'accepted':
        return 'inprogress';
      case 'inprogress':
        return 'ready';
      case 'ready':
        return 'pickedup';
      default:
        return 'cancelled';
    }
  }

  showAlertMessage(_alertMsg: string) {
    this.alertCtrl.create({
      message: _alertMsg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    }).then((ma) => {
      ma.present();
    });

  }
}
