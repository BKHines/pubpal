import { Injectable, ErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalerrorhandlerService implements ErrorHandler {
  handleError(err) {
    
    throw err;
  }
}
