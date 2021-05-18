import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ApplicationModel } from 'src/app/models/application.model';
import { ApplicationService } from 'src/app/services/applications.service';

@Component({
  selector: 'app-application-edit-dialog',
  templateUrl: './application-edit-dialog.component.html',
  styleUrls: ['./application-edit-dialog.component.scss'],
})
export class ApplicationEditDialogComponent implements OnInit {
  application: ApplicationModel;
  isNewApp = false;

  applicationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    contactName: new FormControl(),
    contactEmail: new FormControl('', [Validators.email]),
    contactPhone: new FormControl(),
  });

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ApplicationEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationModel,
    private applicationSvc: ApplicationService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.application = JSON.parse(JSON.stringify(this.data));
    } else {
      this.isNewApp = true;
      this.application = new ApplicationModel();
    }
    console.log(this.isNewApp);
  }

  updateApplication() {
    this.applicationSvc
      .updateApplication(this.application._id, this.application)
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  createApplication() {
    this.applicationSvc.createApplication(this.application).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
