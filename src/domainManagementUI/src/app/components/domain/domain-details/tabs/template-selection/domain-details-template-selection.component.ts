// Angular Imports
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

//Models
import { FileUploadSettings } from 'src/app/models/fileUploadSettings.model';
import { ProgressBarDialogSettings } from 'src/app/models/progressBarDialogSettings.model';
import { TemplateModel } from 'src/app/models/template.model';
import { DomainModel } from 'src/app/models/domain.model';

// Dialogs
import { FileUploadDialogComponent } from 'src/app/components/dialog-windows/file-upload/file-upload-dialog.component';
import { ProgressBarDialog } from 'src/app/components/dialog-windows/progress-bar/progress-bar-dialog.component';

@Component({
  selector: 'dd-template-selection',
  templateUrl: './domain-details-template-selection.component.html',
  styleUrls: ['./domain-details-template-selection.component.scss'],
})
export class DomainDetailsTemplateSelectionComponent
  implements OnInit, OnDestroy {
  displayedColumns = [
    'name',
    // 'created_by',
    'created_date',
    'selected_template',
  ];
  progressDialogRef: MatDialogRef<ProgressBarDialog> = null;
  templateList: MatTableDataSource<TemplateModel>;
  search_input = '';
  @ViewChild(MatSort) sort: MatSort;
  safeURL: SafeResourceUrl = null;
  submitted: boolean = false;
  url: string;

  component_subscriptions = [];

  userIsAdmin: boolean = false;

  constructor(
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    public activeRoute: ActivatedRoute,
    public domSanitizer: DomSanitizer,
    public ddTabSvc: DomainDetailsTabService,
    private userAuthSvc: UserAuthService,
  ) {
    this.userIsAdmin = this.userAuthSvc.userIsAdmin();
  }

  ngOnInit(): void {
    this.getTemplates();
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getTemplates() {
    this.ddTabSvc.getAllTemplates().subscribe(
      (success) => {
        let data = this._formatTemplateList(success);
        this.templateList = new MatTableDataSource<TemplateModel>(
          data as TemplateModel[]
        );
        this.templateList.sort = this.sort;

        this.ddTabSvc.getTemplateUpdateBehvaiorSubject().subscribe(
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
          (failure) => {
            console.log(failure);
          }
        );
      },
      (failure) => {
        this.alertsSvc.alert('Failed to get template list');
        console.log(failure);
      }
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
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(
      `https://${url}preview/home.html`
    );
  }

  _formatTemplateList(data) {
    if (data instanceof Array) {
      data.forEach((templateItem) => {
        templateItem['selected'] = false;
      });
    }
    return data;
  }

  setURL(domain: DomainModel) {
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(
      domain.s3_url
    );
  }

  uploadDomain() {
    const fileUploadSettings = new FileUploadSettings();
    fileUploadSettings.uploadType = 'domain';
    fileUploadSettings.uploadFileType = 'application/zip';
    fileUploadSettings.multipleFileUpload = false;
    fileUploadSettings.uploadService = this.ddTabSvc.domainSvc;
    fileUploadSettings.ID = this.ddTabSvc.domain_data._id;
    fileUploadSettings.DomainDomain = this.ddTabSvc.domain_data.name;
    let dialogRef = this.dialog.open(FileUploadDialogComponent, {
      data: fileUploadSettings,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'fileUploaded') {
        this.ddTabSvc.getDomainDetails(this.ddTabSvc.domain_data._id);
      } else {
        dialogRef.close();
      }
    });
  }

  generateFromTemplate() {
    let progressDialogSettings = new ProgressBarDialogSettings();
    progressDialogSettings.actionInProgress = 'Generating HTML for domain';
    progressDialogSettings.actionDetails =
      'Generating html for the domain. This process can take several minutes. ' +
      'If you close this dialog this process will continue in the background but you will have to remain on this page. ' +
      'This window will close once the process is complete.';

    this.progressDialogRef = this.dialog.open(ProgressBarDialog, {
      data: progressDialogSettings,
    });

    this.ddTabSvc.domain_data.is_generating_template = true;

    this.ddTabSvc.generateFromTemplate().subscribe(
      (success) => {
        this.progressDialogRef.close();
        this.alertsSvc.alert(
          'HTML successfully created and applied to domain '
        );
        //reload page to update the tab structure and display the newly created html
        let domain_id = this.ddTabSvc.domain_data._id;
        this.ddTabSvc.getDomainDetails(domain_id);
      },
      (failure) => {
        this.progressDialogRef.close();
        this.alertsSvc.alert(
          'An error occured while generating domain html. Please try again',
          undefined,
          10000
        );
        this.ddTabSvc.domain_data.is_generating_template = false;
        console.log(failure);
      }
    );
  }

  openInNewTab() {
    window.open(`https://${this.url}preview/home.html`, '_blank');
  }

  nextTab() {
    this.submitted = true;
    this.ddTabSvc.submitTab(this.tabForm);
  }

  public filterList = (value: string) => {
    this.templateList.filter = value.trim().toLocaleLowerCase();
  };

  // Helper Functions
  get tabForm() {
    return this.ddTabSvc.template_selection_form;
  }
  get attributeForm() {
    return this.ddTabSvc.attributes_form;
  }
  get f() {
    return this.tabForm.controls;
  }
}
