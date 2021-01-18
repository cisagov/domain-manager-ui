//Angular Imports
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

//Local Service Imports
import { LayoutService } from 'src/app/services/layout.service';
import { TemplateService } from 'src/app/services/template.service';

//Models
import { TemplateModel } from 'src/app/models/template.model';
import { FileUploadSettings } from 'src/app/models/fileUploadSettings.model';

// Dialogs
import { FileUploadDialogComponent } from 'src/app/components/dialog-windows/file-upload/file-upload-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
})
export class TemplateListComponent implements OnInit {
  component_subscriptions = [];
  displayedColumns = ['name', 'created_date', 'uploaded_by'];
  search_input = '';
  templateList: MatTableDataSource<TemplateModel>;
  loading = true;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    public layoutSvc: LayoutService,
    private router: Router,
    public templateSvc: TemplateService
  ) {
    this.layoutSvc.setTitle('Templates');
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit(): void {}

  getTemplates() {
    this.loading = true;
    this.templateSvc.getAllTemplates().subscribe(
      (success) => {
        this.templateList = new MatTableDataSource<TemplateModel>(
          success as TemplateModel[]
        );
        console.log(success);
        this.templateList.sort = this.sort;
        this.loading = false;
      },
      (error) => {
        console.log('Error getting website list');
        console.log(error);
        this.loading = false;
      }
    );
  }

  viewTemplate(_id) {
    console.log(_id);
    this.router.navigate([`/template/details/${_id}`]);
  }

  uploadTemplate() {
    console.log('opening upload template dialog');

    let fileUploadSettings = new FileUploadSettings();
    fileUploadSettings.uploadType = 'template';
    fileUploadSettings.uploadFileType = 'application/x-zip-compressed';
    fileUploadSettings.uploadService = this.templateSvc;
    fileUploadSettings.multipleFileUpload = true;
    this.dialog.open(FileUploadDialogComponent, {
      data: fileUploadSettings,
    });
  }

  public filterList = (value: string) => {
    this.templateList.filter = value.trim().toLocaleLowerCase();
  };
}
