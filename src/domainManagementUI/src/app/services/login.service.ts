// Angular Imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { share } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

//Third party imports
import * as moment from 'moment';

// Local Service Imports
import { SettingsService } from 'src/app/services/settings.service';

// Models
import { Login } from 'src/app/models/login.model';
import { ResetPassword } from '../models/reset-password.model';

@Injectable()
export class LoginService {
  apiUrl: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    private settingsService: SettingsService,
    private cookieSvc: CookieService
  ) {
    this.apiUrl = this.settingsService.settings.apiUrl;
  }

  public postLogin(login: Login): Observable<any> {
    const url = `${this.settingsService.settings.apiUrl}/api/auth/signin/`;
    return this.http.post(url, login);
  }

  public refreshToken() {
    const url = `${this.settingsService.settings.apiUrl}/api/auth/refreshtoken/`;

    return this.http.post(url, {
      refeshToken: this.cookieSvc.get('dm-auth-refresh-token'),
      username: localStorage.getItem('username'),
    });
  }

  public triggerPasswordReset(username: string): Observable<any> {
    const url = `${this.settingsService.settings.apiUrl}/api/auth/resetpassword/${username}/`;
    return this.http.get(url);
  }

  public resetPassword(
    username: string,
    resetPassword: ResetPassword
  ): Observable<any> {
    const url = `${this.settingsService.settings.apiUrl}/api/auth/resetpassword/${username}/`;
    return this.http.post(url, resetPassword);
  }

  public resendEmailConfirm(username: string): Observable<any> {
    const url = `${this.settingsService.settings.apiUrl}/api/auth/confirm/${username}/`;
    return this.http.get(url);
  }

  public logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    this.cookieSvc.delete('dm-auth-refresh-token');
    if (
      this.router.url !== '/login/registeruser' &&
      this.router.url !== '/login'
    ) {
      this.router.navigateByUrl('/login');
      this.stopRefreshTokenTimer();
    }
  }

  public setSession(authResult, refreshed = false) {
    localStorage.setItem('id_token', authResult.id_token);
    localStorage.setItem('expires_at', authResult.expires_at);
    localStorage.setItem('username', authResult.username);
    localStorage.setItem('isAdmin', 'false');
    this.cookieSvc.set('dm-auth-refresh-token', authResult.refresh_token, {
      secure: true,
      expires: 30,
      sameSite: 'Strict',
    });
    this.startRefreshTokenTimer();
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
    if (!refreshed) {
      this.router.navigateByUrl('/');
    }
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

  public getAccessToken() {
    return localStorage.getItem('id_token');
  }

  public getTimeTillExpire() {
    //Returns time to expire in minutes
    let expire = new Date(localStorage.getItem('expires_at')).getTime();
    var offSet = new Date().getTimezoneOffset() * 60000;
    var now = Date.now() + offSet;
    let minutesToExpire = (expire - now) / 60000;

    return minutesToExpire;
  }

  // helper methods
  private refreshTokenTimeout = null;

  public checkTimer() {
    if (this.refreshTokenTimeout) {
      //refresh timer is active, do nothing
    } else {
      this.startRefreshTokenTimer();
    }
  }

  private startRefreshTokenTimer() {
    // How long before expiration the refresh should occur in minutes
    let refreshAt = 5;
    let timeout = Math.floor((this.getTimeTillExpire() - refreshAt) * 60000);
    if (timeout <= 0) {
      timeout = 5000; //if timeout is negative, set to five seconds
    }

    if (this.cookieSvc.get('dm-auth-refresh-token').length !== 0) {
      this.refreshTokenTimeout = setTimeout(
        () =>
          this.refreshToken().subscribe(
            (success) => {
              this.setSession(success, true);
            },
            (failure) => {
              console.log(
                'Failed to refresh authorization using refresh token'
              );
              console.log(failure);
            }
          ),
        timeout
      );
    } else {
      this.refreshTokenTimeout = setTimeout(() => {}, timeout);
    }
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
