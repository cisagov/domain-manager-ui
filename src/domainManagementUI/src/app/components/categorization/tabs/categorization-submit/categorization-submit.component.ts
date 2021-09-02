// Angular Imports
import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Local Service Imports
import { LayoutService } from 'src/app/services/layout.service';
import { CategorizationTabService } from 'src/app/services/tab-services/categorization-tabs.service';

@Component({
  selector: 'app-categorization-submit',
  templateUrl: './categorization-submit.component.html',
  styleUrls: ['./categorization-submit.component.scss'],
})
export class CategorizationSubmitComponent {
  categoryData = [];
  displayedColumns = [
    'domain',
    'proxy',
    'status',
    'category',
    'created',
    'categorize',
  ];
  categoryList: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public layoutSvc: LayoutService,
    public categorizationTabSvc: CategorizationTabService
  ) {
    this.layoutSvc.setTitle('Categorizations');
  }
}
