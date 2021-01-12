import { BehaviorSubject } from 'rxjs';
import {
  EmailValidator,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Injectable, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

//Local Servie Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { ApplicationService } from 'src/app/services/applications.service';
import { TemplateService } from 'src/app/services/template.service';
import { WebsiteService } from 'src/app/services/website.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

//Models
import { ApplicationModel } from 'src/app/models/application.model';
import { environment } from 'src/environments/environment';
import { TemplateAttribute } from 'src/app/models/template.model';
import { WebsiteModel, WebsiteHistoryModel, HostedZoneModel } from 'src/app/models/website.model';

@Injectable({
  providedIn: 'root',
})
export class WebsiteDetailsTabService {
  attributes_form: FormGroup;
  summary_form: FormGroup;
  template_selection_form: FormGroup;

  public attribueList: Array<TemplateAttribute> = new Array<TemplateAttribute>();
  public tabCompleteBehvaiorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public templateExists: boolean = false;
  public templateSelectinoMethod: string = null;
  public templateSelectionBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );
  public website_data: WebsiteModel = new WebsiteModel();
  public website_data_behavior_subject: BehaviorSubject<WebsiteModel> = new BehaviorSubject<WebsiteModel>(
    new WebsiteModel()
  );
  public website_history: WebsiteHistoryModel[] = new Array<WebsiteHistoryModel>();
  public userIsAdmin: boolean = false;

  constructor(
    private applicationSvc: ApplicationService,
    private settingsService: SettingsService,
    private templateSvc: TemplateService,
    private userAuthSvc: UserAuthService,
    public websiteSvc: WebsiteService
  ) {
    this._rebuildForms();
    this.website_data_behavior_subject.subscribe((data) => {
      this.website_data = data;
      this.initalizeData();
      this._setFormData();
    });
    this.userAuthSvc.getUserIsAdminBehaviorSubject().subscribe((value) => {
      this.userIsAdmin = value;
    });
  }

  getWebsiteDataBehaviorSubject() {
    return this.website_data_behavior_subject;
  }
  getTemplateUpdateBehvaiorSubject() {
    return this.templateSelectionBehaviorSubject;
  }

  getWebsiteDetails(_id) {
    this.website_data = new WebsiteModel();
    this.websiteSvc.getWebsiteDetails(_id).subscribe(
      (success) => {
        this.website_data = success as WebsiteModel;
        this.website_data_behavior_subject.next(this.website_data);
        this.initalizeData();
      },
      (error) => {
        console.log(`Error from service ${error}`);
      }
    );
  }
  getWebsiteHistory(_id) {
    this.website_history = new Array<WebsiteHistoryModel>();
    this.websiteSvc.getWebsiteHistory(_id)?.subscribe(
      (success) => {
        this.website_history = success as WebsiteHistoryModel[];
      },
      (failure) => {
        console.log('FAILED TO LOAD WEBSITE HISTORY');
      }
    );
  }

  initalizeData() {

    //reInitalize default values of variables when a new website is loaded
  this.templateExists = false;
  this.templateSelectinoMethod = null;

    this.setTemplateStatus();
    if(this.website_data.application_id){
      //If application data received
        //get application list
      this.applicationSvc.getApplication(this.website_data.application_id).subscribe(
        (success) => {
          this.website_data.application_using = success as ApplicationModel
        },
        (failure) => {}
      )     
    } 
      //set template status
    this.setTemplateStatus();

      //Get hosted zones if route 53 exists
    if(this.website_data.route53){
      this.websiteSvc.getHostedZones(this.website_data._id).subscribe(
        (success) => {
          this.website_data.hosted_zones = success as HostedZoneModel[]
          console.log(success)},
        (failure) => {console.log("failed to get hosted zones")}
      )
    }

    
    
  }
  getAllTemplates() {
    return this.templateSvc.getAllTemplates();
  }

  _rebuildForms() {
    this._buildTemplateSelectionForm();
    this._buildSummaryForm();
    this._buildAttributesForm();
  }

  _buildTemplateSelectionForm() {
    this.template_selection_form = new FormGroup({
      _id: new FormControl('', { validators: Validators.required }),
    });
  }

  _buildAttributesForm() {
    this.attributes_form = new FormGroup({});

    this.templateSvc.getTemplateAttributes().subscribe(
      (success) => {
        let formatedAttributeList = this.templateSvc.toTemplateAttributeModels(
          success
        );
        this.attribueList = formatedAttributeList as TemplateAttribute[];
        if (Array.isArray(this.attribueList)) {
          this.attribueList.forEach((attribute) => {
            console.log(attribute);
            this.attributes_form.addControl(
              attribute.key,
              new FormControl('', Validators.required)
            );
          });
        }
        console.log(this.attributes_form);
      },
      (failure) => {
        console.log(failure);
      }
    );
  }
  _buildSummaryForm() {
    this.summary_form = new FormGroup({
      application_id: new FormControl('', {}),
    });
  }

  _setFormData(){
    this.summary_form.controls.application_id.setValue(this.website_data.application_id);
  }

  downloadWebsite(uuid) {
    return this.websiteSvc.downloadWebsite(uuid);
  }
  deleteWebsite(uuid) {
    return this.websiteSvc.deleteWebsite(uuid);
  }

  isSiteLaunched() {
    if (this.website_data.is_active) {
      return true;
    }
  }
  hashistory() {
    if (this.website_data.history?.length) {
      return true;
    }
  }

  setTemplateStatus(input = null) {
    if (this.website_data.s3_url && input == null) {
      this.templateExists = true;
    } else if (input) {
      this.templateExists = input;
    }

    console.log(this.templateExists);
  }

  isValid(form: FormGroup) {
    if (form.valid) {
      return true;
    } else {
      form.markAllAsTouched();
      return false;
    }
  }

  submitTab(form: FormGroup) {
    if (this.isValid(form)) {
      this.tabCompleteBehvaiorSubject.next(true);
    } else {
      console.log('form invalid');
    }
  }
}
