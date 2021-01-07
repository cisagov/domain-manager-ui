//Angular Imports
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

//Local Service Imports
import { ApplicationService } from 'src/app/services/applications.service';
import { LayoutService } from 'src/app/services/layout.service';

//Models
import { ApplicationModel } from 'src/app/models/application.model';

//Dialogs
import { ApplicationCreateDialog } from 'src/app/components/applications/application-create-dialog/application-create-dialog.component';


@Component({
  selector: 'application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss'],
})
export class ApplicationListComponent implements OnInit {

  create_dialog : MatDialogRef<ApplicationCreateDialog> = null;
  component_subscriptions = [];
  displayedColumns = ['application_name','domains_used_count'];
  search_input = '';
  applicationList: MatTableDataSource<ApplicationModel>;
  loading = true;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public applicationSvc: ApplicationService,
    public dialog: MatDialog,
    public layoutSvc: LayoutService,
    private router: Router,
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
    this.create_dialog = this.dialog.open(ApplicationCreateDialog);
    this.create_dialog.afterClosed().subscribe(
      result => {
        if(result){
          if(result instanceof ApplicationModel){
            console.log(result)
            this.applicationSvc.createApplication(result).subscribe(
              (success) => {
                console.log(success)
                this.getApplications();
              },
              (failure) => {
                console.log('Failed to create application')
                console.log(failure)
              })
          }
        } else {
          console.log("dialog closed")
        }
      }
    )
  }

  public filterList = (value: string) => {
    this.applicationList.filter = value.trim().toLocaleLowerCase();
  };
}
