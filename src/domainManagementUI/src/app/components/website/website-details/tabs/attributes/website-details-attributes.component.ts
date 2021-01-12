// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';

// Local Service Imports
import { ApplicationService } from 'src/app/services/applications.service';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { WebsiteModel } from 'src/app/models/website.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { ApplicationListComponent } from 'src/app/components/applications/applications-list/application-list.component';

@Component({
  selector: 'wc-attributes',
  templateUrl: './website-details-attributes.component.html',
  styleUrls: ['./website-details-attributes.component.scss'],
})
export class WebsiteDetailsAttrbutesComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  submitted = false;

  constructor(
    public applicationSvc: ApplicationService,
    public wdTabSvc: WebsiteDetailsTabService
  ) {}

  ngOnInit(): void {
    console.log(this.tabForm);
    console.log(this.f);
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  create() {
    console.log(this.tabForm);
    if (this.wdTabSvc.isValid(this.tabForm)) {
      //this.wdTabSvc.createWebsite();
    } else {
      console.log('invlaid');
    }
  }

  test() {
    this.nextTab();
    console.log(this.tabForm);
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
