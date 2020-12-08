import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable } from 'rxjs';

//Models
import { TemplateModel } from 'src/app/models/template.model';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class TemplateService {

  template_list = new Array<TemplateModel>()

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  getAllTemplates() {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/templates/`;
    // return this.http.get(url,headers).subscribe(
    //   (success) => {
    //     this.template_list = success as Array<TemplateModel>;
    //   },
    //   (error) => {
    //     console.log(`Error from service ${error}`);
    //   }
    // );

    //Test Data TODO: REMOVE IN PROD
    let templates = [
      'Template One', 
      'Temp_two', 
      'selected',
      'Test3',
    ]
    this.template_list = []
    templates.forEach(element => {
      this.template_list.push({
        template_name : element,
        template_uuid : element,
        uploaded_by : "Template Creator",
        created_date : new Date('10-10-2020'),
        template_url : element,
      })

    });
    
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next(this.template_list);
        }, 200)
      });
      
  }

  getTemplateDetails(website_template_uuid) {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/templates/${website_template_uuid}`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    return new Observable((exampleObs) => {
      exampleObs.next('Example data from getTemplate - service');
    });
  }
}
