// Angular Imports
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';

//Models
import { FileUploadSettings } from 'src/app/models/fileUploadSettings.model';
import { TemplateModel } from 'src/app/models/template.model';
import { WebsiteModel } from 'src/app/models/website.model';

// Dialogs
import { FileUploadDialogComponent } from 'src/app/components/dialog-windows/file-upload/file-upload-dialog.component';

@Component({
  selector: 'wc-template-selection',
  templateUrl: './website-details-template-selection.component.html',
  styleUrls: ['./website-details-template-selection.component.scss'],
})
export class WebsiteDetailsTemplateSelectionComponent
  implements OnInit, OnDestroy {
  displayedColumns = [
    'name',
    // 'created_by',
    'created_date',
    'selected_template',
  ];
  templateList: MatTableDataSource<TemplateModel>;
  search_input = '';
  @ViewChild(MatSort) sort: MatSort;
  @Input() websiteId: string;
  safeURL: SafeResourceUrl = null;
  submitted: boolean = false;
  url: string;

  component_subscriptions = [];

  constructor(
    public dialog: MatDialog,
    public activeRoute: ActivatedRoute,
    public domSanitizer: DomSanitizer,
    public wdTabSvc: WebsiteDetailsTabService
  ) {}

  ngOnInit(): void {
    this.getTemplates();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getTemplates() {
    this.wdTabSvc.getAllTemplates().subscribe(
      (success) => {
        let data = this._formatTemplateList(success);
        this.templateList = new MatTableDataSource<TemplateModel>(
          data as TemplateModel[]
        );
        this.templateList.sort = this.sort;

        this.wdTabSvc.getTemplateUpdateBehvaiorSubject().subscribe(
          (_id) => {
            if (_id) {
              let tempTemplateModel = new TemplateModel();
              tempTemplateModel._id = _id;
              this.selectTemplate(tempTemplateModel);

              let selectedTemplate = this.templateList['_data'][
                '_value'
              ].filter((t) => t._id == _id);
              if (Array.isArray(selectedTemplate)) {
                this.displayTemplate(selectedTemplate[0].s3_url);
              }
            }
          },
          (failed) => {}
        );
      },
      (failure) => {}
    );
  }

  deSelectTemplate() {
    this.templateList['_data']['_value'].forEach((t) => (t.selected = false));
    this.submitted = false;

    this.tabForm.controls._id.setValue(null);
  }

  selectTemplate(template: TemplateModel) {
    let _id = template._id;
    this.displayTemplate(template.s3_url);
    let data = this.templateList['_data']['_value'];
    data.forEach((t) => (t.selected = false));
    data
      .filter((t) => t._id == _id)
      .forEach((selectedTemplate) => {
        selectedTemplate['selected'] = true;
      });
    this.tabForm.controls._id.setValue(_id);
    this.tabForm.controls.name.setValue(template.name);
  }

  displayTemplate(url) {
    this.url = url;
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  _formatTemplateList(data) {
    if (data instanceof Array) {
      data.forEach((templateItem) => {
        templateItem['selected'] = false;
      });
    }
    return data;
  }

  setURL(website: WebsiteModel) {
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(
      website.s3_url
    );
  }

  uploadWebsite() {
    const fileUploadSettings = new FileUploadSettings();
    fileUploadSettings.uploadType = 'website';
    fileUploadSettings.uploadFileType = 'application/zip';
    fileUploadSettings.multipleFileUpload = false;
    fileUploadSettings.uploadService = this.wdTabSvc.websiteSvc;
    fileUploadSettings.ID = this.websiteId;
    fileUploadSettings.WebsiteDomain = this.wdTabSvc.website_data.name;
    this.dialog.open(FileUploadDialogComponent, {
      data: fileUploadSettings,
    });
  }

  openInNewTab() {
    window.open(this.url, '_blank');
  }

  nextTab() {
    this.submitted = true;
    this.wdTabSvc.submitTab(this.tabForm);
  }

  public filterList = (value: string) => {
    this.templateList.filter = value.trim().toLocaleLowerCase();
  };

  // Helper Functions
  get tabForm() {
    return this.wdTabSvc.template_selection_form;
  }
  get attributeForm() {
    return this.wdTabSvc.attributes_form;
  }
  get f() {
    return this.tabForm.controls;
  }
}
