// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';

// Local Service Imports
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';

@Component({
  selector: 'dd-hosted-zone',
  templateUrl: './domain-details-hosted-zone.component.html',
  styleUrls: ['./domain-details-hosted-zone.component.scss'],
})
export class DomainDetailsHostedZoneComponent implements OnInit, OnDestroy {
  component_subscriptions = [];

  constructor(public ddTabSvc: DomainDetailsTabService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  test() {}
}
