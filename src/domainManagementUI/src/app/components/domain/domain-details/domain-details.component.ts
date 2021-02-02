// Angular Imports
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { LayoutService } from 'src/app/services/layout.service';
import { DomainService } from 'src/app/services/domain.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { ProgressBarDialogSettings } from 'src/app/models/progressBarDialogSettings.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { ProgressBarDialog } from 'src/app/components/dialog-windows/progress-bar/progress-bar-dialog.component';

@Component({
  selector: 'domain-details',
  templateUrl: './domain-details.component.html',
  styleUrls: ['./domain-details.component.scss'],
})
export class DomainDetailsComponent implements OnInit, OnDestroy {
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
    public ddTabSvc: DomainDetailsTabService,
    public domainTemplateSvc: DomainService
  ) {
    this.layoutSvc.setTitle('Domain Details');
  }

  ngOnInit(): void {
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this._id = params['_id'];
        if (this._id !== null) {
          this.loadDomain(this._id);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  loadDomain(_id) {
    this.ddTabSvc.getDomainDetails(_id);
  }

  launchSite() {
    if (this.ddTabSvc.canBeLaunched()) {
      let progressDialogSettings = new ProgressBarDialogSettings();
      progressDialogSettings.actionInProgress = 'Launching Domain';
      progressDialogSettings.actionDetails =
        'Launching the domain. This process can take several minutes. ' +
        'If you close this dialog this process will continue in the background but you will have to remain on this page. ' +
        'This window will close once the process is complete.';

      this.progressDialogRef = this.dialog.open(ProgressBarDialog, {
        data: progressDialogSettings,
      });
    }

    this.ddTabSvc.launchSite().subscribe(
      (success) => {
        this.progressDialogRef.close();
        this.alertsSvc.alert('Domain Successfully Launched');
        //reload page to update the tab structure and display the newly created html
        let domain_id = this.ddTabSvc.domain_data._id;
        this.ddTabSvc.getDomainDetails(domain_id);
      },
      (failure) => {
        this.progressDialogRef.close();
        this.alertsSvc.alert(
          'An error occured while launching the domain. Please try again',
          undefined,
          10000
        );
        this.ddTabSvc.domain_data.is_launching = false;
        console.log(failure);
      }
    );
  }
  takeDownSite() {
    if (this.ddTabSvc.canBeTakenDown()) {
      let progressDialogSettings = new ProgressBarDialogSettings();
      progressDialogSettings.actionInProgress = 'Taking Down Domain';
      progressDialogSettings.actionDetails =
        'Taking down the domain. This process can take several minutes. ' +
        'If you close this dialog this process will continue in the background but you will have to remain on this page. ' +
        'This window will close once the process is complete.';

      this.progressDialogRef = this.dialog.open(ProgressBarDialog, {
        data: progressDialogSettings,
      });
    }

    this.ddTabSvc.takeDownSite().subscribe(
      (success) => {
        this.progressDialogRef.close();
        this.alertsSvc.alert('Domain Successfully Taken Down');
        //reload page to update the tab structure and display the newly created html
        let domain_id = this.ddTabSvc.domain_data._id;
        this.ddTabSvc.getDomainDetails(domain_id);
      },
      (failure) => {
        this.progressDialogRef.close();
        this.alertsSvc.alert(
          'An error occured while taking down the domain. Please try again',
          undefined,
          10000
        );
        this.ddTabSvc.domain_data.is_delaunching = false;
        console.log(failure);
      }
    );
  }

  onTabChanged(event) {
    console.log(event);
  }

  deleteDomain() {
    console.log('trying to delte');
    let confirmDialogSettings = new ConfirmDialogSettings();
    confirmDialogSettings.itemConfirming = 'confirm domain delete';
    confirmDialogSettings.actionConfirming = `Are you sure you want to delete ${this.ddTabSvc.domain_data.name}, this action is permanent`;

    this.deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: confirmDialogSettings,
    });
    this.deleteDialog.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.ddTabSvc.deleteDomain(this.ddTabSvc.domain_data._id).subscribe(
          (success) => {
            this.router.navigate([`/domain`]);
          },
          (failed) => {
            this.alertsSvc.alert('Failed to delete domain');
            console.log(failed);
          }
        );
      } else {
        console.log('delete cancled');
      }
    });
  }

  downloadDomain() {
    let progressDialogSettings = new ProgressBarDialogSettings();
    progressDialogSettings.actionInProgress = 'Downloading Domain';
    progressDialogSettings.actionDetails =
      'Preparing domain for download. This process can take several minutes. ' +
      'If you close this dialog this process will continue in the background but you will have to remain on this page. ' +
      'This window will close once the process is complete.';

    this.progressDialogRef = this.dialog.open(ProgressBarDialog, {
      data: progressDialogSettings,
    });

    this.ddTabSvc.downloadDomain().subscribe(
      (success) => {
        console.log(success);
        this.downloadObject(this.ddTabSvc.domain_data.name + '.zip', success);
        this.progressDialogRef.close();
      },
      (failure) => {
        this.progressDialogRef.close();
        console.log(failure);
        this.alertsSvc.alert('Error downloading domain zip');
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