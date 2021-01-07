// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Local Service Imports
import { LayoutService } from 'src/app/services/layout.service';
import { WebsiteService } from 'src/app/services/website.service';
import { WebsiteCreationTabService } from 'src/app/services/tab-services/website-creation-tabs.service';

@Component({
  selector: 'website-creation',
  templateUrl: './website-creation.component.html',
  styleUrls: ['./website-creation.component.scss'],
})
export class WebsiteCreationComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  selectedTabIndex: number = 0;
  selected_template_uuid = null;

  constructor(
    public activeRoute: ActivatedRoute,
    public layoutSvc: LayoutService,
    public wcTabSvc: WebsiteCreationTabService,
    public websiteTemplateSvc: WebsiteService
  ) {
    this.layoutSvc.setTitle('Create Website');
  }

  ngOnInit(): void {
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe(
        (params) => {
          this.selected_template_uuid = params['template_uuid'];
          this.wcTabSvc.updateTemplateSelection(this.selected_template_uuid);
        },
        (error) => {
          console.log('Failed to load domain');
          console.log(error);
        }
      )
    );
    this._getNextTabObservable();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  onTabChanged(event) {
    console.log(event);
  }

  _getNextTabObservable() {
    this.component_subscriptions.push(
      this.wcTabSvc.tabCompleteBehvaiorSubject.subscribe((tabComplete) => {
        if (tabComplete) {
          this.selectedTabIndex += 1;
        }
      })
    );
  }
}
