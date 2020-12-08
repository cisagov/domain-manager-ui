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
import { ApplicationService } from 'src/app/services/applications.service';

//Models
import { ApplicationModel } from 'src/app/models/application.model';

@Component({
  selector: 'application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss'],
})
export class ApplicationListComponent implements OnInit {
  component_subscriptions = [];
  displayedColumns = ['application_name','domains_used_count'];
  search_input = '';
  applicationList: MatTableDataSource<ApplicationModel>;
  loading = true;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public applicationSvc: ApplicationService,
    public layoutSvc: LayoutService,
    private router: Router
  ) {
    this.layoutSvc.setTitle('Application');
  }

  ngOnInit(): void {
    this.getApplications();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
  }

  getApplications() {
    this.loading = true;
    this.applicationSvc.getAllApplications().subscribe(
      (success) => {
        this.applicationList = new MatTableDataSource<ApplicationModel>(
          success as ApplicationModel[]
        );
        this.loading = false;
        this.applicationList.sort = this.sort;
      },
      (error) => {
        console.log('Error getting application list');
        console.log(error);
        this.loading = false;
      }
    );
  }

  viewApplication(application_uuid) {
    this.router.navigate([
      `/application/details/${application_uuid}`,
    ]);
  }

  addApplication(){
    console.log("Upload Website not yet implemmeneted")
  }

  public filterList = (value: string) => {
    this.applicationList.filter = value.trim().toLocaleLowerCase();
  };
}
