// Angular Imports
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { ApplicationService } from 'src/app/services/applications.service';
import { LayoutService } from 'src/app/services/layout.service';

//Models
import { ApplicationModel } from 'src/app/models/application.model';

@Component({
  selector: 'application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss'],
})
export class ApplicationDetailsComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  application_data: ApplicationModel = new ApplicationModel();
  applicationLoaded: boolean = false;
  application_uuid = null;

  constructor(
    public activeRoute: ActivatedRoute,
    public alerts: AlertsService,
    public applicationSvc: ApplicationService,
    public layoutSvc: LayoutService,
    private router: Router
  ) {
    this.layoutSvc.setTitle('Create Domain');
  }

  ngOnInit(): void {
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this.application_uuid = params['application_uuid'];
        this.loadApplication(this.application_uuid);
      })
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  loadApplication(application_uuid) {
    this.applicationSvc.getApplication(application_uuid).subscribe(
      (success) => {
        this.application_data = success as ApplicationModel;
        this.applicationLoaded = true;
      },
      (failure) => {
        console.log('failed to load application');
        console.log(failure);
      }
    );
  }

  delete() {
    if (this.application_data.domains_used_count == 0) {
      this.applicationSvc.deleteApplication(this.application_uuid).subscribe(
        (success) => {
          console.log('Application Deleted');
          this.router.navigate([`/application`]);
        },
        (failure) => {
          console.log('failed to delete the applicaiton');
          console.log(failure);
        }
      );
    } else {
      this.alerts.alert('Can not delete an application that is using a domain');
    }
  }

  test() {
    console.log('test');
  }
}
