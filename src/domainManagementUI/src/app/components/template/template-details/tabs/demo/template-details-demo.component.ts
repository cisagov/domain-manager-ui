// Angular Imports
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { TemplateService } from 'src/app/services/template.service';
import { TemplateDetailsTabService } from 'src/app/services/tab-services/template-details-tabs.service';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { TemplateModel } from 'src/app/models/template.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { fileURLToPath } from 'url';

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

  constructor(
    public dialog: MatDialog,
    public domSanitizer: DomSanitizer,
    private router: Router,
    public tdTabSvc: TemplateDetailsTabService
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
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(
      template.s3_url
    );
    console.log(this.safeURL);
  }

  openInNewTab() {
    window.open(this.tdTabSvc.template_data.s3_url, '_blank');
  }

  download() {
    this.tdTabSvc.downloadTemplate(this.tdTabSvc.template_data._id).subscribe(
      (success) => {
        console.log(success);
      },
      (failure) => {
        console.log('Failed to download');
        console.log(failure);
      }
    );
  }

  delete(_id) {
    let confirmDialogSettings = new ConfirmDialogSettings();
    confirmDialogSettings.itemConfirming = 'confirm website delete';
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
          (failed) => {}
        );
      } else {
        console.log('delete cancled');
      }
    });
  }

  createWebsiteFromTemplate(uuid) {
    console.log(
      `going to website creation page, using ${uuid} as uuid for template selection`
    );

    this.router.navigate([`/website/creation/${uuid}`]);
  }

  test() {
    console.log(this.tdTabSvc.template_data_attributes[0]);
  }
}
