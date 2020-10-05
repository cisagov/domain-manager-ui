import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { Observable } from 'rxjs';
import Auth from '@aws-amplify/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private userAuthSvc: UserAuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('GURAD HIT');
    return this.userAuthSvc
      .userIsAuthenticated()
      .then(() => {
        console.log('Auth');
        return true;
      })
      .catch((error) => {
        console.log('NOT AUTH');
        console.log(error);
        return false;
      });
  }
}
