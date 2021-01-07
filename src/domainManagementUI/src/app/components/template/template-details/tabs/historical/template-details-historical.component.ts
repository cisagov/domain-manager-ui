// Angular Imports
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, OnDestroy } from '@angular/core';

// Local Service Imports
import { TemplateService } from 'src/app/services/template.service';
import { TemplateDetailsTabService } from 'src/app/services/tab-services/template-details-tabs.service';

//Models
import { TemplateModel } from 'src/app/models/template.model';

@Component({
  selector: 'td-historical',
  templateUrl: './template-details-historical.component.html',
  styleUrls: ['./template-details-historical.component.scss'],
})
export class TemplateDetailsHistoricalComponent implements OnInit, OnDestroy {
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
