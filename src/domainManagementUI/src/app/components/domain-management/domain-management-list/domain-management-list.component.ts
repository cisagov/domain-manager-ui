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

//Models
import { DomainBaseModel, DomainModel } from 'src/app/models/domain.model';

@Component({
  selector: 'domain-management-list',
  templateUrl: './domain-management-list.component.html',
  styleUrls: ['./domain-management-list.component.scss'],
})
export class DomainManagementListComponent
  implements AfterViewInit, OnInit, OnDestroy {
  component_subscriptions = [];
  displayedColumns = ['Name', 'ResourceRecordSetCount', 'uuid'];
  domainList: MatTableDataSource<DomainBaseModel>;
  loading = true;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public domainSvc: DomainManagementService,
    public layoutSvc: LayoutService,
    private router: Router
  ) {
    this.layoutSvc.setTitle('Domain Management');
  }

  ngOnInit(): void {
    this.getDomains();
    this.domainList = new MatTableDataSource<DomainBaseModel>();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    // this.domainList.sort = this.sort;
  }

  getDomains() {
    this.loading = true;
    this.domainSvc.getAllDomains().subscribe(
      (success) => {
        // this.domainList = new MatTableDataSource<DomainBaseModel>(
        //   success as DomainBaseModel[]
        // );
        this.domainList.data = success as DomainBaseModel[];
        this.domainList.sort = this.sort;
        console.log(success as DomainModel[]);
        this.loading = false;
      },
      (error) => {
        console.log('Error getting domain list');
        console.log(error);
        this.loading = false;
      }
    );
  }

  viewDomain(domain_uuid) {
    this.router.navigate([`/domain-management/details/${domain_uuid}`]);
  }
}
