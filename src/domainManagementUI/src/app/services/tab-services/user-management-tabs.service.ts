import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

// Local Servie Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserManagementService } from '../user-management.service';

// Models
import { UserModel, AWSUserModel } from 'src/app/models/user.model'

@Injectable({
  providedIn: 'root',
})
export class UserManagementTabService {

    
    public tabCompleteBehvaiorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
        );
    public user_data: UserModel = new UserModel();
    public user_form: FormGroup;

  constructor(
    public alertsSvc: AlertsService,
    public userManageSvc: UserManagementService,
  ) { }

  getUserDetails(Username: string){
      return this.userManageSvc.getUser(Username).subscribe(
          (success) => {
              console.log(success)
              this.user_data = success as UserModel
          },
          (failure) => {
              console.log(failure)
              this.alertsSvc.alert("Failed to get user data for ")
          },
      )
  }

}
