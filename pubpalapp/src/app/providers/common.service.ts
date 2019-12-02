import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, StatusType, StatusText, StatusDisplayText } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

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
}
