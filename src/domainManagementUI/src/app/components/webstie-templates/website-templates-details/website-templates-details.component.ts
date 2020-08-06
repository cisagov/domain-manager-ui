// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Local Service Imports
import { LayoutService } from 'src/app/services/layout.service';
import { WebsiteTemplatesService } from 'src/app/services/website-templates.service';

@Component({
  selector: 'website-templates-details',
  templateUrl: './website-templates-details.component.html',
  styleUrls: ['./website-templates-details.component.scss'],
})
export class WebsiteTemplateDetailsComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  website_template_uuid = null;

  constructor(
    public activeRoute: ActivatedRoute,
    public websiteTemplateSvc: WebsiteTemplatesService,
    public layoutSvc: LayoutService
  ) {
    this.layoutSvc.setTitle('Website Template Details');
  }

  ngOnInit(): void {
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this.website_template_uuid = params['website_template_uuid'];
        if (this.website_template_uuid !== null) {
          this.loadDomain(this.website_template_uuid);
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
      .getWebsiteTemplateDetails(website_template_uuid)
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
