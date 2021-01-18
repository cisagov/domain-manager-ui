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
import { domain } from 'process';

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
    const url = `${this.settingsService.settings.apiUrl}/api/websites/`;
    return this.http.get(url, headers);
  }

  getWebsiteDetails(websiteId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/website/${websiteId}`;
    return this.http.get(url, headers);
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
    // Don't think there is anything we need to do here
  }
  validateBeforeUpload(validateData: any): any[] {
    // Don't think there is anything we need to do here
    return [];
  }
  uploadFile(file: any, overwrite: boolean) {
    // we are always overwriting for now
    return this.uploadWebsite(
      file,
      file.get('Website_Id'),
      file.get('Website_Domain')
    );
  }

  downloadWebsite(websiteId: string) {
    const downloadHeaders = new HttpHeaders().set(
      'content-type',
      'application/zip'
    );
    const url = `${this.settingsService.settings.apiUrl}/api/website/`;
    return this.http.get(url, {
      headers: downloadHeaders,
      responseType: 'blob',
    });
  }

  createWebsite(newWebsite: WebsiteModel) {
    const url = `${this.settingsService.settings.apiUrl}/api/website/${newWebsite.template_base_uuid}/generate/`;
    return this.http.post(url, newWebsite);
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

  getHostedZones(websiteId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/website/${websiteId}/records/`;
    return this.http.get(url);
  }

  createDomain(domainUrl: string) {
    console.log(domainUrl);
    let body = { 'name': domainUrl}

    let url = `${this.settingsService.settings.apiUrl}/api/websites/`;

    if (!environment.localData) {
      return this.http.post(url,body);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('website Created');
        }, Math.floor(Math.random() * 1500));
      });
    }
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
