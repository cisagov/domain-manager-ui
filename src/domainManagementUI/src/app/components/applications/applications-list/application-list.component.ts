// Angular Imports
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { ApplicationService } from 'src/app/services/applications.service';
import { LayoutService } from 'src/app/services/layout.service';

// Models
import { ApplicationModel } from 'src/app/models/application.model';

// Dialogs
import { ApplicationEditDialogComponent } from '../application-edit-dialog/application-edit-dialog.component';
import { ConfirmDialogComponent } from '../../dialog-windows/confirm/confirm-dialog.component';
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss'],
})
export class ApplicationListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  componentSubscriptions = [];
  displayedColumns = ['application_name', 'domains_used_count', 'select'];
  applicationList = new MatTableDataSource<ApplicationModel>();
  loading = true;
  searchInput = '';
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public alertsSvc: AlertsService,
    public applicationSvc: ApplicationService,
    public dialog: MatDialog,
    public layoutSvc: LayoutService
  ) {
    this.layoutSvc.setTitle('Applications');
  }

  ngOnInit(): void {
    this.getApplications();
  }

  ngOnDestroy(): void {
    this.componentSubscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit(): void {}

  getApplications() {
    this.loading = true;
    const data = [];
    this.applicationSvc.getAllApplications().subscribe(
      (applications: ApplicationModel[]) => {
        applications.forEach((app: ApplicationModel) => {
          // Get Domains used count
          this.applicationSvc
            .getDomainsByApplication(app._id)
            .subscribe((websites: any[]) => {
              app.domains_used_count = Number(websites.length);
              data.push(app);
              this.applicationList.data = data;
            });
        });
        this.loading = false;
        this.applicationList.sort = this.sort;
      },
      (error) => {
        this.alertsSvc.alert(error)
        this.loading = false;
      }
    );
  }

  editApplication(application: ApplicationModel) {
    const dialogRef = this.dialog.open(ApplicationEditDialogComponent, {
      data: application,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getApplications();
      }
    });
  }

  deleteApplication(application: ApplicationModel) {
    const dialogSettings = new ConfirmDialogSettings();
    dialogSettings.itemConfirming = 'Confirm Application Delete';
    dialogSettings.actionConfirming = `Are you sure you want to delete ${application.name}`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogSettings,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.applicationSvc.deleteApplication(application._id).subscribe(
          (success) => {
            this.getApplications();
          },
          (failure) => {
            this.alertsSvc.alert(failure)
          }
        );
      } else {
        dialogRef.close();
      }
    });
  }

  addApplication() {
    const dialogRef = this.dialog.open(ApplicationEditDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getApplications();
      }
    });
  }

  public filterList = (value: string) => {
    this.applicationList.filter = value.trim().toLocaleLowerCase();
  };
}
