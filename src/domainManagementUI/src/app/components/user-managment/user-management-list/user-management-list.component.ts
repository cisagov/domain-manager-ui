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
  styleUrls: ['./user-management-list.component.scss'],
})
export class UserManagementListComponent implements OnInit {
  displayedColumns = [
    'UsernameLowereCase',
    'UserStatus',
    'UserCreateDate',
    'UserLastModifiedDate',
    'Enabled',
  ];
  loading = false;
  search_input = '';
  userList: MatTableDataSource<UserModel> = new MatTableDataSource<UserModel>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private alerts: AlertsService,
    public layoutSvc: LayoutService,
    private router: Router,
    private userManageSVC: UserManagementService
  ) {
    this.layoutSvc.setTitle('Users');
  }

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.userList.sort = this.sort;
  }

  getUsers() {
    this.loading = true;
    this.userManageSVC.getAllUsers().subscribe(
      (success) => {
        let userData = success as UserModel[]
        userData.forEach(element => {
          let lowerCase = element['Username'] as string
          element["UsernameLowereCase"] = lowerCase.toLowerCase()
        });
        this.userList = new MatTableDataSource<UserModel>(
          success as UserModel[]
        );
        this.userList.sort = this.sort;
        this.loading = false;
      },
      (failure) => {
        this.alerts.alert('Failed to load user list');
        this.loading = false;
      }
    );
  }

  addUser() {
    this.alerts.alert('adduser not implemented yet');
  }

  viewUser(username) {
    this.router.navigate([`/user/details/${username}`]);
  }

  //Used by mat table for filtering with the search bar
  public filterList = (value: string) => {
    console.log(this.userList)
    this.userList.filter = value.trim().toLocaleLowerCase();
  };
}
