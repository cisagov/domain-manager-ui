//Angular Imports
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomainService } from 'src/app/services/domain.service';

//Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-domain-create',
  templateUrl: 'domain-create-dialog.component.html',
})
export class DomainCreateDialogComponent implements OnInit {
  domainForm = new FormGroup({
    url: new FormControl('', { validators: Validators.required }),
  });

  constructor(
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DomainCreateDialogComponent>,
    private domainSvc: DomainService
  ) {}

  ngOnInit(): void {}

  createDomain() {
    const url = this.domainForm.get('url').value;
    this.domainSvc.createDomain(url).subscribe(
      () => {
        this.dialogRef.close(true);
      },
      (failure) => {
        this.alertsSvc.alert('Failed to create domain.');
        console.log(failure);
      }
    );
  }
}
