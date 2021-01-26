// Angular Imports
import { Component, OnInit } from '@angular/core';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { UserManagementTabService } from 'src/app/services/tab-services/user-management-tabs.service';

@Component({
  selector: 'app-user-managment-details-history',
  templateUrl: './user-managment-details-history.component.html',
  styleUrls: ['./user-managment-details-history.component.scss']
})
export class UserManagementDetailsHistoryComponent implements OnInit {

  constructor(
    public alertsSvc: AlertsService,
    public umTabSvc: UserManagementTabService) { }

  ngOnInit(): void {
  }

}
