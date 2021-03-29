import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service'
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthAppendInterceptor implements HttpInterceptor {



  constructor(
    private loginSvc: LoginService
  ) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    this.loginSvc.checkTimer();
    const idToken = localStorage.getItem('id_token');

    if (idToken) {
      const cloned = httpRequest.clone({
        headers: httpRequest.headers.set('Authorization', 'Bearer ' + idToken),
      });

      return next.handle(cloned);
    } else {
      return next.handle(httpRequest);
    }
  }
}
