// Angular Imports
import { Component, OnInit } from '@angular/core';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { UserManagementTabService } from 'src/app/services/tab-services/user-management-tabs.service';

@Component({
  selector: 'app-user-management-details-groups',
  templateUrl: './user-management-details-groups.component.html',
  styleUrls: ['./user-management-details-groups.component.scss']
})
export class UserManagementDetailsGroupsComponent implements OnInit {

  constructor(
    public alertsSvc: AlertsService,
    public umTabSvc: UserManagementTabService,
  ) { }

  ngOnInit(): void {
  }

}
