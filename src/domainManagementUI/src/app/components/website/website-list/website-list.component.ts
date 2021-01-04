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
import { LayoutService } from 'src/app/services/layout.service';
import { WebsiteService } from 'src/app/services/website.service';

//Models
import { WebsiteModel } from 'src/app/models/website.model';

@Component({
  selector: 'website-list',
  templateUrl: './website-list.component.html',
  styleUrls: ['./website-list.component.scss'],
})
export class WebsiteListComponent implements OnInit {
  component_subscriptions = [];
  displayedColumns = ['website_name', 'template_base_name', 'created_date'];
  search_input = '';
  websiteList: MatTableDataSource<WebsiteModel>;
  loading = true;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public websiteSvc: WebsiteService,
    public layoutSvc: LayoutService,
    private router: Router
  ) {
    this.layoutSvc.setTitle('Websites');
  }

  ngOnInit(): void {
    this.getWebsites();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit(): void {}

  getWebsites() {
    this.loading = true;
    this.websiteSvc.getAllWebsites().subscribe(
      (success) => {
        this.websiteList = new MatTableDataSource<WebsiteModel>(
          success as WebsiteModel[]
        );
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

  viewWebsite(website_uuid) {
    this.router.navigate([`/website/details/${website_uuid}`]);
  }
  uploadWebsite() {
    console.log('Upload Website not yet implemmeneted');
  }
  public filterList = (value: string) => {
    this.websiteList.filter = value.trim().toLocaleLowerCase();
  };
}
