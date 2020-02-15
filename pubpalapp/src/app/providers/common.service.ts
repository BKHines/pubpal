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

  getDrinkIconUrl(name: string, baseingredient: string) {
    if (/beer/i.test(name) || /beer/i.test(baseingredient)) {
      return '../../../../assets/imgs/beer/beer_icon.jpg'
    } else if (this.matchBrandy(name) || this.matchBrandy(baseingredient)) {
      return '../../../../assets/imgs/brandycognac/brandy_icon.jpg';
    } else if (/gin/i.test(name) || /gin/i.test(baseingredient)) {
      return '../../../../assets/imgs/gin/gin_icon.jpg';
    } else if (/margarita/i.test(name) || /margarita/i.test(baseingredient)) {
      return '../../../../assets/imgs/margarita/margarita_icon.jpg';
    } else if (this.matchRedWine(name) || this.matchRedWine(baseingredient)) {
      return '../../../../assets/imgs/redwine/redwine_icon.jpg';
    } else if (/rum/i.test(name) || /rum/i.test(baseingredient)) {
      return '../../../../assets/imgs/rum/rum_icon.jpg';
    } else if (/tequila/i.test(name) || /tequila/i.test(baseingredient)) {
      return '../../../../assets/imgs/tequila/tequila_icon.jpg';
    } else if (/vodka/i.test(name) || /vodka/i.test(baseingredient)) {
      return '../../../../assets/imgs/vodka/vodka_icon.jpg';
    } else if (this.matchWhiskey(name) || this.matchWhiskey(baseingredient)) {
      return '../../../../assets/imgs/whiskeybourbonscotch/whiskey_icon.jpg';
    } else if (this.matchWhiteWine(name) || this.matchWhiteWine(baseingredient)) {
      return '../../../../assets/imgs/whitewine/whitewine_icon.jpg';
    }
  }

  private matchBrandy(text: string) {
    return /brandy|cognac/i.test(text);
  }

  private matchRedWine(text: string) {
    return /redwine|red wine|wine/i.test(text);
  }

  private matchWhiskey(text: string) {
    return /whiskey|whisky|bourbon|scotch/i.test(text);
  }

  private matchWhiteWine(text: string) {
    return /white wine|whitewine/i.test(text);
  }
}
