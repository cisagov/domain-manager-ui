//Angular Imports
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'verify-dialog',
  templateUrl: 'verify-category-dialog.component.html',
})
export class VerifyCategoryDialogComponent {
  inProgress = false;
  itemConfirming: string;
  actionConfirming: string;
  functionOnConfirm: any;
  selectedStatus: string;
  categorizationFormGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<VerifyCategoryDialogComponent>
  ) {
    this.functionOnConfirm = data.functionOnConfirm;
    this.itemConfirming = data.itemConfirming;
    this.actionConfirming = data.actionConfirming;

    this.categorizationFormGroup = new FormGroup({
      categorization_id: new FormControl('', [Validators.required]),
    });
  }

  closeDialog() {
    this.dialogRef.close('closed');
  }

  confirm() {
    this.selectedStatus = this.categorizationFormGroup.controls.categorization_id.value;
    this.dialogRef.close({
      closedStatus: 'confirmed',
      selectedStatus: this.selectedStatus,
    });
  }
}
