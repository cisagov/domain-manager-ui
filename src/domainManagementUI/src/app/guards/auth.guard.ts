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
import { LoginService } from 'src/app/services/login.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private userAuthSvc: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.userAuthSvc.isLoggedIn()) {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }
}
