// Angular Imports
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomainService } from 'src/app/services/domain.service';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { DomainModel } from 'src/app/models/domain.model';
import { GenericViewComponent } from '../../dialog-windows/generic-view/generic-view.component';
import { GenericDialogSettings } from 'src/app/models/genericDialogSettings.model';

@Component({
  selector: 'app-domain-create',
  templateUrl: 'categorization-reject-dialog.component.html',
})
export class CategorizationRejectDialogComponent implements OnInit {
  rejectForm = new FormGroup({
    rejectReason: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  existingDomainNames: string[] = [];

  constructor(
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<CategorizationRejectDialogComponent>,
    private domainSvc: DomainService,
  ) {}

  ngOnInit() {}

  confirm() {
    console.log(this.rejectForm.controls['rejectReason'].value);
    if (this.rejectForm.valid) {
      this.dialogRef.close(this.rejectForm.controls['rejectReason'].value);
    }
  }
}
