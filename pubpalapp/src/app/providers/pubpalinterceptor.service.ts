import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { LoadingController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class PubpalinterceptorService implements HttpInterceptor {
    constructor(private tokenSvc: TokenService, private loadingCtrl: LoadingController) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const fullurl = this.getFullUrl(req.url);
        req = req.clone({
            url: fullurl,
            headers: req.headers.set('Authorization', `Bearer ${this.tokenSvc.authToken}`),
            params: req.params,
            body: req.body
        });

        if (/true/i.test(req.headers.get('hide-loading'))) {
            return next.handle(req).pipe(
                map((evt: HttpEvent<any>) => {
                    if (evt instanceof HttpResponse) {
                        // console.log(evt);
                    }
                    return evt;
                }),
                catchError((error: HttpErrorResponse) => {
                    return this.handleError(error, null);
                })
            );
        } else {
            return from(this.loadingCtrl.create())
                .pipe(
                    tap((loading) => {
                        return loading.present();
                    }),
                    switchMap((loading) => {
                        return next.handle(req).pipe(
                            map((evt: HttpEvent<any>) => {
                                if (evt instanceof HttpResponse) {
                                    // console.log(evt);
                                    loading.dismiss();
                                }
                                return evt;
                            }),
                            catchError((error: HttpErrorResponse) => {
                                return this.handleError(error, loading);
                            })
                        );
                    })
                );
        }

    }

    private getFullUrl(reqUrl: string): string {
        return `${environment.baseApiUrl}/${reqUrl}`;
    }

    private handleError(error: HttpErrorResponse, loading?: HTMLIonLoadingElement): Observable<any> {
        loading?.dismiss();

        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.log(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
    }
}
