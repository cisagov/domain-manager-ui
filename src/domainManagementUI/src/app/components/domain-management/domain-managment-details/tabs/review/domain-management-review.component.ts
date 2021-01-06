// Angular Imports
import { Component, OnInit } from '@angular/core';

// Local Service Imports
import { ApplicationService } from 'src/app/services/applications.service';
import { CategoryService } from 'src/app/services/category.service'
import { LayoutService } from 'src/app/services/layout.service';
import { DomainManagementTabService } from 'src/app/services/tab-services/domain-management-tabs.service';
import { WebsiteService } from 'src/app/services/website.service';

@Component({
  selector: 'dmReviewTab',
  templateUrl: './domain-management-review.component.html',
})
export class DomainManagementReviewTab implements OnInit {
  constructor(
    public applicationSvc : ApplicationService,
    public categorySvc: CategoryService,
    public domainTabSvc: DomainManagementTabService,
    public layoutSvc: LayoutService,
    public websiteSvc: WebsiteService,
    ) {}

  ngOnInit(): void {
  }

  submitDomain(){
    console.log("submitting")
  }

  booleanToDisplay(val){
    if(val){
      return 'Yes'
    } else {
      return 'No'
    }
  }

  get genFrmCnt(){
    return this.domainTabSvc.gen_attribute_tab_form.controls
  }
  get webFrmCnt(){
    return this.domainTabSvc.website_selection_tab_form.controls
  }
  get pxyFrmCnt(){
    return this.domainTabSvc.proxy_categoriztion_tab_form.controls
  }
  get rvwFrmCnt(){
    return this.domainTabSvc.review_tab_form.controls
  }

}
