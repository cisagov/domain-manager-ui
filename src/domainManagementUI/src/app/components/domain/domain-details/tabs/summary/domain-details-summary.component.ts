// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { ApplicationService } from 'src/app/services/applications.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';
import { DomainService } from 'src/app/services/domain.service';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { ApplicationModel } from 'src/app/models/application.model';
import { DomainModel } from 'src/app/models/domain.model';

@Component({
  selector: 'dd-summary',
  templateUrl: './domain-details-summary.component.html',
  styleUrls: ['./domain-details-summary.component.scss'],
})
export class DomainDetailsSummaryComponent implements OnInit, OnDestroy {
  application_list = [];
  application_details: ApplicationModel;
  component_subscriptions = [];
  domainData: DomainModel;
  deleteDialog: MatDialogRef<ConfirmDialogComponent> = null;
  pocForm: FormGroup;
  assessmentIdForm: FormGroup;
  public userIsAdmin: boolean = null;
  private domainDataExists = false;

  constructor(
    public alertsSvc: AlertsService,
    public applicationSvc: ApplicationService,
    public dialog: MatDialog,
    private router: Router,
    private userAuthSvc: UserAuthService,
    private formBuilder: FormBuilder,
    public ddTabSvc: DomainDetailsTabService,
    public domainSvc: DomainService
  ) {}

  async initializeData() {
    this.userIsAdmin = this.userAuthSvc.userIsAdmin();
    await this.ddTabSvc.getDomainDataBehaviorSubject().subscribe((data) => {
      this.domainData = data;
      this.domainDataExists = true;
      this.getApplicationsData();
      this.pocForm = this.formBuilder.group({
        _id: [this.domainData._id],
        contact_name: [this.domainData.contact_name],
        contact_email: [this.domainData.contact_email],
        contact_phone: [this.domainData.contact_phone],
      });
      this.pocForm.valueChanges
        .pipe(
          debounceTime(2000),
          switchMap((value) => of(value))
        )
        .subscribe((value: any) => {
          value = this.cleanObject(value);
          this.domainSvc.updateDomain(value).subscribe({
            next: () => {
              this.alertsSvc.alert('Point of Contact has been updated');
            },
            error: () => {
              this.alertsSvc.alert('Point of Contact failed to update');
            },
          });
        });
      this.assessmentIdForm = this.formBuilder.group({
        _id: [this.domainData._id],
        assessment_id: [this.domainData.assessment_id],
      });
      this.assessmentIdForm.valueChanges
        .pipe(
          debounceTime(1500),
          switchMap((value) => of(value))
        )
        .subscribe((value: any) => {
          value = this.cleanObject(value);
          this.domainSvc.updateDomain(value).subscribe({
            next: () => {
              this.alertsSvc.alert('Assessment ID has been updated');
            },
            error: () => {
              this.alertsSvc.alert('Assessment ID failed to update');
            },
          });
        });
    });
  }

  async ngOnInit() {
    await this.initializeData();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getApplicationsData() {
    if (this.userIsAdmin && this.domainDataExists) {
      this.applicationSvc.getAllApplications().subscribe(
        (success) => {
          this.application_list = success as [];
          if (this.ddTabSvc.domain_data.application_id) {
            this.application_details = this.application_list.find(
              (app) => app._id === this.ddTabSvc.domain_data.application_id
            ) as ApplicationModel;
          }
        },
        (failure) => {
          this.alertsSvc.alert(failure);
        }
      );
    }
  }

  changeApplication(application_id) {
    this.ddTabSvc.domain_data.application_id = application_id;
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
        this.ddTabSvc.deleteDomain(this.ddTabSvc.domain_data._id).subscribe({
          next: (success) => {
            this.alertsSvc.alert('Domain Deleted.');
            this.router.navigate(['/domains']);
          },
          error: (failure) => {
            this.alertsSvc.alert(
              'Failed to delete domain. Deleting domains that are active or have redirects is not allowed.'
            );
            console.log(failure);
          },
          complete: () => {
            this.deleteDialog.close();
          },
        });
      } else {
        console.log('delete canceled');
      }
    });
  }
  get tabForm() {
    return this.ddTabSvc.summary_form;
  }

  private cleanObject(obj: object) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }
}
