import { Injectable, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Local Servie Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { ApplicationService } from 'src/app/services/applications.service';
import { DomainService } from '../domain.service';

//Local Model Imports
import { ApplicationModel } from 'src/app/models/application.model';
import { DomainModel } from 'src/app/models/domain.model';


@Injectable({
  providedIn: 'root',
})
export class ApplicationsTabService {
  public loading = true;
  public application_data: ApplicationModel = new ApplicationModel()
  public application_data_behavior_subject: BehaviorSubject<ApplicationModel> =
    new BehaviorSubject<ApplicationModel>(new ApplicationModel());
  public domains_data_behavior_subject: BehaviorSubject<Array<DomainModel>> =
    new BehaviorSubject<Array<DomainModel>>(new Array<DomainModel>());
  public domains_assigned: Array<DomainModel>
  public domains_not_assigned: Array<DomainModel>


  constructor(
    public alertsSvc: AlertsService,
    public applicationsSvc: ApplicationService,
    public domainSvc: DomainService,
  ) {
    this.init();
  }

  init() {
    this.loading = true;
    this.domains_assigned = new Array<DomainModel>();
    this.domains_not_assigned = new Array<DomainModel>();

  }

  getApplication(app_id){
    this.applicationsSvc.getApplication(app_id).subscribe(
      (success) => {
        let appData = success as ApplicationModel
        this.application_data_behavior_subject.next(appData)
        this.application_data = appData;
        this.getDomains()

        this.loading = false;
      }
    )
  }

  getDomains(){
    this.domainSvc.getAllDomains().subscribe(
      (data) => {
        let allDomains = data as Array<DomainModel>
        console.log(this.application_data)
        this.domains_assigned = allDomains.filter((item) => item.application_id == this.application_data._id)
        let assingedIds = this.domains_assigned.map(item => item.application_id)
        this.domains_not_assigned = allDomains.filter((item)  =>
          assingedIds.indexOf(item.application_id) === -1 && !item.application_id
        )
        this.domains_data_behavior_subject.next(this.domains_not_assigned)
      }
    )
  }
  getUnassignedDomains(allDomains, assignedDomains){
    console.log(assignedDomains)
    console.log(allDomains)
    console.log(assignedDomains.map((assinged) => {
      allDomains.filter((item) => item._id !== assinged._id)
    }))
  }

  updateApplication(){
    this.applicationsSvc.updateApplication(this.application_data._id,this.application_data)
    .subscribe( 
      (success) => {
        this.alertsSvc.alert('Application Updated');
        this.application_data_behavior_subject.next(this.application_data)
      }
    )
  }

  getApplicationUpdateBehvaiorSubject() {
    return this.application_data_behavior_subject;
  }
  getDomainsUpdateBehvaiorSubject() {
    return this.domains_data_behavior_subject;
  }

}
