import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable } from 'rxjs';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class DomainUtilizationService {
  // Test Data
  domains_utilized_list = [
    {
      counter: 1,
      name: 'Test Domain Utilized One',
      uuid: 'test_uuid one',
    },
    {
      counter: 2,
      name: 'Test Domain Utilized Two',
      uuid: 'test_uuid two',
    },
    {
      counter: 3,
      name: 'Test Domain Utilized Three',
      uuid: 'test_uuid three',
    },
    {
      counter: 4,
      name: 'Test Domain Utilized Four',
      uuid: 'test_uuid four',
    },
  ];

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  getAllDomainsUtilized() {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/domains-utilized/`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    return new Observable((exampleObs) => {
      exampleObs.next(this.domains_utilized_list);
    });
  }

  getDomainUtilizedDetail(domain_utilized_uuid) {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/domains-utilized/${domain_utilized_uuid}`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    return new Observable((exampleObs) => {
      exampleObs.next('Example data from getDomainUtilizedDetail - service');
    });
  }
}
