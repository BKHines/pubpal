import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class PubpalinterceptorService implements HttpInterceptor {
    constructor(private userSvc: UserService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const fullurl = this.getFullUrl(req.url);
    req = req.clone({
        url: fullurl,
        headers: req.headers.set('Authorization', `Bearer ${this.userSvc.authToken}`),
        params: req.params,
        body: req.body
    });

    return next.handle(req).pipe(
        map((evt: HttpEvent<any>) => {
            if (evt instanceof HttpResponse) {
                // console.log(evt);
            }
            return evt;
        }), catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
    );
}

private getFullUrl(reqUrl: string): string {
    return `${environment.baseApiUrl}/${reqUrl}`;
}

private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
}
}
