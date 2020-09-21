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
import { WebsiteTemplatesService } from 'src/app/services/website-templates.service';
import { LayoutService } from 'src/app/services/layout.service';

//Models
import { WebsiteTemplateModel } from 'src/app/models/website-templates.model';

@Component({
  selector: 'website-templates-list',
  templateUrl: './website-templates-list.component.html',
  styleUrls: ['./website-templates-list.component.scss'],
})
export class WebsiteTemplatesListComponent implements OnInit {
  component_subscriptions = [];
  displayedColumns = ['counter', 'name', 'uuid'];
  websiteTemplateList: MatTableDataSource<WebsiteTemplateModel>;
  loading = true;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public websiteTemplateSvc: WebsiteTemplatesService,
    public layoutSvc: LayoutService,
    private router: Router
  ) {
    this.layoutSvc.setTitle('Website Templates');
  }

  ngOnInit(): void {
    this.getWebsiteTemplates();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    this.websiteTemplateList.sort = this.sort;
  }

  getWebsiteTemplates() {
    this.loading = true;
    this.websiteTemplateSvc.getAllWebsiteTemplates().subscribe(
      (success) => {
        this.websiteTemplateList = new MatTableDataSource<WebsiteTemplateModel>(
          success as WebsiteTemplateModel[]
        );
        this.loading = false;
      },
      (error) => {
        console.log('Error getting website template list');
        console.log(error);
        this.loading = false;
      }
    );
  }

  viewWebsiteTemplate(website_template_uuid) {
    this.router.navigate([
      `/website-templates/details/${website_template_uuid}`,
    ]);
  }
}
