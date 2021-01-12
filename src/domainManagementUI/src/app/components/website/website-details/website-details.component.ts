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
  _id = null;

  constructor(
    public activeRoute: ActivatedRoute,
    public layoutSvc: LayoutService,
    public wdTabSvc: WebsiteDetailsTabService,
    public websiteTemplateSvc: WebsiteService
  ) {
    this.layoutSvc.setTitle('Website Details');
  }

  ngOnInit(): void {
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this._id = params['_id'];
        if (this._id !== null) {
          this.loadWebsite(this._id);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  loadWebsite(_id) {
    this.wdTabSvc.getWebsiteDetails(_id);
    this.wdTabSvc.getWebsiteHistory(_id);
  }

  onTabChanged(event) {
    console.log(event);
  }
}
