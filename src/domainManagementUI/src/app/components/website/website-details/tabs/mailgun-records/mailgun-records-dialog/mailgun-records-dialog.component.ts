import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MailgunRecordModel } from 'src/app/models/website.model';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';
import { WebsiteService } from 'src/app/services/website.service';

@Component({
  selector: 'app-manage-redirect-dialog',
  templateUrl: './mailgun-records-dialog.component.html',
  styleUrls: ['./mailgun-records-dialog.component.scss'],
})
export class MailgunRecordsDialogComponent implements OnInit {
  mailgunRecord: MailgunRecordModel;
  isNewMailgunRecord = false;

  mailgunRecordForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    route: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MailgunRecordsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MailgunRecordModel,
    private websiteSvc: WebsiteService,
    private wdTabSvc: WebsiteDetailsTabService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.mailgunRecordForm.get('name').disable();
      this.mailgunRecord = JSON.parse(JSON.stringify(this.data));
    } else {
      this.isNewMailgunRecord = true;
      this.mailgunRecord = new MailgunRecordModel();
    }
  }

  updateMailgunRecord() {
    this.websiteSvc
      .updateMailgunRecord(this.wdTabSvc.website_data._id, this.mailgunRecord)
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  createMailgunRecord() {
    this.websiteSvc
      .createMailgunRecord(this.wdTabSvc.website_data._id, this.mailgunRecord)
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}
