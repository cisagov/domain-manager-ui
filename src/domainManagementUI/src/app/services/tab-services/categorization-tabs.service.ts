import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable, OnInit } from '@angular/core';

// Local Servie Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoryService } from 'src/app/services/category.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

// Models
import { TemplateAttribute } from 'src/app/models/template.model';

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
  public userIsAdmin: boolean = false;

  constructor(
    public alertsSvc: AlertsService,
    public categorySvc: CategoryService,
    private userAuthSvc: UserAuthService
  ) {
    this.userIsAdmin = this.userAuthSvc.userIsAdmin();
  }

  getCategorizations(status) {
    return this.categorySvc.getCategorizations(status);
  }

  updateCategory(id: string, data: object) {
    return this.categorySvc.updateCategorization(id, data);
  }
}