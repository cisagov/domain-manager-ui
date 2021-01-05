// Angular Imports
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { WebsiteService } from 'src/app/services/website.service';
import { WebsiteCreationTabService } from 'src/app/services/tab-services/website-creation-tabs.service'

//Models
import { WebsiteModel } from 'src/app/models/website.model';
import { TemplateModel } from 'src/app/models/template.model';
import { Template } from '@angular/compiler/src/render3/r3_ast';

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
  url: string;

  component_subscriptions = [];
  
  constructor(
    public domSanitizer: DomSanitizer,
    public wcTabSvc: WebsiteCreationTabService,
  ) {
  }

  ngOnInit(): void {
    this.component_subscriptions.push(
      this.wcTabSvc.getWebsiteDataBehaviorSubject().subscribe(
        (success) => {
          this.setURL(success)
        },
        (failure) => {} 
      )
    )    
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
      },
      (failure) => {}
    )
  }

  selectTemplate(template: TemplateModel){
    let template_uuid = template.template_uuid;
    //this.displayTemplate(template.template_url)

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
    // window.open(this.wcTabSvc.website_data.website_url,"_blank")
  }
  test(){
    
  }
}
