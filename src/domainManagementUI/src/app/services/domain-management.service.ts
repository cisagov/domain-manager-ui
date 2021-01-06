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
  domain_list 
  = [
    {
      counter: 1,
      name: 'Test Domain',
      uuid: 'test_uuid',
      application: 'MyApplication',
      lastUser: 'myLastUser',
      expirationDate: Date.now() + 1000000000,
      wentLiveDate: Date.now() - 1000000000,
      reputation: .75,
      isAvailable: true
    },
    {
      counter: 2,
      name: 'Test Domain Two',
      uuid: 'test_uuid_two',
      application: 'MyApplication',
      lastUser: 'myLastUser',
      expirationDate: Date.now() + 1000000000,
      wentLiveDate: Date.now() - 1000000000,
      reputation: .85,
      isAvailable: false
    },
    {
      counter: 3,
      name: 'Test Domain Three',
      uuid: 'test_uuid_three',
      application: 'MyApplication',
      lastUser: 'myLastUser',
      expirationDate: Date.now() + 1000000000,
      wentLiveDate: Date.now() - 1000000000,
      reputation: .65,
      isAvailable: true
    },
    {
      counter: 4,
      name: 'Test Domain Four',
      uuid: 'test_uuid_four',
      application: 'MyApplication',
      lastUser: 'myLastUser',
      expirationDate: Date.now() + 1000000000,
      wentLiveDate: Date.now() - 1000000000,
      reputation: .95,
      isAvailable: false
    },
    {
      counter: 5,
      name: 'Test Domain Five',
      uuid: 'test_uuid_five',
      application: 'MyApplication',
      lastUser: 'myLastUser',
      expirationDate: Date.now() + 1000000000,
      wentLiveDate: Date.now() - 1000000000,
      reputation: .70,
      isAvailable: true
    },
  ];

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  getAllDomainsTest() {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/domains/`;
    console.log(url)
    this.http.get(url,headers).subscribe(
      (val) => {
        console.log(val)
      },
      (error) => {
        console.log(error)
    }  
    )
    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    return new Observable((exampleObs) => {
      exampleObs.next(this.domain_list);
    });
  }
  getAllDomains() {
    let url = `${this.settingsService.settings.apiUrl}/api/domains/`;
    //return this.http.get(url,headers)

    return new Observable((exampleObs) => {
      exampleObs.next(this.domain_list);
    });
  }
  setDomainsAsAvailable(domain_uuid_list) {
    let url = `${this.settingsService.settings.apiUrl}/api/domains/`;
    //return this.http.get(url,headers)
    console.log("Attempting to set domains as available")
    console.log(domain_uuid_list)
    return new Observable((exampleObs) => {
      exampleObs.next(this.domain_list);
    });
  }

}
