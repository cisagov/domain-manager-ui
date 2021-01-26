// Angular Imports
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UserManagementTabService } from 'src/app/services/tab-services/user-management-tabs.service';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';

@Component({
  selector: 'app-user-management-details',
  templateUrl: './user-management-details.component.html',
  styleUrls: ['./user-management-details.component.scss']
})
export class UserManagementDetailsComponent implements OnInit {

  component_subscriptions = [];
  deleteDialog: MatDialogRef<ConfirmDialogComponent> = null;
  username = null;
  selectedTabIndex: number = 0;

  constructor(
    public activeRoute: ActivatedRoute,
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    public layoutSvc: LayoutService,
    private router: Router,
    public umTabSvc: UserManagementTabService
    ) { }

  ngOnInit(): void {
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this.username = params['username'];
        if (this.username !== null) {
          this.getUser(this.username);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getUser(username) {
    this.umTabSvc.getUserDetails(username)
  }

}
