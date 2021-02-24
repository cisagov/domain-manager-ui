import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from './../../environments/environment';

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

  userIsAdmin() {
    if (sessionStorage.getItem('isAdmin')) {
      if (sessionStorage.getItem('isAdmin') == 'true') {
        return true;
      }
    }
    return false;
  }
}
