// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { WebsiteService } from 'src/app/services/website.service';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { WebsiteModel } from 'src/app/models/website.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';

@Component({
  selector: 'wd-demo',
  templateUrl: './website-details-demo.component.html',
  styleUrls: ['./website-details-demo.component.scss'],
})
export class WebsiteDetailsDemoComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  safeURL: SafeResourceUrl = null;
  template_data: WebsiteModel = new WebsiteModel();


  deleteDialog: MatDialogRef<ConfirmDialogComponent> = null;

  constructor(
    public dialog: MatDialog,
    public domSanitizer: DomSanitizer,
    public wdTabSvc: WebsiteDetailsTabService
  ) {}

  ngOnInit(): void {
    this.component_subscriptions.push(
      this.wdTabSvc.getWebsiteDataBehaviorSubject().subscribe(
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

  setURL(website: WebsiteModel) {
    console.log(website);
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(
      website.s3_url + 'home.html'
    );
    console.log(this.safeURL);
  }

  openInNewTab() {
    window.open(this.wdTabSvc.website_data.s3_url, '_blank');
  }
  newTemplate() {
    let confirmDialogSettings = new ConfirmDialogSettings();
    confirmDialogSettings.itemConfirming = 'Select New Website Content Data?';
    confirmDialogSettings.actionConfirming = `Are you sure you want to select new website conten? This will remove the current content permanently`;


    this.deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: confirmDialogSettings,
    });
    this.deleteDialog.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.wdTabSvc.templateExists = false;
        this.wdTabSvc.removeTemplate();
      } else {
        console.log('delete cancled');
      }
    });

  }
  test() {}
}
