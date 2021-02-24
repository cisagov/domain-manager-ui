// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { ApplicationService } from 'src/app/services/applications.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';
import { DomainService } from 'src/app/services/domain.service';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { DomainModel } from 'src/app/models/domain.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';

@Component({
  selector: 'dd-summary',
  templateUrl: './domain-details-summary.component.html',
  styleUrls: ['./domain-details-summary.component.scss'],
})
export class DomainDetailsSummaryComponent implements OnInit, OnDestroy {
  application_list = [];
  component_subscriptions = [];
  deleteDialog: MatDialogRef<ConfirmDialogComponent> = null;
  public userIsAdmin: boolean = null;
  private domainDataExists = false;

  constructor(
    public alertsSvc: AlertsService,
    public applicationSvc: ApplicationService,
    public dialog: MatDialog,
    private router: Router,
    private userAuthSvc: UserAuthService,
    public ddTabSvc: DomainDetailsTabService,
    public domainSvc: DomainService
  ) {}
  ngOnInit(): void {
    this.userIsAdmin = this.userAuthSvc.userIsAdmin();
    this.ddTabSvc.getDomainDataBehaviorSubject().subscribe((data) => {
      if (data._id) {
        this.domainDataExists = true;
        this.getApplicationData();
      }
    });
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
  getApplicationData() {
    if (this.userIsAdmin && this.domainDataExists) {
      this.applicationSvc.getAllApplications().subscribe(
        (success) => {
          this.application_list = success as [];
        },
        (failure) => {
          this.alertsSvc.alert(failure);
        }
      );
    }
  }

  // getApplicationName() {
  //   if (
  //     this.ddTabSvc.domain_data.application_id &&
  //     this.applicationSvc.application_list.length
  //   ) {
  //     return this.applicationSvc.getApplicationNameByUUID(
  //       this.ddTabSvc.domain_data.application_id
  //     );
  //   } else {
  //     return 'Loading Application List';
  //   }
  // }

  changeApplication(application_id) {
    this.ddTabSvc.domain_data.application_id = application_id;
    console.log(this.ddTabSvc.domain_data);
    this.ddTabSvc.updateDomain().subscribe(
      (success) => {
        this.alertsSvc.alert('Domain Application Updated');
        this.ddTabSvc.getDomainDetails(this.ddTabSvc.domain_data._id);
      },
      (failure) => {
        this.alertsSvc.alert('Domain Application Update failed');
      }
    );
  }

  downloadDomain() {
    this.ddTabSvc.downloadDomain().subscribe(
      (success) => {
        this.alertsSvc.alert('Domain downloaded');
      },
      (failure) => {
        this.alertsSvc.alert(failure);
      }
    );
  }

  deleteDomain() {
    let confirmDialogSettings = new ConfirmDialogSettings();
    confirmDialogSettings.itemConfirming = 'confirm template delete';
    confirmDialogSettings.actionConfirming = `Are you sure you want to delete ${this.ddTabSvc.domain_data.name}`;

    this.deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: confirmDialogSettings,
    });
    this.deleteDialog.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.ddTabSvc.deleteDomain(this.ddTabSvc.domain_data._id).subscribe(
          (success) => {
            this.router.navigate([`/domain`]);
          },
          (failed) => {
            this.alertsSvc.alert('Failed to Delete Domain');
          }
        );
      } else {
        console.log('delete canceled');
      }
    });
  }
  get tabForm() {
    return this.ddTabSvc.summary_form;
  }
}
