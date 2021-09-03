import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

// Local Servie Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { ApplicationService } from 'src/app/services/applications.service';
import { CategoryService } from 'src/app/services/category.service';
import { TemplateService } from 'src/app/services/template.service';
import { DomainService } from 'src/app/services/domain.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

// Models
import { ApplicationModel } from 'src/app/models/application.model';
import { TemplateAttribute } from 'src/app/models/template.model';
import { DomainModel, HostedZoneModel } from 'src/app/models/domain.model';

@Injectable({
  providedIn: 'root',
})
export class DomainDetailsTabService {
  attributes_form: FormGroup;
  proxy_categoriztion_tab_form: FormGroup;
  summary_form: FormGroup;
  template_selection_form: FormGroup;

  public attributeList: Array<TemplateAttribute> = new Array<TemplateAttribute>();
  public tabCompleteBehvaiorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public loadingItems = [];
  public templateExists: boolean = false;
  public templateSelectinoMethod: string = null;
  public templateSelectionBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );
  public domain_data: DomainModel = new DomainModel();
  public domain_data_behavior_subject: BehaviorSubject<DomainModel> = new BehaviorSubject<DomainModel>(
    new DomainModel()
  );
  public userIsAdmin: boolean = false;

  constructor(
    public alertsSvc: AlertsService,
    private applicationSvc: ApplicationService,
    public categorySvc: CategoryService,
    private settingsService: SettingsService,
    private templateSvc: TemplateService,
    private userAuthSvc: UserAuthService,
    public domainSvc: DomainService
  ) {
    this._rebuildForms();
    this.domain_data_behavior_subject.subscribe((data) => {
      this.domain_data = data;
      this.initalizeData();
      this._setFormData();
    });

    this.userIsAdmin = this.userAuthSvc.userIsAdmin();
  }

  getDomainDataBehaviorSubject() {
    return this.domain_data_behavior_subject;
  }
  getTemplateUpdateBehvaiorSubject() {
    return this.templateSelectionBehaviorSubject;
  }

  async getDomainDetails(_id) {
    try {
      this.setLoadingStatus('domain_loading', true);
      this.domain_data = new DomainModel();
      this.domain_data = await this.domainSvc.getDomainDetails(_id);
      this.domain_data_behavior_subject.next(this.domain_data);
      this._buildAttributesForm(this.domain_data.name);
    } catch (failure) {
      this.alertsSvc.alert(failure.message);
    } finally {
      this.setLoadingStatus('domain_loading', false);
    }
  }

  initalizeData() {
    //reInitalize default values of variables when a new domain is loaded
    this.templateExists = false;
    this.templateSelectinoMethod = null;

    this.setTemplateStatus();
    if (this.domain_data.application_id) {
      //If application data received
      //get application list
      if (this.userIsAdmin) {
        this.setLoadingStatus('application_loading', true);
        this.applicationSvc
          .getApplication(this.domain_data.application_id)
          .subscribe(
            (success) => {
              this.domain_data.application_using = success as ApplicationModel;
              this.setLoadingStatus('application_loading', false);
            },
            (failure) => {
              this.alertsSvc.alert(failure);
              this.setLoadingStatus('application_loading', false);
            }
          );
      }
      if (this.domain_data.is_active) {
        this.getCloudfrontStatus();
      }
    }
    //set template status
    this.setTemplateStatus();

    //Get hosted zones if route 53 exists
    if (this.domain_data.route53) {
      this.domainSvc.getHostedZones(this.domain_data._id).subscribe(
        (success) => {
          this.domain_data.hosted_zones = success as HostedZoneModel[];
        },
        (failure) => {
          this.alertsSvc.alert('Failed to get hosted zones');
          console.log(failure);
        }
      );
    }
  }

  getAllTemplates() {
    return this.templateSvc.getAllTemplates();
  }

  updateDomain() {
    return this.domainSvc.updateDomain(this.domain_data);
  }

  _rebuildForms() {
    this._buildTemplateSelectionForm();
    this._buildSummaryForm();
    this._buildCategoryForm();
  }

  _buildTemplateSelectionForm() {
    this.template_selection_form = new FormGroup({
      _id: new FormControl('', { validators: Validators.required }),
      name: new FormControl('', { validators: Validators.required }),
    });
  }

  _buildAttributesForm(name: string) {
    this.attributes_form = new FormGroup({});
    this.attributeList = [];
    this.templateSvc
      .getTemplateAttributes()
      .subscribe((attributes: { [key: string]: string }) => {
        Object.entries(attributes).forEach((key, value) => {
          const attribute = new TemplateAttribute();

          if (key[0] == 'CompanyName') {
            key[1] = name;
          } else if (key[0] == 'Email') {
            key[1] = `info@${name}`;
          }

          attribute.key = key[0];
          attribute.value = key[1];
          this.attributeList.push(attribute);
          this.attributes_form.addControl(
            attribute.key,
            new FormControl('', Validators.required)
          );
        });
      });
  }
  _buildSummaryForm() {
    this.summary_form = new FormGroup({
      application_id: new FormControl('', {}),
    });
  }
  _buildCategoryForm() {
    this.proxy_categoriztion_tab_form = new FormGroup({
      category_one: new FormControl('', { validators: Validators.required }),
      category_two: new FormControl(''),
      category_three: new FormControl(''),
    });
  }

  _setFormData() {
    this.summary_form.controls.application_id.setValue(
      this.domain_data.application_id
    );
  }

  downloadDomain() {
    return this.domainSvc.downloadDomain(this.domain_data._id);
  }
  deleteDomain(domainId: string) {
    return this.domainSvc.deleteDomain(domainId);
  }

  hasTemplateAttached() {
    if (this.domain_data.s3_url) {
      return true;
    } else {
      return false;
    }
  }

  hasHistory() {
    if (this.domain_data.history?.length) {
      return true;
    }
  }

  hasEmailActive() {
    if (this.domain_data.is_email_active) {
      return true;
    }
  }

  isSiteLaunched() {
    if (this.domain_data.is_active) {
      return true;
    }
  }

  canBeTakenDown() {
    if (this.isSiteLaunched() && !this.domain_data.is_delaunching) {
      return true;
    }
    return false;
  }

  canBeLaunched() {
    if (
      !this.isSiteLaunched() &&
      !this.domain_data.is_launching &&
      this.hasTemplateAttached()
    ) {
      return true;
    }
    return false;
  }

  takeDownSite() {
    if (this.canBeTakenDown()) {
      this.domain_data.is_delaunching = true;
      return this.domainSvc.takeDownDomain(this.domain_data._id);
    } else {
      if (!this.isSiteLaunched()) {
        this.alertsSvc.alert(
          'Can not take down a site that has not been launched'
        );
      }
      if (!this.domain_data.is_delaunching) {
        this.alertsSvc.alert(
          'Domain is currently in the process of being taken down'
        );
      }
    }
  }

  launchSite() {
    if (this.canBeLaunched()) {
      this.domain_data.is_launching = true;
      return this.domainSvc.launchDomain(this.domain_data._id);
    } else {
      if (!this.hasTemplateAttached()) {
        this.alertsSvc.alert(
          'Please attach a template prior to launching the site'
        );
      }
      if (this.domain_data.is_launching) {
        this.alertsSvc.alert('Domain is currently in the process of launching');
      }
    }
  }

  removeTemplate() {
    if (this.hasTemplateAttached()) {
      this.domainSvc.removeTemplate(this.domain_data._id).subscribe(
        (success) => {},
        (failure) => {
          this.alertsSvc.alert('Failed to remove template');
        }
      );
    } else {
      console.log(this.domain_data.s3_url);
    }
  }

  generateFromTemplate() {
    let domain_id = this.domain_data._id;
    let template_name = this.template_selection_form.controls.name.value;
    let attributeDictionary = {};
    this.attributeList.forEach((attribute) => {
      attributeDictionary[attribute.key] = this.attributes_form.controls[
        attribute.key
      ].value;
    });
    return this.domainSvc.generateFromTemplate(
      domain_id,
      template_name,
      attributeDictionary
    );
  }

  setTemplateStatus(input = null) {
    if (this.domain_data.s3_url && input == null) {
      this.templateExists = true;
    } else if (input) {
      this.templateExists = input;
    }
  }
  submitCategory() {
    return this.categorySvc.submitCategory(
      this.domain_data._id,
      this.proxy_categoriztion_tab_form.controls.category_one.value
    );
  }

  checkCategories() {
    return this.categorySvc.checkCategory(this.domain_data._id);
  }

  updateCategory(id: string, data: object) {
    return this.categorySvc.updateCategorization(id, data);
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

  getCloudfrontStatus() {
    this.setLoadingStatus('cloudfront_status_loading', true);
    this.domainSvc.getCloudfrontStatus(this.domain_data._id).subscribe(
      (success) => {
        this.domain_data.cloudfront_status = success;
        this.setLoadingStatus('cloudfront_status_loading', false);
      },
      (failure) => {
        this.alertsSvc.alert(failure);
        this.setLoadingStatus('cloudfront_status_loading', false);
      }
    );
  }

  setLoadingStatus(loading_item, value) {
    if (value === true) {
      let pushObj = {};
      pushObj[loading_item] = value;
      this.loadingItems.push(pushObj);
    } else if (value === false) {
      this.loadingItems
        .filter((i) => loading_item in i)
        .forEach((t) => (t[loading_item] = false));
    }
  }

  isLoading() {
    let isLoading = false;
    if (this.loadingItems.length == 0) {
      console.log('TRUE - 0');
      isLoading = true;
    }
    this.loadingItems.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (item[key] == true) {
          isLoading = true;
        }
      });
    });
    return isLoading;
  }
}
