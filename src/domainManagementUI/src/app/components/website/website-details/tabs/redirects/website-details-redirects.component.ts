import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { RedirectModel } from 'src/app/models/website.model';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';
import { ManageRedirectDialogComponent } from './manage-redirect-dialog/manage-redirect-dialog.component';
import { WebsiteService } from 'src/app/services/website.service';

@Component({
  selector: 'app-website-details-redirects',
  templateUrl: './website-details-redirects.component.html',
  styleUrls: ['./website-details-redirects.component.scss'],
})
export class WebsiteDetailsRedirectsComponent implements OnInit {
  displayedColumns = ['subdomain', 'redirect_url', 'select'];

  constructor(
    public wdTabSvc: WebsiteDetailsTabService,
    public dialog: MatDialog,
    public websiteSvc: WebsiteService
  ) {}

  ngOnInit(): void {}

  addRedirect(): void {
    const dialogRef = this.dialog.open(ManageRedirectDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.wdTabSvc.getWebsiteDetails(this.wdTabSvc.website_data._id);
      }
    });
  }

  editRedirect(redirect: RedirectModel): void {
    const dialogRef = this.dialog.open(ManageRedirectDialogComponent, {
      data: redirect,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.wdTabSvc.getWebsiteDetails(this.wdTabSvc.website_data._id);
      }
    });
  }

  deleteRedirect(redirect: RedirectModel): void {
    const dialogSettings = new ConfirmDialogSettings();
    dialogSettings.itemConfirming = 'Confirm Redirect Delete';
    dialogSettings.actionConfirming = `Are you sure you want to delete the redirect ${redirect.subdomain} to ${redirect.redirect_url}`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogSettings,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.websiteSvc
          .deleteRedirect(this.wdTabSvc.website_data._id, redirect.subdomain)
          .subscribe(() => {
            this.wdTabSvc.getWebsiteDetails(this.wdTabSvc.website_data._id);
          });
      } else {
        dialogRef.close();
      }
    });
  }
}
