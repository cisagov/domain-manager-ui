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
export class CategorizationTabService {
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
    public categorySvc: CategoryService,
    private userAuthSvc: UserAuthService
  ) {
    this.userIsAdmin = this.userAuthSvc.userIsAdmin();
  }
}
