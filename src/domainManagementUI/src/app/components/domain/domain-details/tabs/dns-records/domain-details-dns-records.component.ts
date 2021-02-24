import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { RecordModel } from 'src/app/models/domain.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';
import { DomainService } from 'src/app/services/domain.service';
import { DnsRecordsDialogComponent } from './dns-records-dialog/dns-records-dialog.component';

@Component({
  selector: 'dd-dns-records',
  templateUrl: './domain-details-dns-records.component.html',
  styleUrls: ['./domain-details-dns-records.component.scss'],
})
export class DominDetailsDnsRecordsComponent implements OnInit {
  displayedColumns = ['name', 'record_type', 'select'];

  constructor(
    public ddTabSvc: DomainDetailsTabService,
    public dialog: MatDialog,
    public domainSvc: DomainService,
    public alertsSvc: AlertsService
  ) { }

  ngOnInit(): void { }

  addRecord() {
    const dialogRef = this.dialog.open(DnsRecordsDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ddTabSvc.getDomainDetails(this.ddTabSvc.domain_data._id);
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
        this.domainSvc
          .deleteRecord(this.ddTabSvc.domain_data._id, record.record_id)
          .subscribe(
            () => {
              this.ddTabSvc.getDomainDetails(this.ddTabSvc.domain_data._id);
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
        this.ddTabSvc.getDomainDetails(this.ddTabSvc.domain_data._id);
      }
    });
  }
}
