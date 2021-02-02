// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';

// Local Service Imports
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';

@Component({
  selector: 'dd-attributes',
  templateUrl: './domain-details-attributes.component.html',
  styleUrls: ['./domain-details-attributes.component.scss'],
})
export class DomainDetailsAttrbutesComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  submitted = false;

  constructor(public ddTabSvc: DomainDetailsTabService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  create() {
    if (this.ddTabSvc.isValid(this.tabForm)) {
      //this.ddTabSvc.createDomain();
    } else {
      console.log('invlaid');
    }
  }

  get tabForm() {
    return this.ddTabSvc.attributes_form;
  }

  get f() {
    return this.ddTabSvc.attributes_form.controls;
  }
  nextTab() {
    this.ddTabSvc.submitTab(this.tabForm);
  }
}
