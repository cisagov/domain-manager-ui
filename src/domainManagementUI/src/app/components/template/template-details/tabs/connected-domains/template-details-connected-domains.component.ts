// Angular Imports
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, OnDestroy } from '@angular/core';

// Local Service Imports
import { TemplateDetailsTabService } from 'src/app/services/tab-services/template-details-tabs.service';

//Models
import { TemplateModel } from 'src/app/models/template.model';

@Component({
  selector: 'td-connected-domains',
  templateUrl: './template-details-connected-domains.component.html',
  styleUrls: ['./template-details-connected-domains.component.scss'],
})
export class TemplateDetailsConnectedDomainsComponent
  implements OnInit, OnDestroy {
  component_subscriptions = [];
  template_data: TemplateModel = new TemplateModel();

  constructor(public tdTabSvc: TemplateDetailsTabService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}