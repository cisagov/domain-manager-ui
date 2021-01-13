import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RedirectModel } from 'src/app/models/website.model';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';
import { WebsiteService } from 'src/app/services/website.service';

@Component({
  selector: 'app-manage-redirect-dialog',
  templateUrl: './manage-redirect-dialog.component.html',
  styleUrls: ['./manage-redirect-dialog.component.scss'],
})
export class ManageRedirectDialogComponent implements OnInit {
  redirect: RedirectModel;
  isNewRedirect = false;

  redirectForm = new FormGroup({
    subdomain: new FormControl('', [Validators.required]),
    redirectUrl: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ManageRedirectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RedirectModel,
    private websiteSvc: WebsiteService,
    private wdTabSvc: WebsiteDetailsTabService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.redirectForm.get('subdomain').disable();
      this.redirect = JSON.parse(JSON.stringify(this.data));
    } else {
      this.isNewRedirect = true;
      this.redirect = new RedirectModel();
    }
  }

  updateRedirect() {
    this.websiteSvc
      .updateRedirect(this.wdTabSvc.website_data._id, this.redirect)
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  createRedirect() {
    this.websiteSvc
      .createRedirect(this.wdTabSvc.website_data._id, this.redirect)
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}
