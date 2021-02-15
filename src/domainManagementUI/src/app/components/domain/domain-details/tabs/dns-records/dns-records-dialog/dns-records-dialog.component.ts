import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RecordModel } from 'src/app/models/domain.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';
import { DomainService } from 'src/app/services/domain.service';

@Component({
  selector: 'app-dns-records-dialog',
  templateUrl: './dns-records-dialog.component.html',
  styleUrls: ['./dns-records-dialog.component.scss'],
})
export class DnsRecordsDialogComponent implements OnInit {
  isNewRecord = false;
  record = new RecordModel();
  formValid = false;

  recordForm = new FormGroup({
    recordType: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, this.validateRecordName()]),
    aValue: new FormControl('', [
      this.isRequired('A'),
      Validators.pattern(
        '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
      ),
    ]),
    cnameValue: new FormControl('', [
      this.isRequired('CNAME'),
      this.validateDomain(),
    ]),
    redirectValue: new FormControl('', [
      this.isRequired('REDIRECT'),
      this.validateDomain(),
    ]),
    mailgunKey: new FormControl('', [this.isRequired('MAILGUN')]),
    mailgunValue: new FormControl('', [this.isRequired('MAILGUN')]),
  });

  recordTypes = ['A', 'CNAME', 'REDIRECT', 'MAILGUN'];

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DnsRecordsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecordModel,
    private domainSvc: DomainService,
    public ddTabSvc: DomainDetailsTabService,
    public alertsSvc: AlertsService
  ) { }

  ngOnInit(): void {
    this.onChanges();
    if (this.data) {
      this.record = JSON.parse(JSON.stringify(this.data));
      this.recordForm.disable();
    } else {
      this.isNewRecord = true;
    }
  }

  createRecord() {
    this.domainSvc
      .createRecord(this.ddTabSvc.domain_data._id, this.record)
      .subscribe(
        () => {
          this.dialogRef.close(true);
        },
        () => {
          this.alertsSvc.alert('Error creating record.');
        }
      );
  }

  updateRecord() {
    console.log('Not implemented yet.');
  }

  isRequired(recordType: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.record.record_type) {
        const isRequired = this.record.record_type === recordType;
        return isRequired ? null : { isRequired: control.value };
      }
      return null;
    };
  }

  createFormControl() { }

  validateDomain(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value === 'localhost') {
        return null;
      }
      const regex = /^^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
      if (regex.test(control.value)) {
        return null;
      }
      return {
        invalidDomain: control.value,
      };
    };
  }

  test() {
    console.log(this.recordForm);
  }

  onChanges() {
    this.recordForm.valueChanges.subscribe(() => {
      this.formValid = this.isValid();
    });
  }

  isValid() {
    if (
      this.recordForm.get('name').invalid ||
      this.recordForm.get('recordType').invalid
    ) {
      return false;
    }
    if (this.record.record_type === 'A') {
      return this.recordForm.get('aValue').valid;
    }
    if (this.record.record_type === 'CNAME') {
      return this.recordForm.get('cnameValue').valid;
    }
    if (this.record.record_type === 'REDIRECT') {
      return this.recordForm.get('redirectValue').valid;
    }
    if (this.record.record_type === 'MAILGUN') {
      return this.recordForm.get('mailgunValue').valid;
    }
  }

  validateRecordName(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const endsWithDomain = control.value
        ?.toLowerCase()
        .endsWith(this.ddTabSvc.domain_data.name);
      return endsWithDomain ? null : { endsWithDomain: control.value };
    };
  }
}
