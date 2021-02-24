import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Subject, Observable, BehaviorSubject, from } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from './../../environments/environment';
import { resolve } from 'dns';
import { switchMap } from 'rxjs/operators';
import { EINPROGRESS } from 'constants';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  currentAuthUser: any;
  isAdmin: any;
  public currentAuthUserSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    'Not Authorized'
  );
  public isAdminSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private router: Router, private route: ActivatedRoute) {
    this.currentAuthUserSubject.subscribe((value) => {
      this.currentAuthUser = value;
    });
    this.isAdminSubject.subscribe((value) => {
      if (environment.authorize) {
        this.isAdmin = value;
      } else {
        this.isAdmin = environment.defaultToAdmin;
      }
    });
  }

  // Handles amplify authentification notfications from Hub
  handleAuthNotification(data) {}

  signOut() {
    console.log('signing out');
    Auth.signOut();
  }

  redirectToSignIn() {
    console.log('redirecting');
    Auth.federatedSignIn();
  }

  // Check Authentication, refreshing if possible. Redirecting to sign in if not authenticated
  userIsAuthenticated() {
    if (environment.authorize) {
      return new Promise((resolve, reject) => {
        Auth.currentAuthenticatedUser()
          .then((success) => {
            console.log('LOGGED IN');
            this._setUserName(success);
            this._setIsAdmin(success);
            resolve(true);
          })
          .catch((error) => {
            console.log('NOT LOGGED IN');
            this.signOut();
            this.redirectToSignIn();
            reject(error);
          });
      });
    } else if (!environment.authorize) {
      return new Promise((resolve, reject) => {
        resolve(true);
        this._setIsAdmin('not Authenticated');
      });
    }
  }

  _setUserName(succesfulAuthObject) {
    if (
      succesfulAuthObject['signInUserSession']['idToken']['payload']['name'] !=
      undefined
    ) {
      this.currentAuthUserSubject.next(
        String(
          succesfulAuthObject['signInUserSession']['idToken']['payload']['name']
        )
      );
    } else {
      this.currentAuthUserSubject.next(succesfulAuthObject['username']);
    }
  }

  _setIsAdmin(succesfulAuthObject) {
    console.log('in subject');
    if (environment.authorize) {
      let groups =
        succesfulAuthObject['signInUserSession']['idToken']['payload'][
          'cognito:groups'
        ];
      if (groups != undefined && groups instanceof Array) {
        groups.forEach((group) => {
          if (group == environment.adminGroupName) {
            this.isAdminSubject.next(true);
          }
        });
      } else {
        this.isAdminSubject.next(false);
      }
    } else {
      console.log('in subject');
      this.isAdminSubject.next(environment.defaultToAdmin);
    }
  }

  getUserNameBehaviorSubject(): Observable<any> {
    return this.currentAuthUserSubject;
  }
  getUserIsAdminBehaviorSubject(): Observable<any> {
    return this.isAdminSubject;
  }
  userIsAdmin() {
    if (sessionStorage.getItem('isAdmin')) {
      if (sessionStorage.getItem('isAdmin') == 'true') {
        return true;
      }
    }
    return false;
  }

  getReportToken() {
    if (environment.authorize) {
      return new Promise((resolve, reject) => {
        this.route.queryParamMap
          .toPromise()
          .then((success) => {
            resolve({
              idToken: success['reportToken'],
            });
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  }

  getUserTokens() {
    if (environment.authorize) {
      return new Promise((resolve, reject) => {
        Auth.currentAuthenticatedUser()
          .then((success) => {
            this._setUserName(success);
            resolve({
              idToken: success.signInUserSession.accessToken.jwtToken,
              accessToken: success.signInUserSession.idToken.jwtToken,
            });
          })
          .catch((error) => {
            console.log(error);
            reject(error);
            this.signOut();
            this.redirectToSignIn();
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve({
          idToken: 'Angular not set to authorize',
          accessToken: 'Angular not set to authorize',
        });
      });
    }
  }
}
