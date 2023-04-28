//Angular Imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

//Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { LayoutService } from 'src/app/services/layout.service';
import { DomainService } from 'src/app/services/domain.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

//Models
import { FileUploadSettings } from 'src/app/models/fileUploadSettings.model';
import { DomainModel } from 'src/app/models/domain.model';

// Dialogs
import { FileUploadDialogComponent } from 'src/app/components/dialog-windows/file-upload/file-upload-dialog.component';
import { DomainCreateDialogComponent } from 'src/app/components/domain/domain-create-dialog/domain-create-dialog.component';
import { ApplicationService } from 'src/app/services/applications.service';

@Component({
  selector: 'domain-list',
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.scss'],
})
export class DomainListComponent implements OnInit {
  component_subscriptions = [];
  create_dialog: MatDialogRef<DomainCreateDialogComponent> = null;
  displayedColumns = [
    'name',
    'application_name_lower_case',
    'template_base_name_lower_case',
    'registrar',
    'expiration_date',
    'is_approved',
    'is_launched',
  ];
  search_input = '';
  domainList: MatTableDataSource<DomainModel> =
    new MatTableDataSource<DomainModel>();
  loading = true;

  userIsAdmin: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    public layoutSvc: LayoutService,
    private router: Router,
    private userAuthSvc: UserAuthService,
    public domainSvc: DomainService,
    public applicationSvc: ApplicationService,
  ) {
    this.layoutSvc.setTitle('Domains');
    this.userIsAdmin = this.userAuthSvc.userIsAdmin();
  }

  ngOnInit(): void {
    this.getDomains();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  async getDomains() {
    this.loading = true;

    try {
      const domains = await this.domainSvc.getDomains();
      const applications = await this.applicationSvc.getApplications();
      domains.forEach((domain) => {
        const application = applications.filter(
          (x) => x._id === domain.application_id,
        );
        if (application.length === 1) {
          domain.application_name = application[0].name;
        }

        let nameLowerCase = domain['name'] ? (domain['name'] as string) : '';
        let applicationLowerCase = domain['application_name']
          ? (domain['application_name'] as string)
          : '';
        let templateLowerCase = domain['template_name']
          ? (domain['template_name'] as string)
          : '';
        domain['nameLowerCase'] = nameLowerCase.toLowerCase();
        domain['application_name_lower_case'] =
          applicationLowerCase.toLowerCase();
        domain['template_base_name_lower_case'] =
          templateLowerCase.toLowerCase();
      });

      this.domainList = new MatTableDataSource<DomainModel>(domains);
      this.loading = false;
      this.sortingDataAccessor(this.domainList);
      this.domainList.sort = this.sort;
    } catch (error) {
      console.log('Error getting domain list');
      console.log(error);
      this.loading = false;
      this.alertsSvc.alert('Failed to get domain list');
    }
  }

  viewDomain(_id) {
    this.router.navigate([`/domain/details/${_id}`]);
  }

  uploadDomain() {
    let fileUploadSettings = new FileUploadSettings();
    fileUploadSettings.uploadType = 'domain';
    fileUploadSettings.uploadFileType = 'application/x-zip-compressed';
    fileUploadSettings.uploadService = this.domainSvc;

    this.dialog.open(FileUploadDialogComponent, {
      data: fileUploadSettings,
    });
  }

  // Used by mat table for filtering with the search bar
  public filterList = (value: string) => {
    this.domainList.filter = value.trim().toLocaleLowerCase();
  };

  addDomain() {
    this.create_dialog = this.dialog.open(DomainCreateDialogComponent);
    this.create_dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.getDomains();
      }
    });
  }

  private sortingDataAccessor(callBack: any) {
    callBack.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'expiration_date':
          return new Date(item.whois.expiration_date);
        case 'registrar':
          return item.whois.registrar;
        default:
          return item[property];
      }
    };
  }
}
