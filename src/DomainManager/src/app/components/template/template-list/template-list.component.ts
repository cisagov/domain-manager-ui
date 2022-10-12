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
  displayedColumns = [
    'nameLowerCase',
    'is_approved',
    'created_date',
    'updated_date',
    'createdByLowerCase',
    'updatedByLowerCase',
  ];
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
        let templateData = success as TemplateModel[];
        templateData.forEach((element) => {
          let lowerCaseName = element['name']
            ? (element['name'] as string)
            : '';
          let lowerCaseCreatedBy = element['created_by']
            ? (element['created_by'] as string)
            : '';
          let lowerCaseUpdatedBy = element['updated_by']
            ? (element['updated_by'] as string)
            : '';
          element['nameLowerCase'] = lowerCaseName.toLowerCase();
          element['createdByLowerCase'] = lowerCaseCreatedBy.toLowerCase();
          element['updatedByLowerCase'] = lowerCaseUpdatedBy.toLowerCase();
        });
        this.templateList = new MatTableDataSource<TemplateModel>(
          success as TemplateModel[]
        );
        this.templateList.sort = this.sort;
        this.loading = false;
      },
      (error) => {
        console.log('Error getting domain list');
        console.log(error);
        this.loading = false;
      }
    );
  }

  viewTemplate(_id) {
    this.router.navigate([`/template/details/${_id}`]);
  }

  uploadTemplate() {
    let fileUploadSettings = new FileUploadSettings();
    fileUploadSettings.uploadType = 'template';
    fileUploadSettings.uploadFileType = 'application/x-zip-compressed';
    fileUploadSettings.uploadService = this.templateSvc;
    fileUploadSettings.multipleFileUpload = true;
    fileUploadSettings.uploadObjectName = 'template';
    let dialogRef = this.dialog.open(FileUploadDialogComponent, {
      data: fileUploadSettings,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'fileUploaded') {
        this.getTemplates();
      } else {
        dialogRef.close();
      }
    });
  }

  public filterList = (value: string) => {
    this.templateList.filter = value.trim().toLocaleLowerCase();
  };
}
