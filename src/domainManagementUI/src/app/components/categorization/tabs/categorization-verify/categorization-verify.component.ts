// Angular Imports
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { LayoutService } from 'src/app/services/layout.service';
import { CategorizationTabService } from 'src/app/services/tab-services/categorization-tabs.service';
import { VerifyCategoryDialogComponent } from 'src/app/components/dialog-windows/verify-category/verify-category-dialog.component';

@Component({
  selector: 'app-categorization-verify',
  templateUrl: './categorization-verify.component.html',
  styleUrls: ['./categorization-verify.component.scss'],
})
export class CategorizationVerifyComponent {
  categoryData = [];
  displayedColumns = [
    'domain',
    'proxy',
    'status',
    'category',
    'created',
    'verify',
  ];
  categoryList: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public alertsSvc: AlertsService,
    public layoutSvc: LayoutService,
    public dialog: MatDialog,
    public categorizationTabSvc: CategorizationTabService
  ) {
    this.layoutSvc.setTitle('Categorizations');
  }

  ngOnInit(): void {
    this.getVerifyDomainProxies();
  }

  getVerifyDomainProxies() {
    this.categorizationTabSvc.getCategorizations('submitted').subscribe(
      (success) => {
        if (Array.isArray(success)) {
          this.categoryData = success as Array<any>;
          this.categoryList = new MatTableDataSource<any>(success);
          this.categoryList.sort = this.sort;
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

  verify(categorization_id, check_url) {
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
          })
          .subscribe(
            (success) => {
              this.alertsSvc.alert('Proxy status has been updated.');
              const proxy = this.categoryList.data.findIndex(
                (obj) => obj._id === categorization_id
              );
              this.categoryList.data.splice(proxy, 1);
              this.categoryList.data = this.categoryList.data;
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
