// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Local Service Imports
import { LayoutService } from 'src/app/services/layout.service';
import { WebsiteService } from 'src/app/services/website.service';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';

@Component({
  selector: 'website-details',
  templateUrl: './website-details.component.html',
  styleUrls: ['./website-details.component.scss'],
})
export class WebsiteDetailsComponent implements OnInit, OnDestroy {
  
  component_subscriptions = [];
  selectedTabIndex: number = 0;
  website_uuid = null;

  constructor(
    public activeRoute: ActivatedRoute,
    public layoutSvc: LayoutService,
    public wdTabSvc: WebsiteDetailsTabService,
    public websiteTemplateSvc: WebsiteService,
    
  ) {
    this.layoutSvc.setTitle('Website Details');
  }

  ngOnInit(): void {
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this.website_uuid = params['website_uuid'];
        if (this.website_uuid !== null) {
          this.loadWebsite(this.website_uuid);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  loadWebsite(website_uuid) {
    this.wdTabSvc.getWebsiteDetails(website_uuid);
    this.wdTabSvc.getWebsiteHistory(website_uuid);
  }

  onTabChanged(event){
    console.log(event)
  }
  
}
