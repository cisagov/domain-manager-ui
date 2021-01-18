import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { BehaviorSubject } from 'rxjs';

//Local Servie Imports
import { TemplateService } from 'src/app/services/template.service';
import { WebsiteService } from 'src/app/services/website.service';

//Models
import { environment } from 'src/environments/environment';
import {
  TemplateModel,
  TemplateAttribute,
} from 'src/app/models/template.model';
import { WebsiteModel } from 'src/app/models/website.model';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable({
  providedIn: 'root',
})
export class TemplateDetailsTabService {
  public template_data: TemplateModel = new TemplateModel();
  public template_data_behavior_subject: BehaviorSubject<TemplateModel> = new BehaviorSubject<TemplateModel>(
    new TemplateModel()
  );
  public websites_used_list: Array<WebsiteModel> = [];

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService,
    private templateSvc: TemplateService,
    private websiteSvc: WebsiteService
  ) {
    this.template_data_behavior_subject.subscribe((data) => {
      this.template_data = data;
      this.initalizeData();
    });
  }

  getTemplateDataBehaviorSubject() {
    return this.template_data_behavior_subject;
  }

  getTemplateDetails(_id) {
    console.log(_id);
    this.templateSvc.getTemplateDetails(_id).subscribe(
      (success) => {
        console.log(success);
        //TODO: Remove timeoutsection that is being used for testing pre -API
        setTimeout(() => {
          this.template_data = success as TemplateModel;
          this.template_data_behavior_subject.next(this.template_data);
          this.initalizeData();
        }, 100);
      },
      (error) => {
        console.log(`Error from service ${error}`);
      }
    );
  }

  initalizeData() {
    this.getWebsitesUsed();
  }

  downloadTemplate(uuid) {
    return this.templateSvc.downloadTemplate(uuid);
  }

  deleteTemplate(templateUUID) {
    return this.templateSvc.deleteTemplate(templateUUID);
  }

  getWebsitesUsed() {
    this.websiteSvc.getAllWebsites().subscribe(
      (success) => {
        let data = success as Array<WebsiteModel>;
        this.websites_used_list = data.filter(
          (ws) => ws.template_base_uuid === this.template_data._id
        );
        console.log(this.websites_used_list);
      },
      (failure) => {
        console.log('Failed to get websites used');
        console.log(failure);
      }
    );
  }

  downloadWebsite(uuid) {
    this.websiteSvc.downloadWebsite(uuid);
  }
}
