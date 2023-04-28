// Angular Imports
import { Component, OnInit } from '@angular/core';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { UserManagementTabService } from 'src/app/services/tab-services/user-management-tabs.service';

@Component({
  selector: 'app-user-management-details-summary',
  templateUrl: './user-management-details-summary.component.html',
  styleUrls: ['./user-management-details-summary.component.scss'],
})
export class UserManagementDetailsSummaryComponent implements OnInit {
  constructor(
    public alertsSvc: AlertsService,
    public umTabSvc: UserManagementTabService,
  ) {}

  ngOnInit(): void {}

  confirmUser() {
    this.umTabSvc.confirmUser();
  }
  test(item) {
    console.log(item);
  }
}
