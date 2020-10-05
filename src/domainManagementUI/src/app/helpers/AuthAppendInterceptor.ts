import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { UserAuthService } from '../services/user-auth.service';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  ActivatedRouteSnapshot,
  ActivatedRoute,
  Router,
} from '@angular/router';

import { SettingsService } from 'src/app/services/settings.service';

@Injectable()
export class AuthAppendInterceptor implements HttpInterceptor {
  constructor(
    private userAuthSvc: UserAuthService,
    private router: Router,
    private settingsService: SettingsService
  ) {}
  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(this.settingsService.settings.apiKey);
    return from(this.userAuthSvc.getUserTokens()).pipe(
      switchMap((token) => {
        const headers = httpRequest.headers
          // .set('Authorization','Bearer ' + token['idToken'])
          .append('accept', 'application/json')
          .append('api_key', this.settingsService.settings.apiKey);
        const requestClone = httpRequest.clone({
          headers,
        });
        return next.handle(requestClone);
      })
    );
  }
}
