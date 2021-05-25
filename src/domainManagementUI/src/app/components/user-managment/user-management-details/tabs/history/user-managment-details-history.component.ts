// Angular Imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericViewComponent } from 'src/app/components/dialog-windows/generic-view/generic-view.component';
import { UserHistory } from 'src/app/models/user.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { UserManagementTabService } from 'src/app/services/tab-services/user-management-tabs.service';
import { GenericDialogSettings } from 'src/app/models/genericDialogSettings.model';

@Component({
  selector: 'app-user-managment-details-history',
  templateUrl: './user-managment-details-history.component.html',
  styleUrls: ['./user-managment-details-history.component.scss'],
})
export class UserManagementDetailsHistoryComponent implements OnInit {
  displayedColumns = ['path', 'method', 'status_code', 'created'];
  JSON = JSON;
  public userHistory: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public alertsSvc: AlertsService,
    public umTabSvc: UserManagementTabService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.umTabSvc.user_data_behavior_subject.subscribe((val) => {
      console.log(val);
      if (val.History) {
        this.userHistory = new MatTableDataSource<any>(val.History);
        this.userHistory.sort = this.sort;
      }
    });
  }

  viewRecord(record: UserHistory) {
    const genericSettings = new GenericDialogSettings(record);
    this.dialog.open(GenericViewComponent, { data: genericSettings });
  }
}
