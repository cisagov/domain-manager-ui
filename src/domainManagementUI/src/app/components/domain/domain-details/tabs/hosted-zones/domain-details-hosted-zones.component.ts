// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { DomainService } from 'src/app/services/domain.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';

//Models
import { DomainModel } from 'src/app/models/domain.model';

@Component({
  selector: 'dd-hosted-zones',
  templateUrl: './domain-details-hosted-zones.component.html',
  styleUrls: ['./domain-details-hosted-zones.component.scss'],
})
export class DomainDetailsHostedZonesComponent implements OnInit, OnDestroy {
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
