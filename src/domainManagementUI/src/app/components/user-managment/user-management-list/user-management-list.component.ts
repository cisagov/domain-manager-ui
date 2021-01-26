//Angular Imports
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

//Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserManagementService } from 'src/app/services/user-management.service';

//Models
import { UserModel } from 'src/app/models/user.model';

// Dialogs

@Component({
  selector: 'app-user-management-list',
  templateUrl: './user-management-list.component.html',
  styleUrls: ['./user-management-list.component.scss']
})
export class UserManagementListComponent implements OnInit {

  displayedColumns = [
    'Username',
    'UserStatus',
    'UserCreateDate',
    'UserLastModifiedDate',
    'Enabled',
  ];
  search_input = '';
  userList : MatTableDataSource<UserModel> = new MatTableDataSource<UserModel>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private alerts: AlertsService,
    private userManageSVC: UserManagementService,
    ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.userList.sort = this.sort;
  }

  getUsers(){
    this.userManageSVC.getAllUsers().subscribe(
      (success) => {
        console.log(success)
        this.userList = new MatTableDataSource<UserModel>(
          success as UserModel[]
        );
        this.userList.sort = this.sort;
      },
      (failure) => {
        this.alerts.alert("Failed to load user list")
      },
    )
  }

  addUser(){
    this.alerts.alert("adduser not implemented yet")
  }

  viewUser(Username){
    this.alerts.alert(`Open ${Username} detail page (Not yet implmemented)`)
  }

  //Used by mat table for filtering with the search bar
  public filterList = (value: string) => {
    this.userList.filter = value.trim().toLocaleLowerCase();
  };
}
