import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { BehaviorSubject } from 'rxjs';

//Local Servie Imports
import { AlertsService } from 'src/app/services/alerts.service';
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
    public alertsSvc: AlertsService,
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

    //TODO change over to single template details call when api is available
    this.templateSvc.getAllTemplates().subscribe(
      (success: Array<TemplateModel>) => {
        console.log(success.filter((t) => t._id == _id)[0]);
        let single_template = success.filter((t) => t._id == _id)[0];
        this.template_data = single_template as TemplateModel;
        this.template_data_behavior_subject.next(this.template_data);
        this.initalizeData();
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
          (ws) => ws.category === this.template_data.name
        );
        console.log(this.websites_used_list);
      },
      (failure) => {
        this.alertsSvc.alert('Failure To Get Websites');
        console.log(failure);
      }
    );
  }

  downloadWebsite(uuid) {
    this.websiteSvc.downloadWebsite(uuid);
  }
}
