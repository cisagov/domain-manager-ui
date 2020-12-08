// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Local Service Imports
import { LayoutService } from 'src/app/services/layout.service';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.scss'],
})
export class TemplateDetailsComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  template_uuid = null;

  constructor(
    public activeRoute: ActivatedRoute,
    public templateSvc: TemplateService,
    public layoutSvc: LayoutService
  ) {
    this.layoutSvc.setTitle('Template Details');
  }

  ngOnInit(): void {
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        console.log(params)
        this.template_uuid = params['template_uuid'];
        if (this.template_uuid !== null) {
          this.loadTemplate(this.template_uuid);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  loadTemplate(template_uuid) {
    console.log(
      `Component call to service to load domain with domain uuid of ${template_uuid}`
    );
    this.templateSvc
      .getTemplateDetails(template_uuid)
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
