//Angular Imports
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

//Models
import { ApplicationModel } from 'src/app/models/application.model';

@Component({
  selector: 'application-create',
  templateUrl: 'application-create-dialog.component.html',
})
export class ApplicationCreateDialog implements OnInit {
  application_data: ApplicationModel = new ApplicationModel();
  application_form_group: FormGroup;

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ApplicationCreateDialog>
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }
  closeDialog() {
    this.dialogRef.close(false);
  }

  createApplication() {
    if (this.isValid(this.application_form_group)) {
      this.dialogRef.close(this.formToApplicationModel());
    } else {
      console.log('invlid form');
    }
  }

  buildForm() {
    this.application_form_group = new FormGroup({
      application_name: new FormControl('', {
        validators: Validators.required,
      }),
      requester_name: new FormControl('', { validators: Validators.required }),
    });
  }

  formToApplicationModel() {
    let retVal = new ApplicationModel();
    retVal.application_name = this.controls['application_name'].value;
    retVal.requester_name = this.controls['requester_name'].value;
    return retVal;
  }

  isValid(form: FormGroup) {
    if (form.valid) {
      return true;
    } else {
      form.markAllAsTouched();
      return false;
    }
  }

  get controls() {
    return this.application_form_group.controls;
  }
}
