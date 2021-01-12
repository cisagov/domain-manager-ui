import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable } from 'rxjs';

//Models
import {
  TemplateModel,
  TemplateAttribute,
} from 'src/app/models/template.model';
import { environment } from 'src/environments/environment';
import { env } from 'process';
import { AbstractUploadService } from './abstract-upload.service';

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
    let url = `${environment.apiUrl}templates/`;
    // return this.http.get(url,headers).subscribe(
    //   (success) => {
    //     this.template_list = success as Array<TemplateModel>;
    //   },
    //   (error) => {
    //     console.log(`Error from service ${error}`);
    //   }
    // );

    //Test Data TODO: REMOVE IN PROD
    let templates = ['Template One', 'Temp_two', 'selected', 'Test3'];
    this.template_list = [];
    let templateListTemporay = [];
    templates.forEach((element) => {
      templateListTemporay.push({
        template_name: element,
        template_uuid: element,
        uploaded_by: 'Template Creator',
        created_date: new Date('10-10-2020'),
        template_url:
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

  getTemplateDetails(website_template_uuid) {
    //Example url, needs to be changed when API is in place
    let url = `${environment.apiUrl}templates/${website_template_uuid}`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    //TODO: REMOVE
    return new Observable((exampleObs) => {
      if (this.template_list.length === 0) {
        this.getAllTemplates();
      }
      let retVal = this.template_list.find(
        (t) => t.template_uuid === website_template_uuid
      );
      if (retVal) {
        exampleObs.next(retVal);
      } else {
        exampleObs.error(
          'Failed to find template with uuid: ' + website_template_uuid
        );
      }
    });
  }

  // Seperated out to allow for differing sources of attributes to be used
  // Current plan on attribute sourcing has changed rapidly and should be
  // modular to allow for the inevitable future changes
  getTemplateAttributes(): Observable<Array<TemplateAttribute>> {
    //Current plan is to have an api endpoint with all template attributes
    //Unsure if all temlpates will share the same attributes or if they
    //will be tmeplate specific

    // let url = `${environment.apiUrl}templatesAttributes`;
    // return this.http.get(url,headers)

    let key_val_pairs = [
      { key: 'Name', value: 'Dentist-r-us' },
      { key: 'Phone', value: '208-555-1234' },
      { key: 'Email', value: 'johnDoe@Dentist.com' },
      { key: 'City', value: 'Oakland' },
      { key: 'State', value: 'California' },
      { key: 'Address', value: '123 Main Street' },
      { key: 'Owner', value: 'John Doe' },
      { key: 'TestValOne', value: 'My Test Val' },
      { key: 'TestValTwo', value: 'Other Test Val' },
      { key: 'TestValThree', value: 'The Last Test Val' },
    ];

    let key_vals = [
      { key: 'Name' },
      { key: 'Phone' },
      { key: 'Email' },
      { key: 'City' },
      { key: 'State' },
      { key: 'Address' },
      { key: 'Owner' },
      { key: 'TestValOne' },
      { key: 'TestValTwo' },
      { key: 'TestValThree' },
    ];

    let attributeArray = new Array<TemplateAttribute>();
    key_vals.forEach((kv) => {
      attributeArray.push({
        key: kv.key,
        value: null,
        place_holder: '{{%%' + kv.key + '%%}}',
      });
    });
    return new Observable((exampleObs) => {
      exampleObs.next(attributeArray);
    });
  }

  uploadTemplate(formData:FormData) {
    //Double check settings, as this function is passed directly to upload modal    
    let url = `${environment.apiUrl}templates?category=`+(<File>formData.get("zip")).name.replace(".zip","");
    // let formData: FormData = new FormData();
    // formData.append('file', inputFile);
    if (environment?.testingNoAPI) {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('Template Uploaded');
        }, Math.floor(Math.random() * 2000));
      });
    }

    if (!environment?.testingNoAPI) {      
      return this.http.post(url, formData, headers);
    }
  }
  downloadTemplate(uuid) {
    const downloadHeaders = new HttpHeaders().set(
      'content-type',
      'application/zip'
    );
    let url = `${environment.apiUrl}templates/`;
    if (!environment.testingNoAPI) {
      return this.http.get(url, {
        headers: downloadHeaders,
        responseType: 'blob',
      });
    } else {
      if (environment.testingNoAPI) {
        return new Observable((exampleObs) => {
          setTimeout(() => {
            exampleObs.next('template downloaded');
          }, Math.floor(Math.random() * 1000));
        });
      }
    }
  }

  deleteTemplate(templateUUID) {
    //Double check settings, as this function is passed directly to delete modal
    if (!this.settingsService) {
      this.settingsService = new SettingsService();
    }

    let url = `${environment.apiUrl}templates/`;
    let httpOptions: any = {
      body: {
        uuid: templateUUID,
      },
      headers: headers,
    };

    if (!environment.testingNoAPI) {
      return this.http.post(url, httpOptions);
    }

    if (environment.testingNoAPI) {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('temlpate deleted');
        }, Math.floor(Math.random() * 200));
      });
    }
  }

  //I'm not so sure about this we may want to find a different way
  public uploadFile(obj: TemplateService,file:any): any {
    return obj.uploadTemplate(file);    
  }
}
