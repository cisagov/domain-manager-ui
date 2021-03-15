import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  currentAuthUser: string;
  isAdmin: boolean;

  constructor() {
    this.currentAuthUser = localStorage.getItem('username');
    this.isAdmin = this.userIsAdmin();
  }

  userIsAdmin() {
    if (localStorage.getItem('isAdmin')) {
      if (localStorage.getItem('isAdmin') === 'true') {
        return true;
      }
    }
    return false;
  }
}
