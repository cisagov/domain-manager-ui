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

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(
    private userAuthSvc: UserAuthService,
    private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (environment.authorize) {
      return next.handle(request).pipe(
        catchError((err) => {
          if (err.status === 401) {
            // auto logout if 401 response returned from api

            this.router.navigateByUrl("/login");
            //Working
            //this.userAuthSvc.signOut();
            // location.reload(true);

            //Test
            // return next.handle(request);
          }

          const error = 'Errro';
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
