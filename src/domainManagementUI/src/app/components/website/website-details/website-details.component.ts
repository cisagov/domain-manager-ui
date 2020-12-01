// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Local Service Imports
import { LayoutService } from 'src/app/services/layout.service';
import { WebsiteService } from 'src/app/services/website.service';

@Component({
  selector: 'website-details',
  templateUrl: './website-details.component.html',
  styleUrls: ['./website-details.component.scss'],
})
export class WebsiteDetailsComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  website_uuid = null;

  constructor(
    public activeRoute: ActivatedRoute,
    public websiteTemplateSvc: WebsiteService,
    public layoutSvc: LayoutService
  ) {
    this.layoutSvc.setTitle('Website Details');
  }

  ngOnInit(): void {
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this.website_uuid = params['website_uuid'];
        if (this.website_uuid !== null) {
          this.loadDomain(this.website_uuid);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  loadDomain(website_template_uuid) {
    console.log(
      `Component call to service to load domain with domain uuid of ${website_template_uuid}`
    );
    this.websiteTemplateSvc
      .getWebsiteDetails(website_template_uuid)
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
