import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable } from 'rxjs';
import { TemplateModel } from 'src/app/models/template.model';
import { environment } from 'src/environments/environment';
import { AbstractUploadService } from './abstract-upload.service';
import { MatTableDataSource } from '@angular/material/table';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable({
  providedIn: 'root',
})
export class TemplateService extends AbstractUploadService {
  template_list = new Array<TemplateModel>();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    super();
  }

  getAllTemplates() {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/templates/`;
    if (!environment.localData) {
      return this.http.get(url, headers);
    }

    //Test Data TODO: REMOVE IN PROD
    let templates = ['Template One', 'Temp_two', 'selected', 'Test3'];
    this.template_list = [];
    let templateListTemporay = [];
    templates.forEach((element) => {
      templateListTemporay.push({
        name: element,
        _id: element,
        uploaded_by: 'Template Creator',
        created: new Date('10-10-2020'),
        s3_url:
          'https://domain-manager-test.s3.amazonaws.com/pesticide/mypestcompany.com/home.html',
        template_attributes: Array<any>(),
      });
    });

    return new Observable((exampleObs) => {
      setTimeout(() => {
        this.template_list = templateListTemporay;
        exampleObs.next(this.template_list);
      }, 200);
    });
  }

  getTemplateDetails(templateId) {
    let url = `${this.settingsService.settings.apiUrl}/api/template/${templateId}/`;
    return this.http.get(url, headers);
  }

  approveTemplate(templateId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/template/${templateId}/approve/`;
    return this.http.get(url);
  }

  disapproveTemplate(templateId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/template/${templateId}/approve/`;
    return this.http.delete(url);
  }

  getTemplateAttributes() {
    const url = `${this.settingsService.settings.apiUrl}/api/templates/attributes/`;
    return this.http.get(url);
  }

  downloadTemplate(uuid) {
    const downloadHeaders = new HttpHeaders().set(
      'content-type',
      'application/*zip*'
    );
    let salt = new Date().getTime();
    const url = `${this.settingsService.settings.apiUrl}/api/template/${uuid}/content/?${salt}/`;
    return this.http.get(url, {
      headers: downloadHeaders,
      responseType: 'blob',
    });
  }

  deleteTemplate(templateId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/template/${templateId}/`;
    return this.http.delete(url);
  }

  preloadValidationData() {
    this.getAllTemplates().subscribe(
      (success) => {
        let tmpvar = new MatTableDataSource<TemplateModel>(
          success as TemplateModel[]
        );
        this.template_list = tmpvar.data;
      },
      (error) => {
        console.log('Error getting domain list');
        console.log(error);
      }
    );
  }

  uploadTemplate(formData: FormData, overwrite: boolean) {
    //Double check settings, as this function is passed directly to upload modal
    const url = `${this.settingsService.settings.apiUrl}/api/templates/?overwrite=${overwrite}/`;
    const config = new HttpRequest('POST', url, formData, {
      reportProgress: true,
    });
    return this.http.request(config);
  }

  public uploadFile(file: any, overwrite: boolean): any {
    return this.uploadTemplate(file, overwrite);
  }
  validateBeforeUpload(files) {
    //go through the files check to see if any are in the
    //name list already.   If they are then return an error and
    //prompt to overwrite
    /*
    get the list of templates in the preloadValidationData()
     */
    let duplicateFilesList = [];
    for (let file of files) {
      console.log(file);
      for (let template of this.template_list) {
        console.log(template);
        if (template.name == file.name.substring(0, file.name.length - 4)) {
          duplicateFilesList.push({
            name: file['name'],
            status: 'Already Exists',
          });
        }
      }
    }
    return duplicateFilesList;
  }
}
