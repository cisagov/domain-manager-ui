// Angular Imports
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

// Local Service Imports
import { ApplicationService } from 'src/app/services/applications.service';
import { DomainManagementTabService } from 'src/app/services/tab-services/domain-management-tabs.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'dmGeneralAttributesTab',
  templateUrl: './domain-management-general-attributes.component.html',
})
export class DomainManagementGeneralAttributesTab implements OnInit {
  subscriptions = Array<Subscription>();

  constructor(
    public applicationSvc: ApplicationService,
    public domainTabSvc: DomainManagementTabService,
    public formBuilder: FormBuilder,
    public layoutSvc: LayoutService
  ) {}

  ngOnInit(): void {}

  get tabForm() {
    return this.domainTabSvc.gen_attribute_tab_form;
  }

  get f() {
    return this.domainTabSvc.gen_attribute_tab_form.controls;
  }

  nextTab() {
    this.domainTabSvc.submitTab(this.tabForm);
  }

  test() {
    console.log(this.applicationSvc.application_list);
    console.log(this.domainTabSvc.gen_attribute_tab_form);
    this.domainTabSvc.domainData.uuid += '&';
    this.domainTabSvc.gen_attribute_tab_form.markAllAsTouched();
    //this.domainTabSvc.submitTab(this.tabForm)
  }
}
