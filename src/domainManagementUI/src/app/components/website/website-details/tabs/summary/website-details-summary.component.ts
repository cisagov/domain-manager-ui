// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { ApplicationService } from 'src/app/services/applications.service';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';
import { WebsiteService } from 'src/app/services/website.service';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { WebsiteModel } from 'src/app/models/website.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';

@Component({
  selector: 'wd-summary',
  templateUrl: './website-details-summary.component.html',
  styleUrls: ['./website-details-summary.component.scss'],
})
export class WebsiteDetailsSummaryComponent implements OnInit, OnDestroy {
  application_list = [];
  component_subscriptions = [];
  // website_data : WebsiteModel = new WebsiteModel();
  deleteDialog: MatDialogRef<ConfirmDialogComponent> = null;

  constructor(
    public alertsSvc: AlertsService,
    public applicationSvc: ApplicationService,
    public dialog: MatDialog,
    private router: Router,
    public wdTabSvc: WebsiteDetailsTabService,
    public websiteSvc: WebsiteService
  ) {}

  ngOnInit(): void {
    this.applicationSvc.getAllApplications().subscribe(
      (success) => {
        this.application_list = success as [];
      },
      (failure) => {
        this.alertsSvc.alert('Failed to get application list');
        console.log(failure);
      }
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getApplicationName() {
    if (
      this.wdTabSvc.website_data.application_id &&
      this.applicationSvc.application_list.length
    ) {
      return this.applicationSvc.getApplicationNameByUUID(
        this.wdTabSvc.website_data.application_id
      );
    } else {
      return 'Loading Application List';
    }
  }

  changeApplication(application_id) {
    this.wdTabSvc.website_data.application_id = application_id;
    console.log(this.wdTabSvc.website_data);
    this.wdTabSvc.updateWebsite().subscribe(
      (success) => {
        this.alertsSvc.alert('Website Application Updated');
      },
      (failure) => {
        this.alertsSvc.alert('Website Application Update failed');
      }
    );
  }

  downloadWebsite() {
    this.wdTabSvc.downloadWebsite().subscribe(
      (success) => {
        console.log(success);
      },
      (failure) => {
        this.alertsSvc.alert('Website Download Failed');
        console.log(failure);
      }
    );
  }

  deleteWebsite() {
    console.log('trying to delte');
    let confirmDialogSettings = new ConfirmDialogSettings();
    confirmDialogSettings.itemConfirming = 'confirm template delete';
    confirmDialogSettings.actionConfirming = `Are you sure you want to delete ${this.wdTabSvc.website_data.name}`;

    this.deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: confirmDialogSettings,
    });
    this.deleteDialog.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.wdTabSvc.deleteWebsite(this.wdTabSvc.website_data._id).subscribe(
          (success) => {
            this.router.navigate([`/website`]);
          },
          (failed) => {
            this.alertsSvc.alert('Failed to Delete Website');
          }
        );
      } else {
        console.log('delete canceled');
      }
    });
  }
  get tabForm() {
    return this.wdTabSvc.summary_form;
  }
}
