// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Local Service Imports
import { DomainUtilizationService } from 'src/app/services/domain-utilization.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'domain-utilization-details',
  templateUrl: './domain-utilization-details.component.html',
  styleUrls: ['./domain-utilization-details.component.scss'],
})
export class DomainUtilizedDetailsComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  domain_utilized_uuid = null;

  constructor(
    public activeRoute: ActivatedRoute,
    public domainUtilizedSvc: DomainUtilizationService,
    public layoutSvc: LayoutService
  ) {
    this.layoutSvc.setTitle('Domains Utilized Details');
  }

  ngOnInit(): void {
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this.domain_utilized_uuid = params['domain_utilized_uuid'];
        if (this.domain_utilized_uuid !== null) {
          this.loadDomainUtilized(this.domain_utilized_uuid);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  loadDomainUtilized(domain_utilized_uuid) {
    console.log(
      `Component call to service to load domain-utilized with domain uuid of ${domain_utilized_uuid}`
    );
    this.domainUtilizedSvc
      .getDomainUtilizedDetail(domain_utilized_uuid)
      .subscribe(
        (success) => {
          console.log(`Data received from service : ${success}`);
        },
        (error) => {
          console.log(`Error from service ${error}`);
        }
      );
  }
}
