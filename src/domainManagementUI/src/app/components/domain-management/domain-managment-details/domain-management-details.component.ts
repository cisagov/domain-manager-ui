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
import { DomainManagementService } from 'src/app/services/domain-management.service';
import { LayoutService } from 'src/app/services/layout.service';

//Models
import { DomainModel } from 'src/app/models/domain.model';

@Component({
  selector: 'domain-management-details',
  templateUrl: './domain-management-details.component.html',
  styleUrls: ['./domain-management-details.component.scss'],
})
export class DomainManagementDetailsComponent implements OnInit, OnDestroy {

  component_subscriptions = [];     //Angular subscriptions, deleted in ngOnDestroy
  domain_uuid = null;
  domain: DomainModel;
  dm_form: FormGroup;
  selectedTabIndex: number;


  constructor(
    public activeRoute: ActivatedRoute,
    public domainSvc: DomainManagementService,
    public formBuilder: FormBuilder,
    public layoutSvc: LayoutService
  ) {
    this.layoutSvc.setTitle('Domain Managment Details');
  }

  ngOnInit(): void {

    this._buildForm()
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this.domain_uuid = params['domain_uuid'];
        if (this.domain_uuid !== null) {
          this.loadDomain(this.domain_uuid);
          this._populateFormWithData
        }
      },(error) => {
        console.log("Failed to load domain")
        console.log(error)
      })
    );    
    this._onChanges()
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

   /**
   * Build out the formgroup for domain management
   */
  _buildForm(){
    this.dm_form = new FormGroup(
      {
        domain_name: new FormControl('',{
          validators: Validators.required
        }),
        registrar_name: new FormControl('',{
          validators: Validators.required
        }),
        category_one: new FormControl('',{}),
        category_two: new FormControl('',{}),
        category_three: new FormControl('',{}),
        is_registered_on_mailgun: new FormControl('',{}),
        is_registered_on_public_web: new FormControl('',{}),
        purchased_date: new FormControl('',{}),
        standup_date: new FormControl('',{}),
      },
      { updateOn: 'blur' }
    )
  }

  /**
   * Perform the get request for a specific domain,
   * Populates 
   * @param domain_uuid the id of the domain to load
   */
  loadDomain(domain_uuid) {
    this.domainSvc.getDomainDetails(domain_uuid).subscribe(
      (success) => {
        this.domain = success as DomainModel
        this._populateFormWithData(this.domain)
        console.log(this.domain)
      },
      (error) => {
        console.log(`Error from service ${error}`);
      }
    );
  }

  _populateFormWithData(domainData: DomainModel){
    this.f.domain_name.setValue(domainData.name ?? null)
    this.f.registrar_name.setValue(domainData.registrarName ?? null)
    this.f.category_one.setValue(domainData.categoryOne ?? null)
    this.f.category_two.setValue(domainData.categoryTwo ?? null)
    this.f.category_three.setValue(domainData.categoryThree ?? null)
    this.f.is_registered_on_mailgun.setValue(domainData.registeredOnMailgun ?? null)
    this.f.is_registered_on_public_web.setValue(domainData.registeredOnPublicWeb ?? null)
    console.log(this.f)
  }

   

  /**
   * set subscriptions to watch form fields
   */
  _onChanges(): void {
    this.component_subscriptions.push(
      this.f.domain_name.valueChanges.subscribe((val) => {
        console.log(val)
        //Change operation here
      })
    );
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
    return this.dm_form.controls;
  }
}
