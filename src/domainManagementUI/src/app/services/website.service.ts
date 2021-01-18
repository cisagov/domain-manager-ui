import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//Local Service Imports
import { environment } from 'src/environments/environment';
import { SettingsService } from 'src/app/services/settings.service';

//Models
import {
  HostedZoneModel,
  RedirectModel,
  WebsiteHistoryModel,
  WebsiteModel,
} from 'src/app/models/website.model';
import { AbstractUploadService } from './abstract-upload.service';
import { ApplicationModel } from '../models/application.model';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class WebsiteService extends AbstractUploadService {
  website_list = new Array<WebsiteModel>();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    super();
  }

  getAllWebsites() {
    //Example url, needs to be changed when API is in place

    let url = `${this.settingsService.settings.apiUrl}/api/websites/`;
    // return this.http.get(url,headers).subscribe(
    //   (success) => {
    //     this.website_list = success as Array<WebsiteModel>;
    //   },
    //   (error) => {
    //     console.log(`Error from service ${error}`);
    //   }
    // );

    if (!environment.localData) {
      return this.http.get(url, headers);
    }
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
        name: element,
        _id: 'UUID_' + element,
        s3_url: this.getTestURL(counter),
        created_date: new Date('2019-06-26'),
        launch_date: new Date('2019-07-21'),
        category: 'Test',
        template_base_name: 'Template_Name_Base_' + element,
        template_base_uuid: templates_used[counter % templates_used.length],
        application_id: 'application-' + ((counter % 3) + 1) + '-UUID',
        application_using: new ApplicationModel(),
        is_active: true,
        history: new Array<WebsiteHistoryModel>(),
        route53: null,
        hosted_zones: new Array<HostedZoneModel>(),
        redirects: new Array<RedirectModel>(),
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

  getWebsiteDetails(_id) {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/website/${_id}`;

    if (!environment.localData) {
      return this.http.get(url, headers);
    }
    //Example observable return for testing purposes
    let retVal = new WebsiteModel();

    console.log(environment.localData);
    if (environment.localData) {
      retVal.name = 'Example Website';
      retVal._id = _id;
      retVal.s3_url =
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
      retVal.application_id = 'application-3-UUID';
    }

    let website = this.website_list.filter((f) => f._id === _id);
    if (website.length) {
      retVal = website[0];
      retVal.s3_url =
        'https://domain-manager-test.s3.amazonaws.com/pesticide/inltesting.xyz/home.html';
    }

    return new Observable((exampleObs) => {
      exampleObs.next(retVal);
    });
  }

  getWebsiteHistory(_id) {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/website/${_id}/history`;

    // return this.http.get(url,headers)

    //Example data return, remove when API in place

    if (environment.localData) {
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
      return this.website_list.find((w) => w._id === uuid)?.name;
    } else {
      console.log('error finding website name by uuid');
      console.log(uuid);
      console.log(this.website_list);
    }
  }

  deleteWebsite(websiteId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/website/${websiteId}/content/`;
    return this.http.delete(url, headers);
  }

  uploadWebsite(formData, websiteId, category) {
    let url = `${this.settingsService.settings.apiUrl}/api/website/${websiteId}/content/?category=${category}`;

    if (!environment.localData) {
      const config = new HttpRequest('POST', url, formData, {
        reportProgress: true,
      });
      return this.http.request(config);
    }

    if (environment.localData) {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('Website uploaded');
        }, Math.floor(Math.random() * 2000));
      });
    }
  }

  preloadValidationData() {
    //Don't think there is anything we need to do here
  }
  validateBeforeUpload(validateData: any): any[] {
    //Don't think there is anything we need to do here
    let duplicateFilesList = [];
    return duplicateFilesList;
  }
  uploadFile(file: any, overwrite: boolean) {
    //we are always overwriting for now
    return this.uploadWebsite(
      file,
      file.get('Website_Id'),
      file.get('Website_Domain')
    );
  }

  downloadWebsite(uuid) {
    const downloadHeaders = new HttpHeaders().set(
      'content-type',
      'application/zip'
    );
    let url = `${this.settingsService.settings.apiUrl}/api/website/`;
    if (!environment.localData) {
      return this.http.get(url, {
        headers: downloadHeaders,
        responseType: 'blob',
      });
    } else {
      if (environment.localData) {
        return new Observable((exampleObs) => {
          setTimeout(() => {
            exampleObs.next('website downloaded');
          }, Math.floor(Math.random() * 1000));
        });
      }
    }
  }

  createWebsite(newWebsite: WebsiteModel) {
    let url = `${this.settingsService.settings.apiUrl}/api/website/${newWebsite.template_base_uuid}/generate/`;

    if (!environment.localData) {
      return this.http.post(url, newWebsite);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('website Created');
        }, Math.floor(Math.random() * 1500));
      });
    }
  }

  setWebsitesAsAvailable(websiteIDArray) {
    console.log(websiteIDArray);
    //NOT IMPLEMENTED YET
    let url = `${this.settingsService.settings.apiUrl}/api/website/`;

    if (!environment.localData) {
      // return this.http.post(url, newWebsite);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('website Created');
        }, Math.floor(Math.random() * 1500));
      });
    }
  }

  getHostedZones(website_id) {
    let url = `${this.settingsService.settings.apiUrl}/api/website/${website_id}/records/`;

    if (!environment.localData) {
      return this.http.get(url);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('website Created');
        }, Math.floor(Math.random() * 1500));
      });
    }
  }

  createDomain(domainUrl: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/websites/`;
    return this.http.post(url, { name: domainUrl });
  }

  launchWebsite(websiteId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/website/${websiteId}/launch/`;
    return this.http.get(url);
  }

  takeDownWebsite(websiteId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/website/${websiteId}/launch/`;
    return this.http.delete(url);
  }

  generateFromTemplate(website_id, template_name, attributes: {}) {
    let url = `${this.settingsService.settings.apiUrl}/api/website/${website_id}/generate/?category=${template_name}`;
    console.log(url);

    if (!environment.localData) {
      return this.http.post(url, attributes);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('Template content removed');
        }, Math.floor(Math.random() * 1500));
      });
    }
  }

  removeTemplate(website_id) {
    let url = `${this.settingsService.settings.apiUrl}/api/website/${website_id}/content/`;

    if (!environment.localData) {
      return this.http.delete(url);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('Template content removed');
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

  deleteRedirect(websiteId: string, subdomain: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/website/${websiteId}/redirect/?subdomain=${subdomain}`;
    return this.http.delete(url);
  }

  createRedirect(websiteId: string, redirect: RedirectModel) {
    const url = `${this.settingsService.settings.apiUrl}/api/website/${websiteId}/redirect/`;
    return this.http.post(url, redirect);
  }

  updateRedirect(websiteId: string, redirect: RedirectModel) {
    const url = `${this.settingsService.settings.apiUrl}/api/website/${websiteId}/redirect/`;
    return this.http.put(url, redirect);
  }
}
