// Angular Imports
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { LayoutService } from 'src/app/services/layout.service';
import { WebsiteService } from 'src/app/services/website.service';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { ProgressBarDialogSettings } from 'src/app/models/progressBarDialogSettings.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { ProgressBarDialog } from 'src/app/components/dialog-windows/progress-bar/progress-bar-dialog.component';

@Component({
  selector: 'website-details',
  templateUrl: './website-details.component.html',
  styleUrls: ['./website-details.component.scss'],
})
export class WebsiteDetailsComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  deleteDialog: MatDialogRef<ConfirmDialogComponent> = null;
  progressDialogRef: MatDialogRef<ProgressBarDialog> = null;
  selectedTabIndex: number = 0;
  _id = null;

  constructor(
    public activeRoute: ActivatedRoute,
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    public layoutSvc: LayoutService,
    private router: Router,
    public wdTabSvc: WebsiteDetailsTabService,
    public websiteTemplateSvc: WebsiteService
  ) {
    this.layoutSvc.setTitle('Website Details');
  }

  ngOnInit(): void {
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this._id = params['_id'];
        if (this._id !== null) {
          this.loadWebsite(this._id);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  loadWebsite(_id) {
    this.wdTabSvc.getWebsiteDetails(_id);
  }

  launchSite() {
    if (this.wdTabSvc.canBeLaunched()) {
      let progressDialogSettings = new ProgressBarDialogSettings();
      progressDialogSettings.actionInProgress = 'Launching Website';
      progressDialogSettings.actionDetails =
        'Launching the website. This process can take several minutes. ' +
        'If you close this dialog this process will continue in the background. ' +
        'This window will close once the process is complete.';

      this.progressDialogRef = this.dialog.open(ProgressBarDialog, {
        data: progressDialogSettings,
      });
    }

    this.wdTabSvc.launchSite().subscribe(
      (success) => {
        this.progressDialogRef.close();
        this.alertsSvc.alert('Website Successfully Launched');
        //reload page to update the tab structure and display the newly created html
        let website_id = this.wdTabSvc.website_data._id;
        this.wdTabSvc.getWebsiteDetails(website_id);
      },
      (failure) => {
        this.progressDialogRef.close();
        this.alertsSvc.alert(
          'An error occured while launching the website. Please try again',
          undefined,
          10000
        );
        this.wdTabSvc.website_data.is_launching = false;
        console.log(failure);
      }
    );
  }
  takeDownSite() {
    if (this.wdTabSvc.canBeTakenDown()) {
      let progressDialogSettings = new ProgressBarDialogSettings();
      progressDialogSettings.actionInProgress = 'Taking Down Website';
      progressDialogSettings.actionDetails =
        'Taking down the website. This process can take several minutes. ' +
        'If you close this dialog this process will continue in the background. ' +
        'This window will close once the process is complete.';

      this.progressDialogRef = this.dialog.open(ProgressBarDialog, {
        data: progressDialogSettings,
      });
    }

    this.wdTabSvc.takeDownSite().subscribe(
      (success) => {
        this.progressDialogRef.close();
        this.alertsSvc.alert('Website Successfully Taken Down');
        //reload page to update the tab structure and display the newly created html
        let website_id = this.wdTabSvc.website_data._id;
        this.wdTabSvc.getWebsiteDetails(website_id);
      },
      (failure) => {
        this.progressDialogRef.close();
        this.alertsSvc.alert(
          'An error occured while taking down the website. Please try again',
          undefined,
          10000
        );
        this.wdTabSvc.website_data.is_delaunching = false;
        console.log(failure);
      }
    );
  }

  onTabChanged(event) {
    console.log(event);
  }

  deleteWebsite() {
    console.log('trying to delte');
    let confirmDialogSettings = new ConfirmDialogSettings();
    confirmDialogSettings.itemConfirming = 'confirm website delete';
    confirmDialogSettings.actionConfirming = `Are you sure you want to delete ${this.wdTabSvc.website_data.name}, this action is permanent`;

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
            this.alertsSvc.alert('Failed to delete website');
            console.log(failed)
          }
        );
      } else {
        console.log('delete cancled');
      }
    });
  }

  downloadWebsite() {
    let progressDialogSettings = new ProgressBarDialogSettings();
    progressDialogSettings.actionInProgress = 'Downloading Website';
    progressDialogSettings.actionDetails =
      'Preparing website for download. This process can take several minutes. ' +
      'If you close this dialog this process will continue in the background. ' +
      'This window will close once the process is complete.';

    this.progressDialogRef = this.dialog.open(ProgressBarDialog, {
      data: progressDialogSettings,
    });

    this.wdTabSvc.downloadWebsite().subscribe(
      (success) => {
        console.log(success);
        this.downloadObject(this.wdTabSvc.website_data.name + '.zip', success);
        this.progressDialogRef.close();
      },
      (failure) => {
        this.progressDialogRef.close()
        console.log(failure)
        this.alertsSvc.alert("Error downloading website zip")
      }
    );
  }

  downloadObject(filename, blob) {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
}
