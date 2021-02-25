// Angular Imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { share } from 'rxjs/operators';

//Third party imports
import * as moment from 'moment';

// Local Service Imports
import { SettingsService } from 'src/app/services/settings.service';

// Models
import { Login } from 'src/app/models/login.model';

@Injectable()
export class LoginService {
  apiUrl: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    private settingsService: SettingsService
  ) {
    this.apiUrl = this.settingsService.settings.apiUrl;
  }

  public postLogin(login: Login): Observable<any> {
    const url = `${this.settingsService.settings.apiUrl}/api/auth/signin/`;
    return this.http.post(url, login);
  }

  public logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    this.router.navigateByUrl('/login');
  }

  public setSession(authResult) {
    localStorage.setItem('id_token', authResult.id_token);
    localStorage.setItem('expires_at', authResult.expires_at);
    localStorage.setItem('username', authResult.username);
    localStorage.setItem('isAdmin', 'false');
    try {
      const jwt = jwt_decode(authResult.id_token);
      if (jwt['cognito:groups']) {
        jwt['cognito:groups'].forEach((group) => {
          if (group === 'admin') {
            localStorage.setItem('isAdmin', 'true');
          }
        });
      }
    } finally {
    }
    // localStorage.setItem("isDMAdmin", )
    this.router.navigateByUrl('/');
  }

  public isLoggedIn() {
    if (localStorage.getItem('id_token') != null) {
      return moment().isBefore(this.getExpiration());
    }
    return false;
  }

  private getExpiration() {
    if (localStorage.getItem('expires_at') == null) {
      return null;
    }
    const expiration = localStorage.getItem('expires_at');
    return moment(expiration);
  }

  public logUserLogout() {
    return this.http.get<any>('/api/Login/logUserLogout/').pipe();
  }
}
