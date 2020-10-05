import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Subject, Observable, BehaviorSubject, from } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from './../../environments/environment';
import { resolve } from 'dns';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  currentAuthUser: any;
  public currentAuthUserSubject: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('Not Authorized');

  constructor(private router: Router, private route: ActivatedRoute) {
    this.currentAuthUserSubject.subscribe((value) => {
      this.currentAuthUser = value;
    });
  }

  // Handles amplify authentification notfications from Hub
  handleAuthNotification(data) {}

  signOut() {
    Auth.signOut();
  }

  redirectToSignIn() {
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

  getUserNameBehaviorSubject(): Observable<any> {
    return this.currentAuthUserSubject;
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
      // const reportTokenGlobal = (new URL(document.location.toString())).searchParams.get('reportToken');

      // if (reportTokenGlobal) {
      //   return new Promise((resolve, reject) => {
      //     resolve({
      //       idToken: reportTokenGlobal
      //     });
      //   });
      // }
      // else {
      console.log('TEST');
      return new Promise((resolve, reject) => {
        Auth.currentAuthenticatedUser()
          .then((success) => {
            this._setUserName(success);
            console.log(success);
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
      // }
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
