// Angular Imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoryService } from 'src/app/services/category.service';
import { ConfirmCategoryDialogComponent } from 'src/app/components/dialog-windows/confirm-categorize/confirm-categorize-dialog.component';
import { LayoutService } from 'src/app/services/layout.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';
import { CategoryResult } from 'src/app/models/domain.model';

@Component({
  selector: 'dd-proxy-categorizaiton',
  templateUrl: './domain-details-proxy-categorization.component.html',
})
export class DomainDetailsProxyCategorizaitonComponent implements OnInit {
  categoryData = [];
  displayedColumns = ['proxy', 'category', 'created', 'status', 'recategorize'];
  categoryList: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public alertsSvc: AlertsService,
    public categorySvc: CategoryService,
    public dialog: MatDialog,
    public layoutSvc: LayoutService,
    public ddTabSvc: DomainDetailsTabService
  ) {}

  ngOnInit(): void {
    this.checkCategory();
  }

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
            'Categorization request has been successfully submitted.',
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

  checkCategory() {
    this.ddTabSvc.checkCategories().subscribe(
      (success) => {
        if (Array.isArray(success)) {
          this.categoryData = success as Array<any>;
          this.categoryList = new MatTableDataSource<any>(success);
          this.categoryList.sort = this.sort;
        } else {
          this.alertsSvc.alert('Domain does not have categorizations');
        }
      },
      (failure) => {
        console.log(failure);
      }
    );
  }

  recategorize(categorization_id, categorize_url) {
    const dialogSettings = {
      categoryList: this.categories,
    };
    const dialogRef = this.dialog.open(ConfirmCategoryDialogComponent, {
      data: dialogSettings,
    });
    const status = 'submitted';
    dialogRef.afterClosed().subscribe((result) => {
      if (result.closedStatus === 'confirmed') {
        this.ddTabSvc
          .updateCategory(categorization_id, {
            category: result.selectedCategory,
            status: status,
          })
          .subscribe(
            (success) => {
              this.alertsSvc.alert('Category has been updated.');
              const proxy = this.categoryList.data.findIndex(
                (obj) => obj._id === categorization_id
              );
              this.categoryList.data[proxy].category = result.selectedCategory;
              this.categoryList.data[proxy].status = status;
              this.categoryList.data[proxy].updated = new Date();
            },
            (failure) => {
              this.alertsSvc.alert('Error updating category.');
            }
          );
      }
    });
    window.open(categorize_url, '_blank');
  }

  test() {
    console.log(this.f.category_two);
  }
}
