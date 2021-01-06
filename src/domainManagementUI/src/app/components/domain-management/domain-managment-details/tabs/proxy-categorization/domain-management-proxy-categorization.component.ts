// Angular Imports
import { Component, OnInit } from '@angular/core';

// Local Service Imports
import { CategoryService } from 'src/app/services/category.service'
import { DomainManagementTabService } from 'src/app/services/tab-services/domain-management-tabs.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'dmProxyCategorizaitonTab',
  templateUrl: './domain-management-proxy-categorization.component.html',
})
export class DomainManagementProxyCategorizaitonTab implements OnInit {
  constructor(
    public categorySvc: CategoryService,
    public domainTabSvc: DomainManagementTabService,
    public layoutSvc: LayoutService
    ) {}

  ngOnInit(): void {
  }

  get tabForm(){
    return this.domainTabSvc.proxy_categoriztion_tab_form;
  }

  get f(){
    return this.tabForm.controls
  }

  get categories(){
    return this.categorySvc.category_list
  }

  filterCategories(data,target_category){
    //TODO, improve on this mediocre function
    let filterArray = []
    if(target_category != 'cat_one') {
      filterArray.push(this.f.category_one.value)
    } 
    if (target_category != 'cat_two'){
      filterArray.push(this.f.category_two.value)
    }
    if (target_category != 'cat_three'){
      filterArray.push(this.f.category_three.value)
    }
    let retVal = this.categories.filter(t => !filterArray.includes(t.categoryUUID))
    return retVal
  }

  isEmptySelection(data){
    return (data.value != '' && data.value != null) 
  }

  nextTab(){
    this.domainTabSvc.submitTab(this.tabForm)
  }

  test(){
    console.log(this.f.category_two)
  }

}
