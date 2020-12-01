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
  // = [
  //   {
  //     CallerReference: "c5b77fba-f1a9-4142-b643-7e05603e8b87",
  //     Config: {
  //       Comment: "",
  //       PrivateZone: false
  //     },
  //     Id: "/hostedzone/Z04435582T0B0UIE8EHQ9",
  //     Name: "thisisreal.xyz.",
  //     ResourceRecordSetCount: 7,
  //     _id: "5f3c2606a3fd032bbe6e6472"
  //   },
  //   {
  //     CallerReference: "7e1ad916-fefb-4cb8-ad4e-33172c64bdaf",
  //     Config: {
  //       Comment: "",
  //       PrivateZone: false
  //     },
  //     Id: "/hostedzone/Z0980501148ZGHN7PD1JC",
  //     Name: "alivesite.xyz.",
  //     ResourceRecordSetCount: 2,
  //     _id: "5f3f564aa6a89900a176b791"
  //   },
  //   {
  //     CallerReference: "8d2caddc-fb70-4f37-9550-54298ebaf8f7",
  //     Config: {
  //       Comment: "Con-PCA Dev",
  //       PrivateZone: false
  //     },
  //     Id: "/hostedzone/Z04597996U3L8GB48T8E",
  //     Name: "inltesting.xyz.",
  //     ResourceRecordSetCount: 2,
  //     _id: "5f45612bc401498fcaa89907"
  //   }
  // ]

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

  getDomainDetails(domain_uuid) {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/domain/${domain_uuid}/`;

    //return this.http.get(url,headers)

    //Example observable return for testing purposes
    return new Observable((exampleObs) => {
      exampleObs.next('Example data from getDomainDetails - service');
    });
  }
}
