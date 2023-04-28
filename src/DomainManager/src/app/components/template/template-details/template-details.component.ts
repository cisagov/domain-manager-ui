// Angular Imports
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

// Local Service Imports
import { LayoutService } from 'src/app/services/layout.service';
import { TemplateService } from 'src/app/services/template.service';
import { TemplateDetailsTabService } from 'src/app/services/tab-services/template-details-tabs.service';

//Models
import { TemplateModel } from 'src/app/models/template.model';

@Component({
  selector: 'template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.scss'],
})
export class TemplateDetailsComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  selectedTabIndex: number = 0;
  template_data: TemplateModel = new TemplateModel();
  _id = null;

  constructor(
    public activeRoute: ActivatedRoute,
    public layoutSvc: LayoutService,
    public templateSvc: TemplateService,
    public tdTabSvc: TemplateDetailsTabService,
  ) {
    this.layoutSvc.setTitle('Template Details');
  }

  ngOnInit(): void {
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        console.log(params);
        this._id = params['_id'];
        if (this._id !== null) {
          console.log(this._id);
          this.tdTabSvc.getTemplateDetails(this._id);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  onTabChanged(event) {
    console.log(event);
  }
}
