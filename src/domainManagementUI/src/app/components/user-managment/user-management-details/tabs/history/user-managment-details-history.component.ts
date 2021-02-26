// Angular Imports
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericViewComponent } from 'src/app/components/dialog-windows/generic-view/generic-view.component';
import { UserHistory } from 'src/app/models/user.model';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { UserManagementTabService } from 'src/app/services/tab-services/user-management-tabs.service';

@Component({
  selector: 'app-user-managment-details-history',
  templateUrl: './user-managment-details-history.component.html',
  styleUrls: ['./user-managment-details-history.component.scss'],
})
export class UserManagementDetailsHistoryComponent implements OnInit {
  displayedColumns = ['path', 'method', 'statusCode', 'created'];
  JSON = JSON;

  constructor(
    public alertsSvc: AlertsService,
    public umTabSvc: UserManagementTabService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  viewRecord(record: UserHistory) {
    this.dialog.open(GenericViewComponent, { data: record });
  }
}
