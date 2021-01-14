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
import { LayoutService } from 'src/app/services/layout.service';
import { WebsiteService } from 'src/app/services/website.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

//Models
import { FileUploadSettings } from 'src/app/models/fileUploadSettings.model';
import { WebsiteModel } from 'src/app/models/website.model';

// Dialogs
import { FileUploadDialogComponent } from 'src/app/components/dialog-windows/file-upload/file-upload-dialog.component';
import { DomainCreateDialogComponent } from 'src/app/components/website/domain-create-dialog/domain-create-dialog.component';

@Component({
  selector: 'website-list',
  templateUrl: './website-list.component.html',
  styleUrls: ['./website-list.component.scss'],
})
export class WebsiteListComponent implements OnInit {
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
  websiteList: MatTableDataSource<WebsiteModel> = new MatTableDataSource<WebsiteModel>();
  loading = true;

  userIsAdmin: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    public layoutSvc: LayoutService,
    private router: Router,
    private userAuthSvc: UserAuthService,
    public websiteSvc: WebsiteService
  ) {
    this.layoutSvc.setTitle('Websites');
    this.userAuthSvc.getUserIsAdminBehaviorSubject().subscribe((value) => {
      console.log(value);
      this.userIsAdmin = value;
    });
  }

  ngOnInit(): void {

    this.getWebsites();
    this._setAdminView();
  }
  

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    this.websiteList.sort = this.sort;
  }

  getWebsites() {
    this.loading = true;
    this.websiteSvc.getAllWebsites().subscribe(
      (success) => {
        this._formatWebsiteListData(success);
        this.websiteList = new MatTableDataSource<WebsiteModel>(
          success as WebsiteModel[]
        );
        console.log(this.websiteList);
        this.loading = false;
        this.websiteList.sort = this.sort;
      },
      (error) => {
        console.log('Error getting website list');
        console.log(error);
        this.loading = false;
      }
    );
  }

  viewWebsite(_id) {
    this.router.navigate([`/website/details/${_id}`]);
  }

  uploadWebsite() {
    let fileUploadSettings = new FileUploadSettings();
    fileUploadSettings.uploadType = 'website';
    fileUploadSettings.uploadFileType = 'application/x-zip-compressed';    
    fileUploadSettings.uploadService = this.websiteSvc;

    this.dialog.open(FileUploadDialogComponent, {
      data: fileUploadSettings,
    });
  }

  _formatWebsiteListData(data) {
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
    let data = this.websiteList['_data']['_value'];
    this.allChecked = data != null && data.every((t) => t.isChecked);
  }
  setAllCheckboxes(checked: boolean) {
    console.log(checked);
    let data = this.websiteList['_data']['_value'];
    if (data == null || data == undefined) {
      return false;
    }
    this.allChecked = checked;
    data.forEach((t) => (t.isChecked = checked));
    console.log('updateAll');
  }
  someChecked() {
    let data = this.websiteList['_data']['_value'];
    if (data == null || data == undefined) {
      return false;
    }
    return data.filter((t) => t.isChecked).length > 0 && !this.allChecked;
  }
  setAvailableWebsites() {
    let selectedItems = this.websiteList['_data']['_value'].filter(
      (t) => t.isChecked
    );
    let uuidsToSetActive = [];
    selectedItems.forEach((t) => {
      uuidsToSetActive.push(t._id);
    });
    this.websiteSvc.setWebsitesAsAvailable(uuidsToSetActive).subscribe(
      (success) => {
        console.log('set available service method called and completed');
        this.websiteList['_data']['_value']
          .filter((t) => uuidsToSetActive.includes(t._id))
          .forEach((e) => (e.isAvailable = true));
        this.websiteList['_data']['_value'].forEach(
          (t) => (t.isChecked = false)
        );
        this.updateAllCheckboxComplete();
      },
      (failure) => {
        console.log('Failed to update domain status');
      }
    );
  }

  //Used by mat table for filtering with the search bar
  public filterList = (value: string) => {
    this.websiteList.filter = value.trim().toLocaleLowerCase();
  };

  addDomain() {
    this.create_dialog = this.dialog.open(DomainCreateDialogComponent);
    this.create_dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.getWebsites();
      }
    });
  }

  test() {}
}
