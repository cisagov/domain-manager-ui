//Angular Imports
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-categorize-dialog.component.html',
})
export class ConfirmCategoryDialogComponent {
  inProgress = false;
  itemConfirming: string;
  actionConfirming: string;
  functionOnConfirm: any;
  selectedCategory: string;
  categorizationFormGroup: FormGroup;
  defaultValue: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ConfirmCategoryDialogComponent>
  ) {
    this.functionOnConfirm = data.functionOnConfirm;
    this.itemConfirming = data.itemConfirming;
    this.actionConfirming = data.actionConfirming;
    this.defaultValue = data.preferredCategory;
    this.categorizationFormGroup = new FormGroup({
      categorization_id: new FormControl('', [Validators.required]),
    });
  }

  closeDialog() {
    this.dialogRef.close('closed');
  }

  confirm() {
    this.selectedCategory = this.categorizationFormGroup.controls.categorization_id.value;
    this.dialogRef.close({
      closedStatus: 'confirmed',
      selectedCategory: this.selectedCategory,
    });
  }
}
