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
      this.getAllApplications()
  }

  getAllApplications() {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/applications/`;
    console.log(url)
    this.http.get(url,headers).subscribe(
      (val) => {
          this.application_list = val as [];
        console.log(val)
      },
      (error) => {
        console.log(error)
    }  
    )
    // return this.http.get(url,headers)

    //Examplefor testing purposes    
    this.application_list = this.application_list_test_data
        
    return new Observable((exampleObs) => {
      setTimeout(() => {
        exampleObs.next(this.application_list_test_data);
      }, 200)
    });
  }

}
