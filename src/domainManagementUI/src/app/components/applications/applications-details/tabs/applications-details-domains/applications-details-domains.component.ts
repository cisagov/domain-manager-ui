import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

//Services 
import { ApplicationsTabService } from 'src/app/services/tab-services/applications-details-tab.service';

// Models
import { ApplicationModel } from 'src/app/models/application.model';
import { DomainModel } from 'src/app/models/domain.model';

@Component({
  selector: 'app-applications-details-domains',
  templateUrl: './applications-details-domains.component.html',
  styleUrls: ['./applications-details-domains.component.scss']
})
export class ApplicationsDetailsDomainsComponent implements OnInit {

  dataSourceOne : MatTableDataSource<DomainModel>;
  dataSourceTwo : MatTableDataSource<DomainModel>;
  displayedColumns = ['name'];
  @ViewChild('TableOneSort', {static: true}) tableOneSort: MatSort
  @ViewChild('TableTwoSort', {static: true}) tableTwoSort: MatSort
  

  constructor(
    public appTabSvc: ApplicationsTabService,) { 
    this.dataSourceOne = new MatTableDataSource;
    this.dataSourceTwo = new MatTableDataSource;
  }

  ngOnInit(): void {
    for(var i = 0; i < 10; i++){
      this.appTabSvc.getDomainsUpdateBehvaiorSubject().subscribe(
        (val) => {
          let data = val as []
          if(data.length > 0){
            this.dataSourceOne.data = this.appTabSvc.domains_assigned
            this.dataSourceTwo.data = this.appTabSvc.domains_not_assigned
          }
        }
      )
    }
    this.dataSourceOne.sort = this.tableOneSort
    this.dataSourceTwo.sort = this.tableTwoSort
  }
  // applyFilterOne(filterValue: string) {
  //   this.dataSourceOne.filter = filterValue.trim().toLowerCase();
  // }

}
