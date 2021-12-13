import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoryService } from 'src/app/services/category.service';
import { LayoutService } from 'src/app/services/layout.service';
import { CategorizationTabService } from 'src/app/services/tab-services/categorization-tabs.service';
import { VerifyCategoryDialogComponent } from '../dialog-windows/verify-category/verify-category-dialog.component';
@Component({
  selector: 'app-categorization',
  templateUrl: './categorization.component.html',
  styleUrls: ['./categorization.component.scss'],
})
export class CategorizationComponent {
  verifyCategoryData = [];
  verifyDisplayedColumns = [
    'domain_name',
    'proxy',
    'category',
    'created',
    'verify',
  ];
  verifyCategoryList: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public alertsSvc: AlertsService,
    public categorySvc: CategoryService,
    public dialog: MatDialog,
    public layoutSvc: LayoutService,
    public categorizationTabSvc: CategorizationTabService
  ) {
    this.layoutSvc.setTitle('Categorization');
  }

  ngOnInit(): void {
    this.getVerifyDomainProxies();
  }

  getVerifyDomainProxies() {
    this.categorizationTabSvc.getCategorizations('submitted').subscribe(
      (success) => {
        if (Array.isArray(success)) {
          this.verifyCategoryData = success as Array<any>;
          this.verifyCategoryList = new MatTableDataSource<any>(success);
          this.verifyCategoryList.sort = this.sort;
        } else {
          this.alertsSvc.alert('No domains for proxy verification.');
        }
      },
      (failure) => {
        console.log(failure);
      }
    );
  }

  get statuses() {
    return ['verified', 'burned'];
  }

  verify(categorization_id, check_url, domain_id) {
    const dialogSettings = {
      statusList: this.statuses,
    };
    const dialogRef = this.dialog.open(VerifyCategoryDialogComponent, {
      data: dialogSettings,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.closedStatus === 'confirmed') {
        this.categorizationTabSvc
          .updateCategory(categorization_id, {
            status: result.selectedStatus,
            domain_id: domain_id,
          })
          .subscribe(
            (success) => {
              this.alertsSvc.alert('Proxy status has been updated.');
              const proxy = this.verifyCategoryList.data.findIndex(
                (obj) => obj._id === categorization_id
              );
              this.verifyCategoryList.data.splice(proxy, 1);
              this.verifyCategoryList.data = this.verifyCategoryList.data;
            },
            (failure) => {
              this.alertsSvc.alert('Error updating proxy status.');
            }
          );
      }
    });
    window.open(check_url, '_blank');
  }
}
