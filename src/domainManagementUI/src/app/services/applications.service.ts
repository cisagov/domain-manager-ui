//Angular Imports
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

//Local Services
import { environment } from 'src/environments/environment';

// Models
import { ApplicationModel } from 'src/app/models/application.model'

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class ApplicationService {

  application_list : ApplicationModel[] = []
  // public applicaiton_list_behavior_subject: BehaviorSubject<ApplicationModel[]> = new BehaviorSubject<ApplicationModel[]>(new Array<ApplicationModel>())
    
  // Test Data
  private application_list_test_data 
  = [
    {
      application_uuid: 'application-1-UUID',
      application_name: 'Redteam',
      requester_name: 'Requester Name Here',
      date_created: new Date('09-12-2020'),
      domains_used_count: 0,
    },
    {
      application_uuid: 'application-2-UUID',
      application_name: 'RVA',
      requester_name: 'Requester Name Here',
      date_created: new Date('03-12-2020'),
      domains_used_count: 8,
    },
    {
      application_uuid: 'application-3-UUID',
      application_name: 'Con-PCA',
      requester_name: 'Requester Name Here',
      date_created: new Date('12-12-2020'),
      domains_used_count: 2,
    }
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
        )
  }

  getAllApplications() {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/applications/`;
    console.log(url)
    // this.http.get(url,headers).subscribe(
    //   (val) => {
    //       this.application_list = val as [];
    //     console.log(val)
    //   },
    //   (error) => {
    //     console.log(error)
    // }  
    // )
    // return this.http.get(url,headers)

    //Examplefor testing purposes    
        
    return new Observable((exampleObs) => {
      setTimeout(() => {
        console.log(this.application_list_test_data)
        exampleObs.next(this.application_list_test_data);
      }, 250)
    });
  }
  
  getApplication(application_uuid){
    let url = `${this.settingsService.settings.apiUrl}/api/application/${application_uuid}/`;
    

    if(!environment.testingNoAPI){
      return this.http.get(url);
    } else {
      let retVal = this.application_list_test_data
        .filter(f => f.application_uuid == application_uuid)[0]
      return new Observable((exampleObs) => {
        setTimeout(() => {
        exampleObs.next(retVal);
        }, Math.floor(Math.random() * 250))
      });
    }
  }

  getApplicationNameByUUID(application_uuid){
    if(this.application_list.length){
      return this.application_list.find(a => a.application_uuid === application_uuid)?.application_name
    }
    return '...Loading applications'
  }

  deleteApplication(application_uuid){
    let url = `${this.settingsService.settings.apiUrl}/api/application/${application_uuid}/`;
    

    if(!environment.testingNoAPI){
      return this.http.delete(url);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
        exampleObs.next("Application Deleted");
        }, Math.floor(Math.random() * 250))
      });
    }
  }

  createApplication(application: ApplicationModel){
    let url = `${this.settingsService.settings.apiUrl}/api/applications/`;
    
    if(!environment.testingNoAPI){
      return this.http.post( url, application);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
        exampleObs.next("Application Created");
        }, Math.floor(Math.random() * 2500))
      });
    }
  }

}
