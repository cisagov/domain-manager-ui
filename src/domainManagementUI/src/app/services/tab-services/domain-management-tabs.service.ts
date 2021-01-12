import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { BehaviorSubject } from 'rxjs';
import {
  EmailValidator,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

//Models
import { DomainModel } from 'src/app/models/domain.model';
import { environment } from 'src/environments/environment';
// import { domain } from 'process';
import { Domain } from 'domain';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable({
  providedIn: 'root',
})
export class DomainManagementTabService {
  gen_attribute_tab_form: FormGroup;
  website_selection_tab_form: FormGroup;
  proxy_categoriztion_tab_form: FormGroup;
  review_tab_form: FormGroup;

  public domainData: DomainModel = new DomainModel();
  public domain_data_behavior_subject: BehaviorSubject<DomainModel> = new BehaviorSubject<DomainModel>(
    new DomainModel()
  );
  public tabCompleteBehvaiorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  //TESTING VARS, REMOVE
  isExistingDomain = true;

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this._rebuildForms();
    this.domain_data_behavior_subject.subscribe((data) => {
      this.domainData = data;
      this._updateFormsWithNewData();
    });
    this._onChanges();
  }

  getDomainDataBehaviorSubject() {
    return this.domain_data_behavior_subject;
  }
  getTabCompleteBehviorSubject() {
    return this.tabCompleteBehvaiorSubject;
  }

  getDomainDetails(domain_uuid) {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/domain/${domain_uuid}/`;

    // this.http.get(url,headers).subscribe(
    //   (success) => {
    //     this.domainData = success as DomainModel;
    //     this.domainDataBehaviorSubject.next(this.domainData)
    //   },
    //   (error) => {
    //     console.log(`Error from service ${error}`);
    //   }
    // );

    //Testing harness
    if (environment.testingNoAPI) {
      let newData = new DomainModel();
      newData.name += domain_uuid;
      newData.uuid = domain_uuid;
      newData.categoryOne = 'UUID-2';
      newData._id = 'UUID_selected';
      newData.update_email = 'Test@email.com';
      newData.useHistory = [
        {
          applicationThatUsed: 'Previous App One',
          startDate: new Date('2019-01-06'),
          stopDate: new Date('2019-06-26'),
        },
        {
          applicationThatUsed: 'Previous App Two',
          startDate: new Date('2019-06-26'),
          stopDate: new Date('2019-09-13'),
        },
        {
          applicationThatUsed: 'Previous App Three',
          startDate: new Date('2020-02-06'),
          stopDate: new Date('2020-08-14'),
        },
      ];
      if (this.isExistingDomain) {
        newData.application_uuid = 'application-3-UUID';
        newData.createMailgun = true;
      }
      setTimeout(() => {
        this.domain_data_behavior_subject.next(newData);
      }, 100);
      // this.domainData = newData
      return true;
    } else {
      this.domain_data_behavior_subject.next(new DomainModel());
    }
  }

  _updateFormsWithNewData() {
    this._rebuildForms();
    this._setFormData();
  }

  _rebuildForms() {
    this.gen_attribute_tab_form = new FormGroup({
      application_uuid: new FormControl('', {
        validators: Validators.required,
      }),
      create_mail_gun: new FormControl(''),
      create_SES: new FormControl(''),
    });
    this.website_selection_tab_form = new FormGroup({
      _id: new FormControl('', { validators: Validators.required }),
    });
    this.proxy_categoriztion_tab_form = new FormGroup({
      category_one: new FormControl('', { validators: Validators.required }),
      category_two: new FormControl(''),
      category_three: new FormControl(''),
    });
    this.review_tab_form = new FormGroup({
      update_email: new FormControl(''),
    });
  }
  _setFormData() {
    let gfCont = this.gen_attribute_tab_form.controls;
    gfCont.application_uuid.setValue(this.domainData.application_uuid);
    gfCont.create_mail_gun.setValue(this.domainData.createMailgun);
    gfCont.create_SES.setValue(this.domainData.createSES);

    let wsCont = this.website_selection_tab_form.controls;
    wsCont._id.setValue(this.domainData._id);

    let pxCont = this.proxy_categoriztion_tab_form.controls;
    pxCont.category_one.setValue(this.domainData.categoryOne);
    pxCont.category_two.setValue(this.domainData.categoryTwo);
    pxCont.category_three.setValue(this.domainData.categoryThree);

    let rCont = this.review_tab_form.controls;
    rCont.update_email.setValue(this.domainData.update_email);
  }

  submitTab(form: FormGroup) {
    if (this.isValid(form)) {
      this.tabCompleteBehvaiorSubject.next(true);
    } else {
      console.log('form invalid');
    }
  }

  isValid(form: FormGroup) {
    if (form.valid) {
      return true;
    } else {
      form.markAllAsTouched();
      return false;
    }
  }

  /**
   * set subscriptions to watch form fields
   */
  _onChanges(): void {
    this.gen_attribute_tab_form.controls.application_uuid.valueChanges.subscribe(
      (val) => {
        console.log(val);
        //Change operation here
      }
    );
  }
}
