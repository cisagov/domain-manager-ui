// Angular Imports
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

// Local Services
import { environment } from 'src/environments/environment';

// Models
import { ApplicationModel } from 'src/app/models/application.model';

@Injectable()
export class ApplicationService {
  application_list: ApplicationModel[] = [];
  // public applicaiton_list_behavior_subject: BehaviorSubject<ApplicationModel[]> = new BehaviorSubject<ApplicationModel[]>(new Array<ApplicationModel>())

  // Test Data
  private application_list_test_data = [
    {
      _id: 'application-1-UUID',
      name: 'Redteam',
      requester_name: 'Requester Name Here',
      created: new Date('09-12-2020'),
      // domains_used_count: 0,
    },
    {
      _id: 'application-2-UUID',
      name: 'RVA',
      requester_name: 'Requester Name Here',
      created: new Date('03-12-2020'),
      // domains_used_count: 8,
    },
    {
      _id: 'application-3-UUID',
      name: 'Con-PCA',
      created: 'Requester Name Here',
      date_created: new Date('12-12-2020'),
      // domains_used_count: 2,
    },
  ];

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.getAllApplications().subscribe(
      (success) => {
        this.application_list = success as ApplicationModel[];
      },
      (failure) => {}
    );
  }

  getAllApplications() {
    const url = `${this.settingsService.settings.apiUrl}/api/applications/`;
    if (!environment.localData) {
      return this.http.get(url);
    }

    return new Observable((exampleObs) => {
      setTimeout(() => {
        console.log(this.application_list_test_data);
        exampleObs.next(this.application_list_test_data);
      }, 250);
    });
  }

  getApplication(id: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/application/${id}/`;

    if (!environment.localData) {
      return this.http.get(url);
    } else {
      const retVal = this.application_list_test_data.filter(
        (f) => f._id === id
      )[0];
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next(retVal);
        }, Math.floor(Math.random() * 250));
      });
    }
  }

  getApplicationNameByUUID(application_id) {
    if (this.application_list.length) {
      return this.application_list.find((a) => a._id === application_id)?.name;
    }
    return '...Loading applications';
  }

  deleteApplication(application_id) {
    const url = `${this.settingsService.settings.apiUrl}/api/application/${application_id}/`;

    if (!environment.localData) {
      return this.http.delete(url);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('Application Deleted');
        }, Math.floor(Math.random() * 250));
      });
    }
  }

  createApplication(application: ApplicationModel) {
    const url = `${this.settingsService.settings.apiUrl}/api/applications/`;

    if (!environment.localData) {
      return this.http.post(url, application);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('Application Created');
        }, Math.floor(Math.random() * 2500));
      });
    }
  }

  getDomainsByApplication(applicationId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/websites/?application_id=${applicationId}`;
    return this.http.get(url);
  }
}
