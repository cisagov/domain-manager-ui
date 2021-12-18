import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

//Services
import { ApplicationsTabService } from 'src/app/services/tab-services/applications-details-tab.service';

// Models
import { DomainModel } from 'src/app/models/domain.model';

@Component({
  selector: 'app-applications-details-domains',
  templateUrl: './applications-details-domains.component.html',
  styleUrls: ['./applications-details-domains.component.scss'],
})
export class ApplicationsDetailsDomainsComponent implements OnInit {
  dataSourceOne: MatTableDataSource<DomainModel>;
  dataSourceTwo: MatTableDataSource<DomainModel>;
  displayedColumns = ['name'];
  @ViewChild('TableOneSort', { static: true }) tableOneSort: MatSort;
  @ViewChild('TableTwoSort', { static: true }) tableTwoSort: MatSort;

  constructor(public appTabSvc: ApplicationsTabService) {
    this.dataSourceOne = new MatTableDataSource();
    this.dataSourceTwo = new MatTableDataSource();
  }

  ngOnInit(): void {
    for (var i = 0; i < 10; i++) {
      this.appTabSvc.getDomainsUpdateBehvaiorSubject().subscribe((val) => {
        if (val) {
          this.dataSourceTwo.data = this.appTabSvc.domains_assigned;
          this.dataSourceOne.data = this.appTabSvc.domains_not_assigned;
        }
      });
    }
    this.setSorts();
  }
  setSorts() {
    this.dataSourceOne.sort = this.tableOneSort;
    this.dataSourceTwo.sort = this.tableTwoSort;
  }

  assignDomain(row) {
    row = this.appTabSvc.updateDomainOwner(row);
    this.transferItem(this.dataSourceOne, this.dataSourceTwo, row);
    this.appTabSvc.updateDomain(row).subscribe(
      (success) => {},
      (failure) => {
        this.transferItem(this.dataSourceTwo, this.dataSourceOne, row);
      }
    );
    this.setSorts();
  }

  removeDomain(row) {
    row = this.appTabSvc.updateDomainOwner(row);
    this.transferItem(this.dataSourceTwo, this.dataSourceOne, row);
    this.appTabSvc.updateDomain(row).subscribe(
      (success) => {},
      (failure) => {
        this.transferItem(this.dataSourceOne, this.dataSourceTwo, row);
      }
    );
    this.setSorts();
  }

  transferItem(fromSource, toSource, item) {
    let dataIndex = fromSource.data.map((item) => item._id).indexOf(item._id);
    fromSource.data.splice(dataIndex, 1);
    fromSource.data = [...fromSource.data];
    toSource.data.splice(0, 0, item);
    toSource.data = [...toSource.data];
  }
}
