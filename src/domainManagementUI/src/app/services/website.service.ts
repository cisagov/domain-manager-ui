import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//Local Service Imports
import { environment } from 'src/environments/environment';
import { SettingsService } from 'src/app/services/settings.service';

//Models
import { WebsiteModel } from 'src/app/models/website.model';
import { AbstractUploadService } from './abstract-upload.service';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class WebsiteService extends AbstractUploadService{
  
  website_list = new Array<WebsiteModel>();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    super();
  }

  getAllWebsites() {
    //Example url, needs to be changed when API is in place
    let url = `${environment.apiUrl}websiteTemplates/`;
    // return this.http.get(url,headers).subscribe(
    //   (success) => {
    //     this.website_list = success as Array<WebsiteModel>;
    //   },
    //   (error) => {
    //     console.log(`Error from service ${error}`);
    //   }
    // );

    //Test Data TODO: REMOVE IN PROD
    let websites = [
      'WebsiteOne',
      'myWebSite two with a longer name for testing styling',
      'selected',
      'test_three',
      'test_four',
      'test_five',
      'test_six',
      'test_seven',
    ];
    //TEST DATA PULLD FROM template.service.ts
    let templates_used = ['Template One', 'Temp_two', 'selected', 'Test3'];
    this.website_list = [];
    let counter = 0;
    websites.forEach((element) => {
      this.website_list.push({
        website_name: element,
        website_uuid: 'UUID_' + element,
        website_url: this.getTestURL(counter),
        created_date: new Date('2019-06-26'),
        template_base_name: 'Template_Name_Base_' + element,
        template_base_uuid: templates_used[counter % templates_used.length],
        application_using_uuid: 'application-' + ((counter % 3) + 1) + '-UUID',
        // template: new TemplateModel(),
        website_parameters: [
          {
            param_name: 'Param One',
            value: 'Param_Value_One',
          },
          {
            param_name: 'Param Two',
            value: 'Param_Value_TWO',
          },
          {
            param_name: 'Param Three',
            value: 'Param_Value_THREE',
          },
        ],
      });
      counter += 1;
    });

    return new Observable((exampleObs) => {
      setTimeout(() => {
        exampleObs.next(this.website_list);
      }, 200);
    });
  }

  getWebsiteDetails(website_uuid) {
    //Example url, needs to be changed when API is in place
    let url = `${environment.apiUrl}website/${website_uuid}`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    let retVal = new WebsiteModel();

    console.log(environment.testingNoAPI);
    if (environment.testingNoAPI) {
      retVal.website_name = 'Example Website';
      retVal.website_uuid = website_uuid;
      retVal.website_url =
        'https://domain-manager-test.s3.amazonaws.com/pesticide/inltesting.xyz/home.html';
      retVal.created_date = new Date('12/12/20');
      retVal.template_base_name = 'Template Base Name Test';
      retVal.template_base_uuid = 'template Base UUID TEST';
      retVal.website_parameters = [
        {
          param_name: 'Title',
          value: 'Title Value Test',
        },
        {
          param_name: 'Author',
          value: 'Author Value Test',
        },
      ];
      retVal.application_using_uuid = 'application-3-UUID';
    }

    let website = this.website_list.filter(
      (f) => f.website_uuid === website_uuid
    );
    if (website.length) {
      retVal = website[0];
      retVal.website_url =
        'https://domain-manager-test.s3.amazonaws.com/pesticide/inltesting.xyz/home.html';
    }

    return new Observable((exampleObs) => {
      exampleObs.next(retVal);
    });
  }

  getWebsiteHistory(website_uuid) {
    //Example url, needs to be changed when API is in place
    let url = `${environment.apiUrl}website/${website_uuid}/history`;

    // return this.http.get(url,headers)

    //Example data return, remove when API in place

    if (environment.testingNoAPI) {
      let retVal = [
        {
          application: 'Applicaiton Test value',
          domain: 'Domain Test Value',
          start_date: '12-12-2012',
          end_date: '12-24-2012',
        },
        {
          application: 'Applicaiton Test value 2',
          domain: 'Domain Test Value 2',
          start_date: '12-12-2012 ',
          end_date: '12-24-2012 ',
        },
        {
          application: 'Applicaiton Test value 3',
          domain: 'Domain Test Value 3',
          start_date: '12-12-2012 ',
          end_date: '12-24-2012 ',
        },
        {
          application: 'Applicaiton Test value 4',
          domain: 'Domain Test Value 4',
          start_date: '12-12-2012',
          end_date: '12-24-2012',
        },
      ];

      return new Observable((exampleObs) => {
        exampleObs.next(retVal);
      });
    }
  }

  getWebsiteNameByUUID(uuid) {
    if (this.website_list.length) {
      return this.website_list.find((w) => w.website_uuid === uuid)
        ?.website_name;
    } else {
      console.log('error finding website name by uuid');
      console.log(uuid);
      console.log(this.website_list);
    }
  }

  deleteWebsite(website_uuid) {
    console.log(website_uuid);
    let url = `${environment.apiUrl}website/${website_uuid}/`;
    // return this.http.delete(url,headers)
    return new Observable((exampleObs) => {
      setTimeout(() => {
        exampleObs.next(this.website_list);
      }, 1000);
    });
  }

  uploadWebsite(inputFile) {
    //settings service check required because this function is passed
    //directly to the file upload modal and requires the settings
    if (!this.settingsService) {
      this.settingsService = new SettingsService();
    }

    let url = `${environment.apiUrl}website/`;
    let formData: FormData = new FormData();
    formData.append('file', inputFile.data);

    if (!environment.testingNoAPI) {
      return this.http.post(url, formData, headers);
    }

    if (environment.testingNoAPI) {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('Webstite uploaded');
        }, Math.floor(Math.random() * 2000));
      });
    }
  }
  uploadFile(file: any) {
   this.uploadWebsite(file);
  }

  downloadWebsite(uuid) {
    const downloadHeaders = new HttpHeaders().set(
      'content-type',
      'application/zip'
    );
    let url = `${environment.apiUrl}website/`;
    if (!environment.testingNoAPI) {
      return this.http.get(url, {
        headers: downloadHeaders,
        responseType: 'blob',
      });
    } else {
      if (environment.testingNoAPI) {
        return new Observable((exampleObs) => {
          setTimeout(() => {
            exampleObs.next('website downloaded');
          }, Math.floor(Math.random() * 1000));
        });
      }
    }
  }

  createWebsite(newWebsite: WebsiteModel) {
    let url = `${environment.apiUrl}website/${newWebsite.template_base_uuid}/generate/`;

    if (!environment.testingNoAPI) {
      return this.http.post(url, newWebsite);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('website Created');
        }, Math.floor(Math.random() * 1500));
      });
    }
  }

  //TEST FUNCITON TODO: REMOVE
  getTestURL(counter) {
    if (counter % 2 == 0) {
      return 'https://domain-manager-test.s3.amazonaws.com/pesticide/mypestcompany.com/home.html';
    } else {
      return 'http://localhost:4200/';
    }
  }
}
