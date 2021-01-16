import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
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
      return this.http.get(url,headers);
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

  getTemplateDetails(website__id) {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/templates/${website__id}`;

    // return this.http.get(url,headers)

    //Example observable return for testing purposes
    //TODO: REMOVE
    return new Observable((exampleObs) => {
      if (this.template_list.length === 0) {
        this.getAllTemplates();
      }
      let retVal = this.template_list.find((t) => t._id === website__id);
      if (retVal) {
        exampleObs.next(retVal);
      } else {
        exampleObs.error('Failed to find template with uuid: ' + website__id);
      }
    });
  }

  // Seperated out to allow for differing sources of attributes to be used
  // Current plan on attribute sourcing has changed rapidly and should be
  // modular to allow for the inevitable future changes
  getTemplateAttributes() {
    //Current plan is to have an api endpoint with all template attributes
    //Unsure if all temlpates will share the same attributes or if they
    //will be tmeplate specific

    // let url = `${this.settingsService.settings.apiUrl}/api/templatesAttributes`;
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

  uploadTemplate(formData:FormData, overwrite:boolean) {
    //Double check settings, as this function is passed directly to upload modal    
    let url = `${this.settingsService.settings.apiUrl}/api/templates?overwrite=`+overwrite;    
    if (environment?.testingNoAPI) {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('Template Uploaded');
        }, Math.floor(Math.random() * 2000));
      });
    }

    if (!environment?.testingNoAPI) {      
      const config = new HttpRequest('POST',url,formData,{
        reportProgress: true
      });
      return this.http.request( config );      
    }
  }
  downloadTemplate(uuid) {
    const downloadHeaders = new HttpHeaders().set(
      'content-type',
      'application/*zip*'
    );
    let url = `${this.settingsService.settings.apiUrl}/api/templates/`;
    if (!environment.testingNoAPI) {
      return this.http.get(url, {
        headers: downloadHeaders,
        responseType: 'blob',
      });
    } else {
      if (environment.localData) {
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

    let url = `${this.settingsService.settings.apiUrl}/api/templates/`;
    let httpOptions: any = {
      body: {
        uuid: templateUUID,
      },
      headers: headers,
    };

    if (!environment.localData) {
      return this.http.post(url, httpOptions);
    }

    if (environment.localData) {
      return new Observable((exampleObs) => {
        setTimeout(() => {
          exampleObs.next('temlpate deleted');
        }, Math.floor(Math.random() * 200));
      });
    }
  }

  tmpvar: any;
  
  preloadValidationData() {
    this.getAllTemplates().subscribe(
      (success) => {
        let tmpvar = new MatTableDataSource<TemplateModel>(
          success as TemplateModel[]
        );
        this.template_list = tmpvar.data;
      },
      (error) => {
        console.log('Error getting website list');
        console.log(error);        
      }
    );
  }

  public uploadFile(file:any, overwrite:boolean): any {
    return this.uploadTemplate(file,overwrite);    
  }
  validateBeforeUpload(files){        
     //go through the files check to see if any are in the 
    //name list already.   If they are then return an error and 
    //prompt to overwrite
    /*
    get the list of templates in the preloadValidationData()
     */  
    let duplicateFilesList = [];
    for(let file of files){
      console.log(file);      
      for(let template of this.template_list){ 
        console.log(template);
        if(template.name == file.name.substring(0, file.name.length-4)){
            duplicateFilesList.push({name:file['name'],status:"Already Exists"});          
        }
      }
    }
    return duplicateFilesList;
  }

}
