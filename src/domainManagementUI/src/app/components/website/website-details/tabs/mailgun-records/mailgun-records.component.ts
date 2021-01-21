import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { MailgunRecordModel } from 'src/app/models/website.model';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';
import { MailgunRecordsDialogComponent } from './mailgun-records-dialog/mailgun-records-dialog.component';
import { WebsiteService } from 'src/app/services/website.service';

@Component({
  selector: 'app-website-details-mailgun',
  templateUrl: './mailgun-records.component.html',
  styleUrls: ['./mailgun-records.component.scss'],
})
export class MailgunRecordsComponent implements OnInit {
  displayedColumns = ['name', 'route', 'select'];

  constructor(
    public wdTabSvc: WebsiteDetailsTabService,
    public dialog: MatDialog,
    public websiteSvc: WebsiteService
  ) {}

  ngOnInit(): void {}

  addMailgunRecord(): void {
    const dialogRef = this.dialog.open(MailgunRecordsDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.wdTabSvc.getWebsiteDetails(this.wdTabSvc.website_data._id);
      }
    });
  }

  editMailgunRecord(mailgunRecord: MailgunRecordModel): void {
    const dialogRef = this.dialog.open(MailgunRecordsDialogComponent, {
      data: mailgunRecord,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.wdTabSvc.getWebsiteDetails(this.wdTabSvc.website_data._id);
      }
    });
  }

  deleteMailgunRecord(mailgunRecord: MailgunRecordModel): void {
    const dialogSettings = new ConfirmDialogSettings();
    dialogSettings.itemConfirming = 'Confirm Mailgun Record Delete';
    dialogSettings.actionConfirming = `Are you sure you want to delete the mailgun record ${mailgunRecord.name} to ${mailgunRecord.route}`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogSettings,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.websiteSvc
          .deleteMailgunRecord(this.wdTabSvc.website_data._id, mailgunRecord)
          .subscribe(() => {
            this.wdTabSvc.getWebsiteDetails(this.wdTabSvc.website_data._id);
          });
      } else {
        dialogRef.close();
      }
    });
  }
}
