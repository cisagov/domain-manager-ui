// Angular Imports
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

// Local Service Imports
import { ConfirmCategoryDialogComponent } from 'src/app/components/dialog-windows/confirm-categorize/confirm-categorize-dialog.component';
import { CategorizationRejectDialogComponent } from '../../categorization-reject-dialog/categorization-reject-dialog.component';
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { CategorizationComponent } from '../../categorization.component';

@Component({
  selector: 'app-categorization-submit',
  templateUrl: './categorization-submit.component.html',
  styleUrls: ['./categorization-submit.component.scss'],
})
export class CategorizationSubmitComponent extends CategorizationComponent {
  submitCategoryData = [];
  domainData = [];
  submitDisplayedColumns = [
    'proxy',
    'status',
    'category',
    'updated',
    'categorize',
  ];
  submitCategoryList: MatTableDataSource<any> = new MatTableDataSource<any>();
  proxyData: MatTableDataSource<any> = new MatTableDataSource<any>();
  domainDetails = {};

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
          this.submitCategoryData = success as Array<any>;
          let uniqueVals = [
            ...new Set(
              this.submitCategoryData.map((item) => ({
                _id: item.domain_id,
                is_external: item.is_external,
              }))
            ),
          ];
          uniqueVals.forEach((val) => {
            if (val.is_external) {
              this.categorizationTabSvc
                .externalDomainDetails(val._id)
                .subscribe(
                  (success: any) => {
                    this.domainDetails = success as Object;
                    this.submitCategoryData
                      .filter((x) => x.domain_id == val._id)
                      .forEach((cd) => {
                        let found = this.domainData.some(
                          (el) => el.domain_name === cd.domain_name
                        );
                        this.proxyData = new MatTableDataSource<any>(
                          this.submitCategoryData.filter(
                            (x) => x.domain_name == cd.domain_name
                          )
                        );

                        if (!found) {
                          this.domainData.push({
                            domain_name: cd.domain_name,
                            domain_id: cd.domain_id,
                            email_active: true,
                            is_external: cd.is_external,
                            proxy_email: success.proxy_email,
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
            } else {
              this.categorizationTabSvc.domainDetails(val._id).subscribe(
                (success: any) => {
                  this.domainDetails = success as Object;
                  this.submitCategoryData
                    .filter((x) => x.domain_id == val._id)
                    .forEach((cd) => {
                      let found = this.domainData.some(
                        (el) => el.domain_name === cd.domain_name
                      );
                      this.proxyData = new MatTableDataSource<any>(
                        this.submitCategoryData.filter(
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
            }
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

  categorize(categorization_id, categorize_url, preferred_category, domain_id) {
    const dialogSettings = {
      submitCategoryList: this.categories,
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
              const proxy = this.submitCategoryList.data.findIndex(
                (obj) => obj._id === categorization_id
              );
              this.submitCategoryList.data.splice(proxy, 1);
              this.submitCategoryList.data = this.submitCategoryList.data;
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

  reject(domain_id, is_external) {
    const dialogRef = this.dialog.open(CategorizationRejectDialogComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (!is_external) {
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
      } else {
        this.categorizationTabSvc
          .deleteExternalProxies(domain_id, { message: result })
          .subscribe(
            (success) => {
              this.alertsSvc.alert(
                'Proxy requests for this external domain have been deleted.'
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
      }
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
