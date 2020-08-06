import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable } from 'rxjs';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class WebsiteTemplatesService {
  // Test Data
  website_templates_example = [
    {
      counter: 1,
      name: 'Test WebSite Template',
      uuid: 'test_uuid_one',
    },
    {
      counter: 2,
      name: 'Test WebSite Template Two',
      uuid: 'test_uuid_two',
    },
    {
      counter: 3,
      name: 'Test WebSite Template Three',
      uuid: 'test_uuid_three',
    },
  ];

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  getAllWebsiteTemplates() {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/websiteTemplates/`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    return new Observable((exampleObs) => {
      exampleObs.next(this.website_templates_example);
    });
  }

  getWebsiteTemplateDetails(website_template_uuid) {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/websiteTemplates/${website_template_uuid}`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    return new Observable((exampleObs) => {
      exampleObs.next('Example data from getWebsiteTemplateDetails - service');
    });
  }
}
