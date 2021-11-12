// Angular Imports
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoryService } from 'src/app/services/category.service';
import { ConfirmCategoryDialogComponent } from 'src/app/components/dialog-windows/confirm-categorize/confirm-categorize-dialog.component';
import { CategorizationTabService } from 'src/app/services/tab-services/categorization-tabs.service';
import { CategorizationRejectDialogComponent } from '../../categorization-reject-dialog/categorization-reject-dialog.component';
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';

@Component({
  selector: 'app-categorization-submit',
  templateUrl: './categorization-submit.component.html',
  styleUrls: ['./categorization-submit.component.scss'],
})
export class CategorizationSubmitComponent {
  categoryData = [];
  domainData = [];
  displayedColumns = ['proxy', 'status', 'category', 'updated', 'categorize'];
  categoryList: MatTableDataSource<any> = new MatTableDataSource<any>();
  proxyData: MatTableDataSource<any> = new MatTableDataSource<any>();
  domainDetails = {};

  constructor(
    public alertsSvc: AlertsService,
    public categorySvc: CategoryService,
    public dialog: MatDialog,
    public categorizationTabSvc: CategorizationTabService
  ) {}

  ngOnInit(): void {
    this.getSubmitDomainProxies();
  }

  get categories() {
    return Object.keys(this.categorySvc.categories);
  }
  getSubmitDomainProxies() {
    this.categorizationTabSvc.getCategorizations('new,recategorize').subscribe(
      (success) => {
        if (Array.isArray(success)) {
          this.categoryData = success as Array<any>;
          let uniqueVals = [
            ...new Set(this.categoryData.map((item) => item.domain_id)),
          ];
          uniqueVals.forEach((val) => {
            this.categorizationTabSvc.domainDetails(val).subscribe(
              (success: any) => {
                this.domainDetails = success as Object;
                this.categoryData
                  .filter((x) => x.domain_id == val)
                  .forEach((cd) => {
                    let found = this.domainData.some(
                      (el) => el.domain_name === cd.domain_name
                    );
                    this.proxyData = new MatTableDataSource<any>(
                      this.categoryData.filter(
                        (x) => x.domain_name == cd.domain_name
                      )
                    );

                    if (!found) {
                      this.domainData.push({
                        domain_name: cd.domain_name,
                        domain_id: cd.domain_id,
                        email_active: success.is_email_active,
                        is_active: success.is_active,
                        categories: this.proxyData,
                      });
                    }
                  });
              },
              (failure) => {
                console.log(failure);
                return;
              }
            );
          });
        } else {
          this.alertsSvc.alert('No domains for proxy submission.');
        }
      },
      (failure) => {
        console.log(failure);
      }
    );
  }

  canEmail(domainId) {
    this.categorizationTabSvc.domainDetails(domainId).subscribe(
      (success) => {
        this.domainDetails = success as Object;
      },
      (failure) => {
        console.log(failure);
        return;
      }
    );
  }

  canReject(categories) {
    return categories.length === 8;
  }

  categorize(categorization_id, categorize_url, preferred_category, domain_id) {
    const dialogSettings = {
      categoryList: this.categories,
      preferredCategory: preferred_category,
    };
    const dialogRef = this.dialog.open(ConfirmCategoryDialogComponent, {
      data: dialogSettings,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.closedStatus === 'confirmed') {
        this.categorizationTabSvc
          .updateCategory(categorization_id, {
            category: result.selectedCategory,
            domain_id: domain_id,
            status: 'submitted',
          })
          .subscribe(
            (success) => {
              this.alertsSvc.alert('Category has been updated.');
              const proxy = this.categoryList.data.findIndex(
                (obj) => obj._id === categorization_id
              );
              this.categoryList.data.splice(proxy, 1);
              this.categoryList.data = this.categoryList.data;
              let domainIndex = this.domainData.findIndex(
                (domain) => domain.domain_id === domain_id
              );
              this.domainData[domainIndex].categories.data = this.domainData[
                domainIndex
              ].categories.data.filter(
                (category) => category._id !== categorization_id
              );
            },
            (failure) => {
              this.alertsSvc.alert('Error updating category.');
            }
          );
      }
    });
    window.open(categorize_url, '_blank');
  }

  reject(domain_id) {
    const dialogRef = this.dialog.open(CategorizationRejectDialogComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      this.categorizationTabSvc
        .deleteProxies(domain_id, { message: result })
        .subscribe(
          (success) => {
            this.alertsSvc.alert(
              'Proxy requests for this domain have been deleted.'
            );
            const proxies = this.domainData.findIndex(
              (obj) => obj.domain_id === domain_id
            );
            this.domainData.splice(proxies, 1);
            this.domainData = this.domainData;
          },
          (failure) => {
            console.log(failure);
            this.alertsSvc.alert(`${failure.error.error}`);
          }
        );
    });
  }

  toggleEmail(domain_id) {
    const dialogSettings = new ConfirmDialogSettings();
    dialogSettings.itemConfirming = 'Enable Email Receiving';
    dialogSettings.actionConfirming = `Are you sure you want to receive emails to this domain`;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogSettings,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.categorizationTabSvc.enableEmailReceiving(domain_id).subscribe(
          (success) => {
            this.alertsSvc.alert(
              'Email receiving for this domain has been enabled.'
            );
          },
          (failure) => {
            console.log(failure);
            this.alertsSvc.alert(`${failure.error.error}`);
          }
        );
      } else {
        dialogRef.close();
      }
    });
  }
}
