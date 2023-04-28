import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginService } from 'src/app/services/login.service';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private loginSvc: LoginService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (environment.authorize) {
      return next.handle(request).pipe(
        catchError((err) => {
          if (err.status === 401) {
            // auto logout if 401 response returned from api
            this.loginSvc.logout();
          }

          if (!this.loginSvc.isLoggedIn()) {
            this.loginSvc.logout();
          }
          // const error = err.error.message || err.statusText;

          return next.handle(request);
        }),
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
        Authorization: this.loginSvc.getAccessToken(),
      },
    });
  }
}
