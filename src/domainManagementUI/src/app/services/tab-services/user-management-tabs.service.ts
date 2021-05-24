import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';

// Local Servie Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { ApplicationService } from 'src/app/services/applications.service';
import { environment } from 'src/environments/environment';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserManagementService } from '../user-management.service';

// Models
import { UserModel } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserManagementTabService {
  public loading = true;
  public isAdmin = false;
  public userEmail = '';
  public tabCompleteBehvaiorSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public user_data: UserModel = new UserModel();
  public user_data_behavior_subject: BehaviorSubject<UserModel> =
    new BehaviorSubject<UserModel>(new UserModel());
  public user_form: FormGroup;
  public userHistory: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  public appRequested: string;

  constructor(
    public alertsSvc: AlertsService,
    public applicationsSvc: ApplicationService,
    private router: Router,
    public userManageSvc: UserManagementService,
    public UserAuthSvc: UserAuthService
  ) {
    this.init();
  }

  init() {
    this.loading = true;
    this.isAdmin = false;
    this.userEmail = '';
    this.tabCompleteBehvaiorSubject = new BehaviorSubject<boolean>(false);
    this.user_data = new UserModel();
    this.user_data_behavior_subject = new BehaviorSubject<UserModel>(
      new UserModel()
    );
  }

  getUserUpdateBehvaiorSubject() {
    return this.user_data_behavior_subject;
  }

  getUserDetails(Username: string) {
    this.loading = true;
    this.user_data = new UserModel();
    this.userManageSvc.getUser(Username).subscribe(
      (success) => {
        this.user_data = success as UserModel;
        this.setAdminStatus();
        this.user_data.Email = 'test';
        this.user_data['UserAttributes'].forEach((attribute) => {
          if (attribute['Name'] == 'email') {
            this.user_data.Email = attribute['Value'];
          }
        });
        this.userHistory = new MatTableDataSource(this.user_data.History);
        this.userHistory.sort = this.sort;
        this.user_data_behavior_subject.next(this.user_data);
        this.setAppRequested()
        this.loading = false;
      },
      (failure) => {
        this.alertsSvc.alert('Failed to get user data for ');
        this.loading = false;
      }
    );
  }

  setAppRequested(){
    if(this.user_data.UserStatus == 'UNCONFIRMED' && this.user_data.Groups){
      //@ts-ignore
      this.appRequested = this.user_data.Groups[0]["GroupName"]
    } else {
      this.appRequested = null;
    }
  }

  setAdminStatus() {
    this.isAdmin = false;
    if (
      this.user_data.Groups.filter(
        (g) => g['GroupName'] == environment.adminGroupName
      ).length != 0
    ) {
      this.isAdmin = true;
    }
  }

  changeAdminStatus(event) {
    if (!this.isCurrentUser()) {
      if (event.checked) {
        this.userManageSvc.setUserAsAdmin(this.user_data.Username).subscribe(
          () => {},
          () => {
            this.alertsSvc.alert('Failed to update user admin status');
            this.isAdmin = !event.checked;
          }
        );
      } else {
        this.userManageSvc.removeUserAsAdmin(this.user_data.Username).subscribe(
          () => {},
          () => {
            this.isAdmin = !event.checked;
            this.alertsSvc.alert('Failed to update user admin status');
          }
        );
      }
    } else {
      this.alertsSvc.alert('Can not set own admin status');
    }
  }

  isCurrentUser() {
    if (this.UserAuthSvc.currentAuthUser === this.user_data.Username) {
      return true;
    }
  }

  confirmUser() {
    this.userManageSvc.confirmUser(this.user_data.Username).subscribe(
      (success) => {
        this.alertsSvc.alert('User Confirmed');
        this.getUserDetails(this.user_data.Username);
      },
      (failure) => {
        this.alertsSvc.alert('Failed to confirm user');
      }
    );
  }

  deleteUser() {
    this.userManageSvc.deleteUser(this.user_data.Username).subscribe(
      (success) => {
        this.router.navigate([`/users`]);
      },
      (failure) => {
        this.alertsSvc.alert(failure);
      }
    );
  }

  disableUser() {
    console.log('disabling');
    this.disableEnableUser();
  }

  enableUser() {
    console.log('enabling');
    this.disableEnableUser();
  }

  disableEnableUser() {
    this.userManageSvc.disableEnableUser(this.user_data.Username).subscribe(
      (success) => {
        console.log(success);
        this.user_data.Enabled = success['status'] as boolean;
        console.log(this.user_data);
      },
      (failure) => {
        console.log(failure);
      }
    );
  }

  getApplicationGroups() {
    return this.applicationsSvc.getAllApplications();
  }

  setUserGroups(groupData) {
    return this.userManageSvc.setUserGroups(this.user_data.Username, groupData);
  }

  getUserAPIKey() {
    this.userManageSvc.getAPIKeys(this.user_data.Username).subscribe(
      (success) => {
        this.user_data.APIKey = success['api_key'] as string;
      },
      (failure) => {
        this.alertsSvc.alert(failure);
      }
    );
  }
}
