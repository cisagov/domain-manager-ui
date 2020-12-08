import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

//Models
import { WebsiteModel,WebSiteParameter } from 'src/app/models/website.model';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class WebsiteService {

  website_list = new Array<WebsiteModel>()

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  getAllWebsites() {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/websiteTemplates/`;
    // return this.http.get(url,headers).subscribe(
    //   (success) => {
    //     this.website_list = success as Array<WebsiteModel>;
    //   },
    //   (error) => {
    //     console.log(`Error from service ${error}`);
    //   }
    // );

    //Test Data TODO: REMOVE IN PROD
    let websites= [
      'WebsiteOne', 
      'myWebSite two with a longer name for testing styling', 
      'selected',
      'test_three',
    ]
    this.website_list = []
    websites.forEach(element => {
      this.website_list.push(
        {
          website_name: element,
          website_uuid: "UUID_" + element,
          website_url: "myURL",
          created_date: new Date("2019-06-26"),
          template_base_name: "Template_Name_Base_" + element,
          template_base_uuid: "Template_UUID_" + element,
          website_parameters: [
            {
              param_name: "Param One",
              value: "Param_Value_One"
            },
            {
              param_name: "Param Two",
              value: "Param_Value_One"
            },
            {
              param_name: "Param Three",
              value: "Param_Value_One"
            },
          ],
        }
      )

    });
    
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next(this.website_list);
        }, 200)
      });
      
  }

  getWebsiteDetails(website_uuid) {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/website/${website_uuid}`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    return new Observable((exampleObs) => {
      exampleObs.next('Example data from getWebsiteTemplateDetails - service');
    });
  }
}
