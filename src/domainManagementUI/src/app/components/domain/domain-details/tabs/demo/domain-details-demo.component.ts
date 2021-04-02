// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { DomainService } from 'src/app/services/domain.service';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { DomainModel } from 'src/app/models/domain.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { ProgressBarDialog } from 'src/app/components/dialog-windows/progress-bar/progress-bar-dialog.component';

@Component({
  selector: 'dd-demo',
  templateUrl: './domain-details-demo.component.html',
  styleUrls: ['./domain-details-demo.component.scss'],
})
export class DomainDetailsDemoComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  safeURL: SafeResourceUrl = null;
  template_data: DomainModel = new DomainModel();

  deleteDialog: MatDialogRef<ConfirmDialogComponent> = null;
  progressDialogRef: MatDialogRef<ProgressBarDialog> = null;

  constructor(
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    public domSanitizer: DomSanitizer,
    public ddTabSvc: DomainDetailsTabService,
    public domainSvc: DomainService,
    public userAuthSvc: UserAuthService,
  ) { }

  ngOnInit(): void {
    this.component_subscriptions.push(
      this.ddTabSvc.getDomainDataBehaviorSubject().subscribe(
        (success) => {
          this.setURL(success);
        },
        (failure) => { }
      )
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  setURL(domain: DomainModel) {
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(
      domain.s3_url + 'home.html'
    );
  }

  openInNewTab() {
    window.open(`${this.ddTabSvc.domain_data.s3_url}home.html`, '_blank');
  }
  newTemplate() {
    let confirmDialogSettings = new ConfirmDialogSettings();
    confirmDialogSettings.itemConfirming = 'Select New Domain Content Data?';
    confirmDialogSettings.actionConfirming = `Are you sure you want to select new domain content? This will remove the current content permanently`;

    this.deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: confirmDialogSettings,
    });
    this.deleteDialog.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.ddTabSvc.templateExists = false;
        this.ddTabSvc.removeTemplate();
      } else {
        console.log('delete cancled');
      }
    });
  }

  approve() {
    this.domainSvc.getDomainApproval(this.ddTabSvc.domain_data._id).subscribe(
      (success) => {
        console.log(success);
        this.alertsSvc.alert("Content has been approved.");
        this.ddTabSvc.domain_data.is_approved = true;
      },
      (failure) => {
        this.progressDialogRef.close();
        console.log(failure);
        this.alertsSvc.alert(failure);
      }
    );
  }

  disapprove() {
    this.domainSvc.getDomainDisapproval(this.ddTabSvc.domain_data._id).subscribe(
      (success) => {
        console.log(success);
        this.alertsSvc.alert("Content has been unapproved.");
        this.ddTabSvc.domain_data.is_approved = false;
      },
      (failure) => {
        this.progressDialogRef.close();
        console.log(failure);
        this.alertsSvc.alert(failure);
      }
    );
  }
}
