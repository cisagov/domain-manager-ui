// Angular Imports
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { TemplateDetailsTabService } from 'src/app/services/tab-services/template-details-tabs.service';
import { TemplateService } from 'src/app/services/template.service';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { ProgressBarDialogSettings } from 'src/app/models/progressBarDialogSettings.model';
import { TemplateModel } from 'src/app/models/template.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { ProgressBarDialog } from 'src/app/components/dialog-windows/progress-bar/progress-bar-dialog.component';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'td-demo',
  templateUrl: './template-details-demo.component.html',
  styleUrls: ['./template-details-demo.component.scss'],
})
export class TemplateDetailsDemoComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  safeURL: SafeResourceUrl = null;
  template_data: TemplateModel = new TemplateModel();

  deleteDialog: MatDialogRef<ConfirmDialogComponent> = null;
  progressDialogRef: MatDialogRef<ProgressBarDialog> = null;

  constructor(
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    public domSanitizer: DomSanitizer,
    private router: Router,
    public tdTabSvc: TemplateDetailsTabService,
    public userAuthSvc: UserAuthService,
    public templateSvc: TemplateService
  ) {}

  ngOnInit(): void {
    this.component_subscriptions.push(
      this.tdTabSvc.getTemplateDataBehaviorSubject().subscribe(
        (success) => {
          this.setURL(success);
        },
        (failure) => {}
      )
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  setURL(template: TemplateModel) {
    console.log(template);
    if (this.tdTabSvc.template_data.is_go_template) {
      var url = `https://${this.tdTabSvc.template_data.s3_url}preview/home.html`;
    } else {
      var url = `https://${this.tdTabSvc.template_data.s3_url}template/home.html`;
    }
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    console.log(this.safeURL);
  }

  openInNewTab() {
    if (this.tdTabSvc.template_data.is_go_template) {
      var url = `https://${this.tdTabSvc.template_data.s3_url}preview/home.html`;
    } else {
      var url = `https://${this.tdTabSvc.template_data.s3_url}template/home.html`;
    }

    window.open(url, '_blank');
  }

  download() {
    let progressDialogSettings = new ProgressBarDialogSettings();
    progressDialogSettings.actionInProgress = 'Downloading Template';
    progressDialogSettings.actionDetails =
      'Preparing the template for download. This process can take up to a minute. ' +
      'If you close this dialog this process will continue in the background but you will have to remain on this page. ' +
      'This window will close once the process is complete.';

    this.progressDialogRef = this.dialog.open(ProgressBarDialog, {
      data: progressDialogSettings,
    });

    this.tdTabSvc.downloadTemplate(this.tdTabSvc.template_data._id).subscribe(
      (success) => {
        this.progressDialogRef.close();
        this.downloadObject(this.tdTabSvc.template_data.name + '.zip', success);
        console.log(success);
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

  delete() {
    const confirmDialogSettings = new ConfirmDialogSettings();
    confirmDialogSettings.itemConfirming = 'confirm domain delete';
    confirmDialogSettings.actionConfirming = `Are you sure you want to delete ${this.tdTabSvc.template_data.name}`;

    this.deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: confirmDialogSettings,
    });
    this.deleteDialog.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.tdTabSvc.deleteTemplate(this.tdTabSvc.template_data._id).subscribe(
          (success) => {
            this.router.navigate([`/template`]);
          },
          (failed) => {
            this.alertsSvc.alert('Failed to delete template');
          }
        );
      }
    });
  }

  createDomainFromTemplate(uuid) {
    this.router.navigate([`/domain/creation/${uuid}`]);
  }

  approve() {
    this.templateSvc.approveTemplate(this.tdTabSvc.template_data._id).subscribe(
      (success) => {
        console.log(success);
        this.alertsSvc.alert('Template has been approved.');
        this.tdTabSvc.template_data.is_approved = true;
      },
      (failure) => {
        this.progressDialogRef.close();
        console.log(failure);
        this.alertsSvc.alert(failure);
      }
    );
  }

  disapprove() {
    this.templateSvc
      .disapproveTemplate(this.tdTabSvc.template_data._id)
      .subscribe(
        (success) => {
          console.log(success);
          this.alertsSvc.alert('Template has been unapproved.');
          this.tdTabSvc.template_data.is_approved = false;
        },
        (failure) => {
          this.progressDialogRef.close();
          console.log(failure);
          this.alertsSvc.alert(failure);
        }
      );
  }
}
