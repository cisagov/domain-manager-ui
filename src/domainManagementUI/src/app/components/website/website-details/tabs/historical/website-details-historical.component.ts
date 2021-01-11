// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';

// Local Service Imports
import { WebsiteService } from 'src/app/services/website.service';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';

//Models
import { WebsiteModel } from 'src/app/models/website.model';

@Component({
  selector: 'wd-historical',
  templateUrl: './website-details-historical.component.html',
  styleUrls: ['./website-details-historical.component.scss'],
})
export class WebsiteDetailsHistoricalComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  template_data: WebsiteModel = new WebsiteModel();

  constructor(public wdTabSvc: WebsiteDetailsTabService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
