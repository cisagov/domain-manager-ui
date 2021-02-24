import { Injectable } from '@angular/core';
import {
  Router,
} from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';

import { UserAuthService } from '../services/user-auth.service';
import { LoginService } from 'src/app/services/login.service'

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(
    private userAuthSvc: UserAuthService,
    private router: Router,
    private loginSvc: LoginService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (environment.authorize) {
      return next.handle(request).pipe(
        catchError((err) => {
          if (err.status === 401) {
            // auto logout if 401 response returned from api
            this.loginSvc.logout()
          }

          if(!this.loginSvc.isLoggedIn()){
            this.loginSvc.logout()
          }

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
}
