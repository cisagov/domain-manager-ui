// Angular Imports
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomainService } from 'src/app/services/domain.service';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { CSVHelper } from 'src/app/helpers/csvHelper';

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

  constructor(
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DomainCreateDialogComponent>,
    private domainSvc: DomainService
  ) {}

  ngOnInit(): void {}

  createDomain() {
    const input = this.domainForm.get('url').value;
    const urls = input
      .replace(/(\r\n|\n|\r)/gm, ',') // remove eol
      .replace(/\s/g, '') // remove spaces
      .split(',');
    const vals = [];
    urls.forEach((url) => {
      if (url) {
        vals.push(url);
      }
    });

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
  fileSelect(e: any) {
    const file: any = e.target.files[0];

    const x = new CSVHelper();
    x.convertCsv(file).then((xyz: string) => {
      this.domainForm.get('url').setValue(xyz);
      this.domainForm.markAllAsTouched();
    });
  }
  /**
   * Programatically clicks the corresponding file upload element.
   */
  openFileBrowser(event: any) {
    event.preventDefault();
    const element: HTMLElement = document.getElementById(
      'csvUpload'
    ) as HTMLElement;
    element.click();
  }
}
function validateURLs(control: FormControl) {
  const input = control.value as string;
  const urls = input
    .replace(/(\r\n|\n|\r)/gm, ',') // remove eol
    .replace(/\s/g, '') // remove spaces
    .split(',');

  const expression =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,24}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  const regex = new RegExp(expression);

  const errors = [];

  urls.forEach((url) => {
    if (url !== '') {
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
