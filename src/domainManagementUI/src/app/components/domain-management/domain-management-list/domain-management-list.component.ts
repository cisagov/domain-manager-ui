//Angular Imports
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

//Local Service Imports
import { DomainManagementService } from 'src/app/services/domain-management.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

//Models
import { DomainListItemModel } from 'src/app/models/domain.model';

@Component({
  selector: 'domain-management-list',
  templateUrl: './domain-management-list.component.html',
  styleUrls: ['./domain-management-list.component.scss'],
})
export class DomainManagementListComponent
  implements AfterViewInit, OnInit, OnDestroy {

  //Grid Variable
  allChecked = false;
  component_subscriptions = [];
  displayedColumns = ['name','application','lastUser','expirationDate','wentLiveDate','reputation','isAvailable'];
  domainList: MatTableDataSource<DomainListItemModel>;
  search_input = '';
  @ViewChild(MatSort) sort: MatSort;

  //General Page Variable
  loading = true;
  userIsAdmin: boolean = false;
  
  constructor(
    public domainSvc: DomainManagementService,
    public layoutSvc: LayoutService,
    private router: Router,
    private userAuthSvc: UserAuthService,
  ) {
    this.layoutSvc.setTitle('Domain Management');    
    this.userAuthSvc.getUserIsAdminBehaviorSubject().subscribe((value) => {
      this.userIsAdmin = value;
    });
  }

  ngOnInit(): void {
    this.getDomains();
    this._setAdminView()
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
        let data = this._formatDomainListData(success)
        this.domainList = new MatTableDataSource<DomainListItemModel>(
          data as DomainListItemModel[]
        );
        this.loading = false;
      },
      (error) => {
        console.log('Error getting domain list');
        console.log(error);
        this.loading = false;
      }
    );
  }

  _formatDomainListData(data){        
    if(this.userIsAdmin && data instanceof Array){
      data.forEach(domainItem => {
        domainItem['isChecked'] = false
      });
    }
    return data
  }

  _setAdminView(){
    console.log(this.userIsAdmin)
    if(this.userIsAdmin){
      this.displayedColumns.unshift('checked')
    }
  }

  viewDomain(domain_uuid) {
    this.router.navigate([`/domain-management/details/${domain_uuid}`]);
  }
  createDomain(){
    console.log("Create Domain not yet implemented")
  }

  public filterList = (value: string) => {
    this.domainList.filter = value.trim().toLocaleLowerCase();
  };

  updateAllCheckboxComplete(){
    let data = this.domainList['_data']['_value']
    this.allChecked = data != null && data.every(t => t.isChecked);
  }

  setAllCheckboxes(checked: boolean){
    console.log(checked)
    let data = this.domainList['_data']['_value']
    if(data == null || data == undefined){
      return false;
    }
    this.allChecked = checked;
    data.forEach(t => t.isChecked = checked);
    console.log("updateAll")
  }
  someChecked(){
    let data = this.domainList['_data']['_value']
    if(data == null || data == undefined){
      return false;
    }
    return data.filter(t => t.isChecked).length > 0 && !this.allChecked
  }

  setAvailableDomains(){
    let selectedItems = this.domainList['_data']['_value'].filter(t => t.isChecked);
    let uuidsToSetActive = []
    selectedItems.forEach(t => {
      uuidsToSetActive.push(t.uuid)
    });
    this.domainSvc.setDomainsAsAvailable(uuidsToSetActive).subscribe(
      (success) => {
        console.log("set available service method called and completed")
        this.domainList['_data']['_value'].filter(t => uuidsToSetActive.includes(t.uuid)).forEach(e => e.isAvailable = true)
        this.domainList['_data']['_value'].forEach(t => t.isChecked = false)
        this.updateAllCheckboxComplete();
      },
      (failure) => {
        console.log("Failed to update domain status")
      }
    )
  }

  test(){
    console.log(this.userIsAdmin);
    console.log(this.domainList)
    this.allChecked = true
    this.domainList['_data']['_value'].forEach(element => {
      element['isChecked'] = true
    });
  }

}
