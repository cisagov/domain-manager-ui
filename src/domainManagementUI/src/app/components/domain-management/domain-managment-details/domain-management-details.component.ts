// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Local Service Imports
import { DomainManagementService } from 'src/app/services/domain-management.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'domain-management-details',
  templateUrl: './domain-management-details.component.html',
  styleUrls: ['./domain-management-details.component.scss'],
})
export class DomainManagementDetailsComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  domain_uuid = null;

  constructor(
    public activeRoute: ActivatedRoute,
    public domainSvc: DomainManagementService,
    public layoutSvc: LayoutService
  ) {
    this.layoutSvc.setTitle('Domain Managment Details');
  }

  ngOnInit(): void {
    console.log('domain-management-details Page');
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this.domain_uuid = params['domain_uuid'];
        if (this.domain_uuid !== null) {
          this.loadDomain(this.domain_uuid);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  loadDomain(domain_uuid) {
    console.log(
      `Component call to service to load domain with domain uuid of ${domain_uuid}`
    );
    this.domainSvc.getDomainDetails(domain_uuid).subscribe(
      (success) => {
        console.log(`Data received from service : ${success}`);
      },
      (error) => {
        console.log(`Error from service ${error}`);
      }
    );
  }
}
