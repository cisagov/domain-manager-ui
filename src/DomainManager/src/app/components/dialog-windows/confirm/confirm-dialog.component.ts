//Angular Imports
import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  inProgress = false;

  itemConfirming: string;
  actionConfirming: string;
  functionOnConfirm: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogSettings,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {
    this.functionOnConfirm = data.functionOnConfirm;
    this.itemConfirming = data.itemConfirming;
    this.actionConfirming = data.actionConfirming;
  }

  closeDialog() {
    this.dialogRef.close('closed');
  }

  confirm() {
    this.dialogRef.close('confirmed');
  }
}
