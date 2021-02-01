import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { RecordModel } from 'src/app/models/website.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';
import { WebsiteService } from 'src/app/services/website.service';
import { DnsRecordsDialogComponent } from './dns-records-dialog/dns-records-dialog.component';

@Component({
  selector: 'app-website-details-dns-records',
  templateUrl: './dns-records.component.html',
  styleUrls: ['./dns-records.component.scss'],
})
export class DnsRecordsComponent implements OnInit {
  displayedColumns = ['name', 'record_type', 'select'];

  constructor(
    public wdTabSvc: WebsiteDetailsTabService,
    public dialog: MatDialog,
    public websiteSvc: WebsiteService,
    public alertsSvc: AlertsService
  ) {}

  ngOnInit(): void {}

  addRecord() {
    const dialogRef = this.dialog.open(DnsRecordsDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.wdTabSvc.getWebsiteDetails(this.wdTabSvc.website_data._id);
      }
    });
  }

  deleteRecord(record: RecordModel) {
    const dialogSettings = new ConfirmDialogSettings();
    dialogSettings.itemConfirming = `Confirm Record Delete`;
    dialogSettings.actionConfirming = `Are you sure want to delete the record - ${record.record_type} ${record.name}`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogSettings,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.websiteSvc
          .deleteRecord(this.wdTabSvc.website_data._id, record.record_id)
          .subscribe(
            () => {
              this.wdTabSvc.getWebsiteDetails(this.wdTabSvc.website_data._id);
            },
            () => {
              this.alertsSvc.alert('Error deleting record.');
            }
          );
      } else {
        dialogRef.close();
      }
    });
  }

  editRecord(record: RecordModel) {
    const dialogRef = this.dialog.open(DnsRecordsDialogComponent, {
      data: record,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.wdTabSvc.getWebsiteDetails(this.wdTabSvc.website_data._id);
      }
    });
  }
}
