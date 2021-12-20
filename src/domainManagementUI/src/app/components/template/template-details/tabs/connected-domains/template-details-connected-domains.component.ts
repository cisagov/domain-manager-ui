// Angular Imports
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Local Service Imports
import { TemplateDetailsTabService } from 'src/app/services/tab-services/template-details-tabs.service';

//Models
import { TemplateModel } from 'src/app/models/template.model';
import { BehaviorSubject } from 'rxjs';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { DomainModel } from 'src/app/models/domain.model';

@Component({
  selector: 'td-connected-domains',
  templateUrl: './template-details-connected-domains.component.html',
  styleUrls: ['./template-details-connected-domains.component.scss'],
})
export class TemplateDetailsConnectedDomainsComponent
  implements OnInit, OnDestroy
{
  component_subscriptions = [];
  dataSub = null;
  displayedColumns = ['name', 'application_name', 'download'];
  template_data: TemplateModel = new TemplateModel();
  @ViewChild(MatSort) sort: MatSort;
  domainsUsedList: MatTableDataSource<DomainModel> =
    new MatTableDataSource<DomainModel>();

  constructor(public tdTabSvc: TemplateDetailsTabService) {}

  ngOnInit(): void {
    this.dataSub = this.tdTabSvc.domains_used_behavior_subject.subscribe(
      (val) => {
        if (val.length) {
          this.domainsUsedList = new MatTableDataSource<DomainModel>(
            val as DomainModel[]
          );
          this.domainsUsedList.sort = this.sort;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
