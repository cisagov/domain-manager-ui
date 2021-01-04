// Angular Imports
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, OnDestroy } from '@angular/core';

// Local Service Imports
import { ApplicationService } from 'src/app/services/applications.service';
import { TemplateDetailsTabService } from 'src/app/services/tab-services/template-details-tabs.service'

//Models
import { TemplateModel } from 'src/app/models/template.model';

@Component({
  selector: 'td-connected-websites',
  templateUrl: './template-details-connected-websites.component.html',
  styleUrls: ['./template-details-connected-websites.component.scss'],
})
export class TemplateDetailsConnectedWebsitesComponent implements OnInit, OnDestroy {

  component_subscriptions = [];
  template_data : TemplateModel = new TemplateModel();

  constructor(
    public applicationSvc: ApplicationService,
    public tdTabSvc: TemplateDetailsTabService,
  ) {
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
