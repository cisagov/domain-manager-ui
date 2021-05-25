// Angular Imports
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomainService } from 'src/app/services/domain.service';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { CSVHelper } from 'src/app/helpers/csvHelper';
import { DomainModel } from 'src/app/models/domain.model';
import { GenericViewComponent } from '../../dialog-windows/generic-view/generic-view.component';
import { GenericDialogSettings } from 'src/app/models/genericDialogSettings.model';

@Component({
  selector: 'app-domain-create',
  templateUrl: 'domain-create-dialog.component.html',
})
export class DomainCreateDialogComponent implements OnInit {
  domainForm = new FormGroup({
    url: new FormControl('', {
      validators: [Validators.required, this.domainValidator()],
    }),
  });

  existingDomainNames: string[] = [];

  constructor(
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DomainCreateDialogComponent>,
    private domainSvc: DomainService
  ) {}

  ngOnInit() {
    this.getExistingDomains();
  }

  async getExistingDomains() {
    const domains = await this.domainSvc.getDomains();
    domains.forEach((domain: DomainModel) => {
      this.existingDomainNames.push(domain.name);
    });
  }

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
      (resp: any) => {
        const genericSettings = new GenericDialogSettings(
          resp,
          'Domain',
          'Status'
        );
        this.dialog.open(GenericViewComponent, { data: genericSettings });
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

  private domainValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
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
        if (url !== '' && !url.match(regex)) {
          errors.push(`${url} is an invalid url`);
        }
        if (
          this.existingDomainNames &&
          this.existingDomainNames.includes(url)
        ) {
          errors.push(`${url} currently exists`);
        }
      });

      if (errors.length) {
        return {
          urlErrors: errors,
        };
      }
      return null;
    };
  }
}
