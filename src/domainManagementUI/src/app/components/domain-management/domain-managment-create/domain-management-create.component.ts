//Angular Imports
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Local Service Imports
import { ApplicationService } from 'src/app/services/applications.service';
import { DomainManagementService } from 'src/app/services/domain-management.service';

//Models
import { DomainModel } from 'src/app/models/domain.model';

@Component({
  selector: 'domain-create',
  templateUrl: 'domain-management-create.component.html',
  styleUrls: ['./domain-management-create.component.scss'],
})
export class DomainManagementCreateComponent implements OnInit {
  domain_data: DomainModel = new DomainModel();
  domain_form_group: FormGroup;

  constructor(
    public applicationSvc: ApplicationService,
    private domainSvc: DomainManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.applicationSvc.getAllApplications();
  }

  createDomain() {
    if (this.isValid(this.domain_form_group)) {
      console.log('form valid');
      this.domainSvc.createDomain(this.formToApplicationModel()).subscribe(
        (success) => {
          console.log(success);
          this.router.navigate([`/domain-management`]);
        },
        (failure) => {
          console.log('failed to create domain');
          console.log(failure);
        }
      );
    }
  }

  buildForm() {
    this.domain_form_group = new FormGroup({
      name: new FormControl('', { validators: Validators.required }),
      application_uuid: new FormControl('', {
        validators: Validators.required,
      }),
      registrarName: new FormControl('', { validators: Validators.required }),
    });
  }

  formToApplicationModel() {
    let retVal = new DomainModel();
    retVal.name = this.controls['name'].value;
    retVal._id = this.controls['application_uuid'].value;
    retVal.registrarName = this.controls['registrarName'].value;
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
    return this.domain_form_group.controls;
  }
}
