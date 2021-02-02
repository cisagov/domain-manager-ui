// Angular Imports
import { Component, OnInit } from '@angular/core';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoryService } from 'src/app/services/category.service';
import { LayoutService } from 'src/app/services/layout.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';

@Component({
  selector: 'dd-proxy-categorizaiton',
  templateUrl: './domain-details-proxy-categorization.component.html',
})
export class DomainDetailsProxyCategorizaitonComponent implements OnInit {
  constructor(
    public alertsSvc: AlertsService,
    public categorySvc: CategoryService,
    public layoutSvc: LayoutService,
    public ddTabSvc: DomainDetailsTabService
  ) {}

  ngOnInit(): void {}

  get tabForm() {
    return this.ddTabSvc.proxy_categoriztion_tab_form;
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
    this.ddTabSvc.submitTab(this.tabForm);
  }

  //Only pushing one category at this time, original plan was for three,
  //existing code for three will remain but not be used untill needed.
  submitCategory() {
    if (this.ddTabSvc.proxy_categoriztion_tab_form.valid) {
      this.ddTabSvc.submitCategory().subscribe(
        (success) => {
          this.ddTabSvc.domain_data.is_category_submitted = true;
          this.alertsSvc.alert(
            'Category successfully submitted for review.',
            undefined,
            10000
          );
        },
        (failure) => {
          console.log(failure);
          this.alertsSvc.alert('Error submitting category for domain');
        }
      );
    }
  }

  test() {
    console.log(this.f.category_two);
  }
}
