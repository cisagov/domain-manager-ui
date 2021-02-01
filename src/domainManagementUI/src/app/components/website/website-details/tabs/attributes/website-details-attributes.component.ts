// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';

// Local Service Imports
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';

@Component({
  selector: 'wc-attributes',
  templateUrl: './website-details-attributes.component.html',
  styleUrls: ['./website-details-attributes.component.scss'],
})
export class WebsiteDetailsAttrbutesComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  submitted = false;

  constructor(public wdTabSvc: WebsiteDetailsTabService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  create() {
    if (this.wdTabSvc.isValid(this.tabForm)) {
      //this.wdTabSvc.createWebsite();
    } else {
      console.log('invlaid');
    }
  }

  get tabForm() {
    return this.wdTabSvc.attributes_form;
  }

  get f() {
    return this.wdTabSvc.attributes_form.controls;
  }
  nextTab() {
    this.wdTabSvc.submitTab(this.tabForm);
  }
}
