import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { CookieService } from 'ngx-cookie-service'

import { UserAuthService } from '../services/user-auth.service';
import { LoginService } from 'src/app/services/login.service';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {


  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
      null
  );

  constructor(
    private userAuthSvc: UserAuthService,
    private router: Router,
    private loginSvc: LoginService,
    private cookieSvc: CookieService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (environment.authorize) {
      return next.handle(request).pipe(
        catchError((err) => {

          // // We don't want to refresh token for some requests like login or refresh token itself
          // // So we verify url and we throw an error if it's the case
          // console.log(request.url)
          // if(
          //   request.url.includes("refreshtoken") ||
          //   request.url.includes("signin")
          // ){
          //     // We do another check to see if refresh token failed
          //     // In this case we want to logout user and to redirect it to login page
          //     console.log("SIGN IN OR REFRESHING")
          //     if (request.url.includes("refreshtoken")) {
          //         // this.loginSvc.logout();
          //     }
              
          //     return throwError(err);
          // } else {
          //   console.log("NOT SIGN IN OR REFRESH")
          // }



          if (err.status === 401) {
            // auto logout if 401 response returned from api
            this.loginSvc.logout();
          }

          if (!this.loginSvc.isLoggedIn()) {
            this.loginSvc.logout();
          }

        //   if(this.refreshTokenInProgress){
        //     // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
        //     // – which means the new token is ready and we can retry the request again
        //     // return this.refreshTokenSubject
        //     // .filter(result => result !== null)
        //     // .take(1)
        //     // .switchMap(() => next.handle(this.addAuthenticationToken(request)))
        //   } else {
        //     this.refreshTokenInProgress = true;

        //     // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
        //     this.refreshTokenSubject.next(null);

        //     // Call auth.refreshAccessToken(this is an Observable that will be returned)
        //     return this.auth
        //         .refreshAccessToken()
        //         .switchMap((token: any) => {
        //             //When the call to refreshToken completes we reset the refreshTokenInProgress to false
        //             // for the next time the token needs to be refreshed
        //             this.refreshTokenInProgress = false;
        //             this.refreshTokenSubject.next(token);

        //             return next.handle(this.addAuthenticationToken(request));
        //         })
        //         .catch((err: any) => {
        //             this.refreshTokenInProgress = false;

        //             this.auth.logout();
        //             return Observable.throw(error);
        //         });
        // }

          const error = 'Error';
          // const error = err.error.message || err.statusText;

          return next.handle(request);
          return throwError(error);
        })
      );
    } else {
      return next.handle(request);
    }
  }
  addAuthenticationToken(request) {
    // Get access token from Local Storage
    const accessToken = this.loginSvc.getAccessToken();

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!accessToken) {
        return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
        setHeaders: {
            Authorization: this.loginSvc.getAccessToken()
        }
    });
}
}
