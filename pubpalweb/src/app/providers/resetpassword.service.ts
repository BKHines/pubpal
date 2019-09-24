import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, ChangePasswordResetRequest } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {

  constructor(private http: HttpClient) { }

  createPasswordResetRequest(email: string, ip: string): Observable<APIResponse> {
    return this.http.patch<APIResponse>(`api/passwordreset/CreatePasswordResetRequest`, { email, ip });
  }

  updatePasswordReset(cprr: ChangePasswordResetRequest): Observable<APIResponse> {
    return this.http.patch<APIResponse>(`api/passwordreset/UpdatePasswordReset`, cprr);
  }

  cancelPasswordReset(id: string, ip: string): Observable<APIResponse> {
    return this.http.patch<APIResponse>(`api/passwordreset/CancelPasswordReset`, { id, ip });
  }
}
