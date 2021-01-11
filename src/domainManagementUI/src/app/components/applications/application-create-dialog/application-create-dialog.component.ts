// Angular Imports
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// Models
import { ApplicationModel } from 'src/app/models/application.model';
import { ApplicationService } from 'src/app/services/applications.service';

@Component({
  selector: 'app-application-create',
  templateUrl: 'application-create-dialog.component.html',
})
export class ApplicationCreateDialogComponent implements OnInit {
  applicationFormGroup: FormGroup;

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ApplicationCreateDialogComponent>,
    private applicationSvc: ApplicationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  createApplication() {
    if (this.isValid(this.applicationFormGroup)) {
      const data = this.formToApplicationModel();
      this.applicationSvc.createApplication(data).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      console.log('invalid form');
    }
  }

  buildForm() {
    this.applicationFormGroup = new FormGroup({
      name: new FormControl('', {
        validators: Validators.required,
      }),
      requester_name: new FormControl('', { validators: Validators.required }),
    });
  }

  formToApplicationModel() {
    const retVal = new ApplicationModel();
    retVal.name = this.controls.name.value;
    retVal.requester_name = this.controls.requester_name.value;
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
    return this.applicationFormGroup.controls;
  }
}
