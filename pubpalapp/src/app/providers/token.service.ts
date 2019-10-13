import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import { APIResponse } from '../shared/models';
import { CONSTANTS } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  authToken: string;

  constructor(private http: HttpClient) { }

  getIp(): Observable<APIResponse> {
    return this.http.get<APIResponse>('api/common/getip');
  }

  getKey(password: string): string {
    // Set the key to a hash of the user's password + salt.
    return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256([password, CONSTANTS.CRYPTOSALT].join(':'), CONSTANTS.CRYPTOSALT));
  }

  generateToken(username: string, key: string, ip: string): string {
    // Get the (C# compatible) ticks to use as a timestamp. http://stackoverflow.com/a/7968483/2596404
    const ticks = ((new Date().getTime() * 10000) + 621355968000000000);
    // Construct the hash body by concatenating the username, ip, and userAgent.
    const message = [username, ip, ticks].join(':');
    // Hash the body, using the key.
    const hash = CryptoJS.HmacSHA256(message, key);
    // Base64-encode the hash to get the resulting token.
    const token = CryptoJS.enc.Base64.stringify(hash);
    // Include the username and timestamp on the end of the token, so the server can validate.
    const tokenId = [username, ticks].join(':');
    // Base64-encode the final resulting token.
    const tokenStr = CryptoJS.enc.Utf8.parse([token, tokenId].join(':'));
    return CryptoJS.enc.Base64.stringify(tokenStr);
  }
}
