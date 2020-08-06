import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable } from 'rxjs';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class DomainManagementService {
  // Test Data
  domain_list = [
    {
      counter: 1,
      name: 'Test Domain',
      uuid: 'test_uuid',
    },
    {
      counter: 2,
      name: 'Test Domain Two',
      uuid: 'test_uuid_two',
    },
    {
      counter: 3,
      name: 'Test Domain Three',
      uuid: 'test_uuid_three',
    },
  ];

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  getAllDomains() {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/domains/`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    return new Observable((exampleObs) => {
      exampleObs.next(this.domain_list);
    });
  }

  getDomainDetails(domain_uuid) {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/domains/${domain_uuid}`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    return new Observable((exampleObs) => {
      exampleObs.next('Example data from getDomainDetails - service');
    });
  }
}
