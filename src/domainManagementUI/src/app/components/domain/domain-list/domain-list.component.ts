//Angular Imports
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
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

@Component({
  selector: 'domain-list',
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.scss'],
})
export class DomainListComponent implements OnInit {
  allChecked = false;
  component_subscriptions = [];
  create_dialog: MatDialogRef<DomainCreateDialogComponent> = null;
  displayedColumns = [
    'name',
    'template_base_name',
    'created_date',
    'is_launched',
  ];
  search_input = '';
  domainList: MatTableDataSource<DomainModel> = new MatTableDataSource<DomainModel>();
  loading = true;

  userIsAdmin: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    public layoutSvc: LayoutService,
    private router: Router,
    private userAuthSvc: UserAuthService,
    public domainSvc: DomainService
  ) {
    this.layoutSvc.setTitle('Domains');
    this.userIsAdmin = this.userAuthSvc.userIsAdmin();
  }

  ngOnInit(): void {
    this.getDomains();
    this._setAdminView();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    this.domainList.sort = this.sort;
  }

  getDomains() {
    this.loading = true;
    this.domainSvc.getAllDomains().subscribe(
      (success) => {
        this._formatDomainListData(success);
        this.domainList = new MatTableDataSource<DomainModel>(
          success as DomainModel[]
        );
        this.loading = false;
        this.domainList.sort = this.sort;
      },
      (error) => {
        console.log('Error getting domain list');
        console.log(error);
        this.loading = false;
        this.alertsSvc.alert('Failed to get domain list');
      }
    );
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

  _formatDomainListData(data) {
    if (this.userIsAdmin && data instanceof Array) {
      data.forEach((domainItem) => {
        domainItem['isChecked'] = false;
      });
    }
    return data;
  }

  _setAdminView() {
    console.log(this.userIsAdmin);
    if (this.userIsAdmin) {
      this.displayedColumns.unshift('checked');
      this.displayedColumns.push('isAvailable');
    }
  }

  updateAllCheckboxComplete() {
    let data = this.domainList['_data']['_value'];
    this.allChecked = data != null && data.every((t) => t.isChecked);
  }
  setAllCheckboxes(checked: boolean) {
    console.log(checked);
    let data = this.domainList['_data']['_value'];
    if (data == null || data == undefined) {
      return false;
    }
    this.allChecked = checked;
    data.forEach((t) => (t.isChecked = checked));
    console.log('updateAll');
  }
  someChecked() {
    let data = this.domainList['_data']['_value'];
    if (data == null || data == undefined) {
      return false;
    }
    return data.filter((t) => t.isChecked).length > 0 && !this.allChecked;
  }
  setAvailableDomains() {
    let selectedItems = this.domainList['_data']['_value'].filter(
      (t) => t.isChecked
    );
    let uuidsToSetActive = [];
    selectedItems.forEach((t) => {
      uuidsToSetActive.push(t._id);
    });
    this.domainSvc.setDomainsAsAvailable(uuidsToSetActive).subscribe(
      (success) => {
        console.log('set available service method called and completed');
        this.domainList['_data']['_value']
          .filter((t) => uuidsToSetActive.includes(t._id))
          .forEach((e) => (e.isAvailable = true));
        this.domainList['_data']['_value'].forEach(
          (t) => (t.isChecked = false)
        );
        this.updateAllCheckboxComplete();
      },
      (failure) => {
        this.alertsSvc.alert('Failed to set domains as available');
        console.log(failure);
      }
    );
  }

  //Used by mat table for filtering with the search bar
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

  test() {}
}
