// Angular Imports
import { Component, OnInit } from '@angular/core';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoryService } from 'src/app/services/category.service';
import { DomainManagementTabService } from 'src/app/services/tab-services/domain-management-tabs.service';
import { LayoutService } from 'src/app/services/layout.service';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';

@Component({
  selector: 'wd-proxy-categorizaiton',
  templateUrl: './website-details-proxy-categorization.component.html',
})
export class WebsiteDetailsProxyCategorizaitonComponent implements OnInit {
  constructor(
    public alertsSvc: AlertsService,
    public categorySvc: CategoryService,
    public domainTabSvc: DomainManagementTabService,
    public layoutSvc: LayoutService,
    public wdTabSvc: WebsiteDetailsTabService
  ) {}

  ngOnInit(): void {}

  get tabForm() {
    return this.wdTabSvc.proxy_categoriztion_tab_form;
  }

  get f() {
    return this.tabForm.controls;
  }

  get categories() {
    return this.categorySvc.category_list;
  }

  filterCategories(data, target_category) {
    //TODO, improve on this mediocre function
    let filterArray = [];
    if (target_category != 'cat_one') {
      filterArray.push(this.f.category_one.value);
    }
    if (target_category != 'cat_two') {
      filterArray.push(this.f.category_two.value);
    }
    if (target_category != 'cat_three') {
      filterArray.push(this.f.category_three.value);
    }
    let retVal = this.categories.filter((t) => !filterArray.includes(t._id));
    return retVal;
  }

  isEmptySelection(data) {
    return data.value != '' && data.value != null;
  }

  nextTab() {
    this.domainTabSvc.submitTab(this.tabForm);
  }

  //Only pushing one category at this time, original plan was for three,
  //existing code for three will remain but not be used untill needed.
  submitCategory() {
    if (this.wdTabSvc.proxy_categoriztion_tab_form.valid) {
      this.wdTabSvc.submitCategory().subscribe(
        (success) => {
          this.wdTabSvc.website_data.is_category_submitted = true;
          this.alertsSvc.alert(
            'Category successfully submitted for review.',
            undefined,
            10000
          );
        },
        (failure) => {
          console.log(failure);
          this.alertsSvc.alert('Error submitting category for website');
        }
      );
    }
  }

  test() {
    console.log(this.f.category_two);
  }
}
