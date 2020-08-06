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
import { DomainUtilizationService } from 'src/app/services/domain-utilization.service';
import { LayoutService } from 'src/app/services/layout.service';

//Models
import { DomainUtilizationBaseModel } from 'src/app/models/domain-utilization.model';
@Component({
  selector: 'domain-utilization-list',
  templateUrl: './domain-utilization-list.component.html',
  styleUrls: ['./domain-utilization-list.component.scss'],
})
export class DomainUtilizedListComponent implements OnInit {
  component_subscriptions = [];
  displayedColumns = ['counter', 'name', 'uuid'];
  domainsUtilizedList: MatTableDataSource<DomainUtilizationBaseModel>;
  loading = true;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public domainUtilizedSvc: DomainUtilizationService,
    public layoutSvc: LayoutService,
    private router: Router
  ) {
    this.layoutSvc.setTitle('Domains Utilized');
  }

  ngOnInit(): void {
    this.getDomainsUtilized();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    this.domainsUtilizedList.sort = this.sort;
  }

  getDomainsUtilized() {
    this.loading = true;
    this.domainUtilizedSvc.getAllDomainsUtilized().subscribe(
      (success) => {
        this.domainsUtilizedList = new MatTableDataSource<
          DomainUtilizationBaseModel
        >(success as DomainUtilizationBaseModel[]);
        this.loading = false;
      },
      (error) => {
        console.log('Error getting domains utilized list');
        console.log(error);
        this.loading = false;
      }
    );
  }

  viewDomainUtilizedDetails(website_template_uuid) {
    this.router.navigate([
      `/domains-utilized/details/${website_template_uuid}`,
    ]);
  }
}
