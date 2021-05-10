import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { BehaviorSubject } from 'rxjs';

//Local Servie Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { TemplateService } from 'src/app/services/template.service';
import { DomainService } from 'src/app/services/domain.service';

//Models
import { environment } from 'src/environments/environment';
import {
  TemplateModel,
  TemplateAttribute,
} from 'src/app/models/template.model';
import { DomainModel } from 'src/app/models/domain.model';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable({
  providedIn: 'root',
})
export class TemplateDetailsTabService {
  public template_data: TemplateModel = new TemplateModel();
  public template_data_behavior_subject: BehaviorSubject<TemplateModel> =
    new BehaviorSubject<TemplateModel>(new TemplateModel());
  public domains_used_behavior_subject: BehaviorSubject<Array<DomainModel>> =
    new BehaviorSubject<Array<DomainModel>>(new Array<DomainModel>());
  public domains_used_list: Array<DomainModel> = [];

  constructor(
    public alertsSvc: AlertsService,
    private http: HttpClient,
    private settingsService: SettingsService,
    private templateSvc: TemplateService,
    private domainSvc: DomainService
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
    this.templateSvc.getTemplateDetails(_id).subscribe(
      (success) => {
        this.template_data = success as TemplateModel;
        this.template_data_behavior_subject.next(this.template_data);
        this.initalizeData();
      },
      (error) => {
        this.alertsSvc.alert(error);
      }
    );
  }

  initalizeData() {
    this.getDomainsUsed();
  }

  downloadTemplate(uuid) {
    return this.templateSvc.downloadTemplate(uuid);
  }

  deleteTemplate(templateId: string) {
    return this.templateSvc.deleteTemplate(templateId);
  }

  getDomainsUsed() {
    this.domainSvc.getAllDomains().subscribe(
      (success) => {
        let data = success as Array<DomainModel>;
        this.domains_used_list = data.filter(
          (ws) => ws.template_name === this.template_data.name
        );
        this.domains_used_behavior_subject.next(this.domains_used_list);
        console.log(this.domains_used_list);
      },
      (failure) => {
        this.alertsSvc.alert(failure);
      }
    );
  }

  downloadDomain(uuid) {
    this.domainSvc.downloadDomain(uuid);
  }
}
