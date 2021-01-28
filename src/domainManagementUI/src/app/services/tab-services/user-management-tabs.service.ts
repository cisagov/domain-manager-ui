import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

// Local Servie Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { ApplicationService } from 'src/app/services/applications.service'
import { environment } from 'src/environments/environment';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserManagementService } from '../user-management.service';

// Models
import { UserModel, AWSUserModel } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserManagementTabService {

    public loading = false;
    public isAdmin = false;
    public tabCompleteBehvaiorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
        );
    public user_data: UserModel = new UserModel();
    public user_data_behavior_subject: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(
      new UserModel()
    );
    public user_form: FormGroup;

  constructor(
    public alertsSvc: AlertsService,
    public applicationsSvc: ApplicationService,
    public userManageSvc: UserManagementService,
    public UserAuthSvc: UserAuthService,
  ) { }

  getUserUpdateBehvaiorSubject() {
    return this.user_data_behavior_subject;
  }

  getUserDetails(Username: string){
      this.loading = true;
      this.user_data = new UserModel();
      this.userManageSvc.getUser(Username).subscribe(
          (success) => {
              console.log(success)
              this.user_data = success as UserModel
              this.setAdminStatus();
              this.user_data_behavior_subject.next(this.user_data)
              this.loading = false;
            },
            (failure) => {
              console.log(failure)
              this.alertsSvc.alert("Failed to get user data for ")
              this.loading = false;
          },
      )
  }

  setAdminStatus(){
    this.isAdmin = false;
    console.log(this.user_data.Groups.filter((g) => g["GroupName"] == environment.adminGroupName));
    if(this.user_data.Groups.filter((g) => g["GroupName"] == environment.adminGroupName).length != 0){
      console.log(this.user_data.Groups.filter((g) => g["GroupName"] == environment.adminGroupName).length)
      this.isAdmin = true;
    }
  }
  
  changeAdminStatus(event){
    if(!this.isCurrentUser()){
      if(event.checked){
        this.userManageSvc.setUserAsAdmin(this.user_data.Username).subscribe(
          () => {},
          () => {
            this.alertsSvc.alert("Failed to update user admin status")
            this.isAdmin = !event.checked
          },
          )
        }
        else {
          this.userManageSvc.removeUserAsAdmin(this.user_data.Username).subscribe(
            () => {},
            () => {
              this.isAdmin = !event.checked
              this.alertsSvc.alert("Failed to update user admin status")
          },
          )
      }
    }
    else {
      this.alertsSvc.alert("Can not set own admin status")
    }
  }

  isCurrentUser(){
    if(this.UserAuthSvc.currentAuthUser == this.user_data.Username){
      return true
    }
  }

  confirmUser(){
    this.userManageSvc.confirmUser(this.user_data.Username).subscribe(
      (success) => {
        this.alertsSvc.alert("User Confirmed")
        this.getUserDetails(this.user_data.Username)
      },
      (failure) => {
        this.alertsSvc.alert("Failed to confirm user")
      },
    )
  }

  getApplicationGroups(){
    return this.applicationsSvc.getAllApplications()
  }

}
