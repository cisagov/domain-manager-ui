// Angular Imports
import { Component, OnInit } from '@angular/core';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoryService } from 'src/app/services/category.service';
import { LayoutService } from 'src/app/services/layout.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';
import { CategoryResult } from 'src/app/models/domain.model';

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

  get categorizedTable() {
    if (!this.ddTabSvc.domain_data.category_results) {
      return null;
    }
    const categorizedTable = [];
    this.ddTabSvc.domain_data.category_results.forEach((result) => {
      if (result.categorize_url) {
        categorizedTable.push(result);
      }
    });
    return categorizedTable;
  }

  get checkedTable() {
    if (!this.ddTabSvc.domain_data.category_results) {
      return null;
    }
    const checkedTable = [];
    this.ddTabSvc.domain_data.category_results.forEach((result) => {
      if (result.check_url && result.check_url !== '') {
        checkedTable.push(result);
      }
    });
    return checkedTable;
  }

  get tabForm() {
    return this.ddTabSvc.proxy_categoriztion_tab_form;
  }

  get f() {
    return this.tabForm.controls;
  }

  get categories() {
    return Object.keys(this.categorySvc.categories);
  }

  // Only pushing one category at this time, original plan was for three,
  // existing code for three will remain but not be used untill needed.
  submitCategory() {
    if (this.ddTabSvc.proxy_categoriztion_tab_form.valid) {
      this.ddTabSvc.submitCategory().subscribe(
        (success) => {
          this.ddTabSvc.domain_data.submitted_category = this.ddTabSvc.proxy_categoriztion_tab_form.controls.category_one.value;
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

  manuallyCategorize(result: CategoryResult) {
    window.open(result.categorize_url, '_blank');
    this.ddTabSvc.manuallyCategorize(result.proxy).subscribe(
      (success) => {
        this.alertsSvc.alert('Domain has been set as manually categorized');
        result.manually_submitted = true;
        result.is_submitted = true;
      },
      (failure) => {
        console.log(failure);
        this.alertsSvc.alert('Error setting as manually categorized');
      }
    );
  }

  manuallyCheck(result: CategoryResult) {
    window.open(result.check_url, '_blank');
  }

  checkCategory() {
    this.ddTabSvc.checkCategory().subscribe(
      (success) => {
        this.alertsSvc.alert(
          'Category is being checked at all proxies. Return later for status'
        );
      },
      (failure) => {
        console.log(failure);
        this.alertsSvc.alert('Error checking for category');
      }
    );
  }

  test() {
    console.log(this.f.category_two);
  }
}
