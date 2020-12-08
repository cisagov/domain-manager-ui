// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Local Service Imports
import { DomainManagementTabService } from 'src/app/services/domain-management-tabs.service';
import { LayoutService } from 'src/app/services/layout.service';

//Models
import { DomainModel } from 'src/app/models/domain.model';

@Component({
  selector: 'domain-management-details',
  templateUrl: './domain-management-details.component.html',
  styleUrls: ['./domain-management-details.component.scss'],
})
export class DomainManagementDetailsComponent implements OnInit, OnDestroy {
  component_subscriptions = []; //Angular subscriptions, deleted in ngOnDestroy
  domain_uuid = null;
  domain: DomainModel;
  dm_form: FormGroup;
  selectedTabIndex: number = 0;
  completedTabs: number[] = []

  constructor(
    public activeRoute: ActivatedRoute,
    public domainTabSvc: DomainManagementTabService,
    public formBuilder: FormBuilder,
    public layoutSvc: LayoutService
  ) {
    this.layoutSvc.setTitle('Domain Managment Details');
  }

  ngOnInit(): void {
    // this._buildForm();
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe(
        (params) => {
          this.domain_uuid = params['domain_uuid'];
          if (this.domain_uuid !== null) {
            // this.loadDomain(this.domain_uuid);
            this.domainTabSvc.getDomainDetails(this.domain_uuid)
          }
        },
        (error) => {
          console.log('Failed to load domain');
          console.log(error);
        }
      )
    );
    this._getNextTabObservable();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  /**
   * Perform the get request for a specific domain,
   * Populates
   * @param domain_uuid the id of the domain to load
   */
  // loadDomain(domain_uuid) {
  //   if(this.domainTabSvc.getDomainDetails(domain_uuid)){
  //     console.log(this.domainTabSvc.domainData)
  //   }
  // }

  _getNextTabObservable(){
    this.component_subscriptions.push(
      this.domainTabSvc.tabCompleteBehvaiorSubject.subscribe(
        (tabComplete) => {
          if(tabComplete){
            this.selectedTabIndex += 1;
          }
        }
    ))
  }
  tabIsActive(){

  }

  /**
   * Event fires when a new tab is selected
   */
  onTabChanged(event) {
    console.log(event)
  }

  /**
   * convenience getter for easy access to form fields
   */
  get f() {
    return this.dm_form?.controls;
  }
}
