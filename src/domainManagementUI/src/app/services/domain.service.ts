import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//Local Service Imports
import { environment } from 'src/environments/environment';
import { SettingsService } from 'src/app/services/settings.service';

//Models
import {
  RecordModel,
  RedirectModel,
  DomainModel,
} from 'src/app/models/domain.model';
import { AbstractUploadService } from './abstract-upload.service';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class DomainService extends AbstractUploadService {
  domain_list = new Array<DomainModel>();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    super();
  }

  getAllDomains() {
    const url = `${this.settingsService.settings.apiUrl}/api/domains/`;
    return this.http.get(url, headers);
  }

  getDomainDetails(domainId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}`;
    return this.http.get(url, headers);
  }

  updateDomain(domain: DomainModel) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domain._id}`;
    return this.http.put(url, domain);
  }

  deleteDomain(domainId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/`;
    return this.http.delete(url, headers);
  }

  uploadDomain(formData, domainId, category) {
    console.log(formData);
    let url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/content/?category=${category}`;

    if (!environment.localData) {
      const config = new HttpRequest('POST', url, formData, {
        reportProgress: true,
      });
      return this.http.request(config);
    }

    if (environment.localData) {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('Domain uploaded');
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
    return this.uploadDomain(
      file,
      file.get('Domain_Id'),
      file.get('Domain_Domain')
    );
  }

  downloadDomain(domainId: string) {
    const downloadHeaders = new HttpHeaders().set(
      'content-type',
      'application/zip'
    );
    let salt = new Date().getTime();
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/content/?${salt}`;
    return this.http.get(url, {
      headers: downloadHeaders,
      responseType: 'blob',
    });
  }

  setDomainsAsAvailable(domainIDArray) {
    console.log(domainIDArray);
    //NOT IMPLEMENTED YET
    let url = `${this.settingsService.settings.apiUrl}/api/domain/`;

    if (!environment.localData) {
      // return this.http.post(url, newDomain);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('domain Created');
        }, Math.floor(Math.random() * 1500));
      });
    }
  }

  getHostedZones(domainId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/records/`;
    return this.http.get(url);
  }

  createDomain(domainUrl: string) {
    console.log(domainUrl);
    let body = { name: domainUrl };

    let url = `${this.settingsService.settings.apiUrl}/api/domains/`;

    if (!environment.localData) {
      return this.http.post(url, body);
    } else {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('domain Created');
        }, Math.floor(Math.random() * 1500));
      });
    }
  }

  launchDomain(domainId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/launch/`;
    return this.http.get(url);
  }

  takeDownDomain(domainId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/launch/`;
    return this.http.delete(url);
  }

  generateFromTemplate(domain_id, template_name, attributes: {}) {
    let url = `${this.settingsService.settings.apiUrl}/api/domain/${domain_id}/generate/?category=${template_name}`;
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

  removeTemplate(domain_id) {
    let url = `${this.settingsService.settings.apiUrl}/api/domain/${domain_id}/content/`;

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

  deleteRedirect(domainId: string, subdomain: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/redirect/?subdomain=${subdomain}`;
    return this.http.delete(url);
  }

  createRedirect(domainId: string, redirect: RedirectModel) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/redirect/`;
    return this.http.post(url, redirect);
  }

  updateRedirect(domainId: string, redirect: RedirectModel) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/redirect/`;
    return this.http.put(url, redirect);
  }

  createRecord(domainId: string, record: RecordModel) {
    console.log(record)
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/records/`;
    return this.http.post(url, record);
  }

  deleteRecord(domainId: string, recordId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/records/?record_id=${recordId}`;
    return this.http.delete(url);
  }

  getCloudfrontStatus(domainId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/deployed/`;
    return this.http.get(url);
  }
}
