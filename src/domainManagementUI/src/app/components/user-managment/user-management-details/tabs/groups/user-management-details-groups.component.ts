// Angular Imports
import { Component, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { UserManagementTabService } from 'src/app/services/tab-services/user-management-tabs.service';


//Models
import { ApplicationGroupModel } from 'src/app/models/application.model'

@Component({
  selector: 'app-user-management-details-groups',
  templateUrl: './user-management-details-groups.component.html',
  styleUrls: ['./user-management-details-groups.component.scss']
})

export class UserManagementDetailsGroupsComponent implements OnInit {

  allChecked = false;
  groupList: MatTableDataSource<ApplicationGroupModel> = new MatTableDataSource<ApplicationGroupModel>();
  displayedColumns = [
    'name',
    'checked'
  ];
  user_data_behvior_subject = null
  search_input = '';

  constructor(
    public alertsSvc: AlertsService,
    public umTabSvc: UserManagementTabService,
  ) { }

  ngOnInit(): void {
    this.umTabSvc.getUserUpdateBehvaiorSubject().subscribe(
      (item) => {
        if(item.Username){
          this.getApplicationGroups()
        }
      }
    )
  }

  getApplicationGroups(){
    this.umTabSvc.getApplicationGroups().subscribe(
      (success) => {  
        this.groupList = new MatTableDataSource<ApplicationGroupModel>(
          this.setUsersActiveGroups(success) as ApplicationGroupModel[]
          ); 
      },
      (failure) => {
        this.alertsSvc.alert("Failed to get application groups")
      }
    )
  }

  setUsersActiveGroups(applicationList){
    applicationList.forEach(group => {
      if(this.umTabSvc.user_data.Groups.filter((t) => t["GroupName"] == group.name).length > 0){
        group["isChecked"] = true;
      } else {
        group["isChecked"] = false; 
      }
    });
    return applicationList
  }

  
  setUsersGroups(){
    this.alertsSvc.alert("API not connected")
  }

  updateAllCheckboxComplete() {
    let data = this.groupList['_data']['_value'];
    this.allChecked = data != null && data.every((t) => t.isChecked);
  }
  setAllCheckboxes(checked: boolean) {
    let data = this.groupList['_data']['_value'];
    if (data == null || data == undefined) {
      return false;
    }
    this.allChecked = checked;
    data.forEach((t) => (t.isChecked = checked));
  }
  someChecked() {
    let data = this.groupList['_data']['_value'];
    if (data == null || data == undefined) {
      return false;
    }
    return data.filter((t) => t.isChecked).length > 0 && !this.allChecked;
  }

}
