import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable } from 'rxjs';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class WebsiteService {
  // Test Data
  website_example = [
    {
      counter: 1,
      name: 'Test WebSite ',
      uuid: 'test_uuid_one',
    },
    {
      counter: 2,
      name: 'Test WebSite  Two',
      uuid: 'test_uuid_two',
    },
    {
      counter: 3,
      name: 'Test WebSite  Three',
      uuid: 'test_uuid_three',
    },
  ];

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  getAllWebsites() {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/websiteTemplates/`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    return new Observable((exampleObs) => {
      exampleObs.next(this.website_example);
    });
  }

  getWebsiteDetails(website_template_uuid) {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/website/${website_template_uuid}`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    return new Observable((exampleObs) => {
      exampleObs.next('Example data from getWebsiteTemplateDetails - service');
    });
  }
}
