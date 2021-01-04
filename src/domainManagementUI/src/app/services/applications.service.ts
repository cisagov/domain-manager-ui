// import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

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
      domains_used_count: 5,
    },
    {
      application_uuid: 'application-2-UUID',
      application_name: 'RVA',
      domains_used_count: 8,
    },
    {
      application_uuid: 'application-3-UUID',
      application_name: 'Con-PCA',
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
      }, 500)
    });
  }

  getApplicationNameByUUID(uuid){
    if(this.application_list.length){
      return this.application_list.find(a => a.application_uuid === uuid)?.application_name
    }
    return '...Loading applications'
  }

}
