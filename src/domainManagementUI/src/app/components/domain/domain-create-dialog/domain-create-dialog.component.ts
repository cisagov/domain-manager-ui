//Angular Imports
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
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
    url: new FormControl('', {
      validators: [Validators.required, validateURLs],
    }),
  });

  urlErrors: string = 'test error';

  constructor(
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DomainCreateDialogComponent>,
    private domainSvc: DomainService
  ) {}

  ngOnInit(): void {}

  createDomain() {
    const input = this.domainForm.get('url').value;
    let urls = input
      .replace(/(\r\n|\n|\r)/gm, '') //remove eol
      .replace(/\s/g, '') //remove spaces
      .split(',');
    let vals = [];
    urls.forEach((url) => {
      if (url) {
        vals.push(url);
      }
    });

    console.log(vals);
    this.domainSvc.createDomain(vals).subscribe(
      () => {
        this.dialogRef.close(true);
      },
      (failure) => {
        this.alertsSvc.alert('Failed to create domains.');
        console.log(failure);
      }
    );
  }
}
function validateURLs(control: FormControl) {
  1;

  let input = control.value as string;
  let urls = input
    .replace(/(\r\n|\n|\r)/gm, '') //remove eol
    .replace(/\s/g, '') //remove spaces
    .split(',');

  var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  let errors = [];

  urls.forEach((url) => {
    if (url != '') {
      if (url.match(regex)) {
        console.log(url);
      } else {
        errors.push(`${url} is an invalid url`);
      }
    }
  });

  console.log(urls);

  if (errors.length) {
    return {
      urlErrors: errors,
    };
  }
  return null;
}
