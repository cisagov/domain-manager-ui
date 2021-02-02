// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';

// Local Service Imports
import { DomainService } from 'src/app/services/domain.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';

//Models
import { DomainModel } from 'src/app/models/domain.model';

@Component({
  selector: 'dd-historical',
  templateUrl: './domain-details-historical.component.html',
  styleUrls: ['./domain-details-historical.component.scss'],
})
export class DomainDetailsHistoricalComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  template_data: DomainModel = new DomainModel();

  constructor(public ddTabSvc: DomainDetailsTabService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
