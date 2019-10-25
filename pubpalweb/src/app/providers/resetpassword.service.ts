import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, ChangePasswordResetRequest } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {

  constructor(private http: HttpClient) { }

  createPasswordResetRequest(email: string, ip: string): Observable<APIResponse<void>> {
    return this.http.patch<APIResponse<void>>(`api/passwordreset/CreatePasswordResetRequest`, { email, ip });
  }

  updatePasswordReset(cprr: ChangePasswordResetRequest): Observable<APIResponse<boolean>> {
    return this.http.patch<APIResponse<boolean>>(`api/passwordreset/UpdatePasswordReset`, cprr);
  }

  cancelPasswordReset(id: string, ip: string): Observable<APIResponse<void>> {
    return this.http.patch<APIResponse<void>>(`api/passwordreset/CancelPasswordReset`, { id, ip });
  }
}
