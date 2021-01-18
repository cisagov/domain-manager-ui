//Angular Imports
import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

//Models
import { ProgressBarDialogSettings } from 'src/app/models/progressBarDialogSettings.model';

@Component({
  selector: 'progress-bar-dialog',
  templateUrl: 'progress-bar-dialog.component.html',
  styleUrls: ['./progress-bar-dialog.component.scss'],
})
export class ProgressBarDialog {

  inProgress = false;
  actionInProgress: string;
  actionDetails: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProgressBarDialogSettings,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ProgressBarDialog>
  ) {
    dialogRef.disableClose = true;
    this.actionInProgress = data.actionInProgress;
    this.actionDetails = data.actionDetails;
  }

  closeDialog() {
    this.dialogRef.close('closed');
  }

}
