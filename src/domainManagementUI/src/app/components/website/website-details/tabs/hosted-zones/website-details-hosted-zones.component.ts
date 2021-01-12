// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { WebsiteService } from 'src/app/services/website.service';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';

//Models
import { WebsiteModel } from 'src/app/models/website.model';

@Component({
  selector: 'wd-hosted-zones',
  templateUrl: './website-details-hosted-zones.component.html',
  styleUrls: ['./website-details-hosted-zones.component.scss'],
})
export class WebsiteDetailsHostedZonesComponent implements OnInit, OnDestroy {
  component_subscriptions = [];

  constructor(
    public wdTabSvc: WebsiteDetailsTabService,
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  test() {}
}
