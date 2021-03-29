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
    name: new FormControl(''),
    aValue: new FormControl('', [
      this.isRequired('A'),
      Validators.pattern(
        '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
      ),
    ]),
    aaaaValue: new FormControl('', [
      this.isRequired('AAAA'),
      Validators.pattern(
        '^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$'
      ),
    ]),
    cnameValue: new FormControl('', [
      this.isRequired('CNAME'),
      this.validateDomain(),
    ]),
    mxValue: new FormControl('', [this.isRequired('MX')]),
    nsValue: new FormControl('', [this.isRequired('NS')]),
    ptrValue: new FormControl('', [
      this.isRequired('PTR'),
      Validators.pattern(
        '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
      ),
    ]),
    srvValue: new FormControl('', [this.isRequired('SRV')]),
    txtValue: new FormControl('', [this.isRequired('TXT')]),
    redirectValue: new FormControl('', [
      this.isRequired('REDIRECT'),
      this.validateDomain(),
    ]),
    protocol: new FormControl('http', [this.isRequired('REDIRECT')]),
    mailgunValue: new FormControl('', [this.isRequired('MAILGUN')]),
  });

  recordTypes = [
    'A',
    'AAAA',
    'CNAME',
    'MX',
    'PTR',
    'NS',
    'SRV',
    'TXT',
    'REDIRECT',
  ];
  protocols = ['http', 'https'];

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DnsRecordsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecordModel,
    private domainSvc: DomainService,
    public ddTabSvc: DomainDetailsTabService,
    public alertsSvc: AlertsService
  ) {}

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
    // Clone the object so it doesn't mess with the form.
    const recordClone = Object.assign({}, this.record);
    if (!recordClone.name) {
      recordClone.name = this.ddTabSvc.domain_data.name;
    } else {
      recordClone.name = `${recordClone.name}.${this.ddTabSvc.domain_data.name}`;
    }
    this.domainSvc
      .createRecord(this.ddTabSvc.domain_data._id, recordClone)
      .subscribe(
        () => {
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error.error);
          this.alertsSvc.alert(error.error);
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

  createFormControl() {}

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

    switch (this.record.record_type) {
      case 'A':
        return this.recordForm.get('aValue').valid;
      case 'AAAA':
        return this.recordForm.get('aaaaValue').valid;
      case 'CNAME':
        return this.recordForm.get('cnameValue').valid;
      case 'MX':
        return this.recordForm.get('mxValue').valid;
      case 'NS':
        return this.recordForm.get('nsValue').valid;
      case 'PTR':
        return this.recordForm.get('ptrValue').valid;
      case 'SRV':
        return this.recordForm.get('srvValue').valid;
      case 'TXT':
        return this.recordForm.get('txtValue').valid;
      case 'REDIRECT':
        return (
          this.recordForm.get('redirectValue').valid &&
          this.recordForm.get('protocol').valid
        );
    }
  }
}
