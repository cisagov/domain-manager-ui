// Angular Imports
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { WebsiteCreationTabService } from 'src/app/services/tab-services/website-creation-tabs.service'

//Models
import { WebsiteModel } from 'src/app/models/website.model';
import { TemplateModel } from 'src/app/models/template.model';

@Component({
  selector: 'wc-template-selection',
  templateUrl: './website-creation-template-selection.component.html',
  styleUrls: ['./website-creation-template-selection.component.scss'],
})
export class WebsiteCreationTemplateSelectionComponent implements OnInit, OnDestroy {


  displayedColumns = ['template_name', 'created_by', 'created_date', 'selected_template'];
  templateList: MatTableDataSource<TemplateModel>;
  search_input = '';
  @ViewChild(MatSort) sort: MatSort;
  safeURL: SafeResourceUrl = null;
  submitted: boolean = false;
  url: string;

  component_subscriptions = [];
  
  constructor(
    public activeRoute: ActivatedRoute,
    public domSanitizer: DomSanitizer,
    public wcTabSvc: WebsiteCreationTabService,
  ) {
  }

  ngOnInit(): void {
    this.getTemplates();
  }
    

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getTemplates(){
    this.wcTabSvc.getAllWebsites().subscribe(
      (success) => {
        let data = this._formatTemplateList(success);
        this.templateList = new MatTableDataSource<TemplateModel>(
          data as TemplateModel[]
        )
        this.templateList.sort = this.sort;


        this.wcTabSvc.getTemplateUpdateBehvaiorSubject().subscribe(
          (template_uuid) => {
            if(template_uuid){
              let tempTemplateModel = new TemplateModel();
              tempTemplateModel.template_uuid = template_uuid;
              this.selectTemplate(tempTemplateModel);
              
              let selectedTemplate = this.templateList['_data']['_value']
                .filter(t => t.template_uuid == template_uuid)
              if(Array.isArray(selectedTemplate)){
                this.displayTemplate(selectedTemplate[0].template_url)
              }
              console.log(selectedTemplate)

            }
          },
          (failed) => {}
        )
      },
      (failure) => {}
    )
    
  }


  deSelectTemplate() {
    this.templateList['_data']['_value'].forEach(t => t.selected = false)
    this.submitted = false;

    this.tabForm.controls.template_uuid.setValue(null)
  }

  selectTemplate(template: TemplateModel){
    let template_uuid = template.template_uuid;
    this.displayTemplate(template.template_url)
    let data = this.templateList['_data']['_value']
    data.forEach(t => t.selected = false)
    data.filter(t => t.template_uuid == template_uuid)
      .forEach( selectedTemplate => {
        selectedTemplate['selected'] = true
      });
    this.tabForm.controls.template_uuid.setValue(template_uuid)
    
    console.log(this.templateList['_data']['_value'])
  }

  displayTemplate(url){
    console.log(url)
    this.url = url;
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  
  _formatTemplateList(data){
    if(data instanceof Array){
      data.forEach(templateItem => {
        templateItem['selected'] = false
      });
    }
    return data
  }

  setURL(website: WebsiteModel){
    console.log(website)
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(website.website_url);
    console.log(this.safeURL)
  }

  openInNewTab(){
    window.open(this.url,"_blank")
  }

  nextTab(){
    this.submitted = true;
    this.wcTabSvc.submitTab(this.tabForm)
  }

  public filterList = (value: string) => {
    this.templateList.filter = value.trim().toLocaleLowerCase();
  };

  //Helper Functions
  get tabForm(){
    return this.wcTabSvc.template_selection_form;
  }
  get f(){
    return this.tabForm.controls
  }

}
