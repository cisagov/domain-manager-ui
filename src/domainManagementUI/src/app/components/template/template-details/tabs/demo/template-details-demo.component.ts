// Angular Imports
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { TemplateService } from 'src/app/services/template.service';
import { TemplateDetailsTabService } from 'src/app/services/tab-services/template-details-tabs.service'

//Models
import { TemplateModel } from 'src/app/models/template.model';

@Component({
  selector: 'td-demo',
  templateUrl: './template-details-demo.component.html',
  styleUrls: ['./template-details-demo.component.scss'],
})
export class TemplateDetailsDemoComponent implements OnInit, OnDestroy {

  component_subscriptions = [];
  safeURL: SafeResourceUrl = null;
  template_data : TemplateModel = new TemplateModel();

  constructor(
    public domSanitizer: DomSanitizer,
    public tdTabSvc: TemplateDetailsTabService,
  ) {
  }

  ngOnInit(): void {
    this.component_subscriptions.push(
      this.tdTabSvc.getTemplateDataBehaviorSubject().subscribe(
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

  setURL(template: TemplateModel){
    console.log(template)
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(template.template_url);
    console.log(this.safeURL)
  }

  openInNewTab(){
    window.open(this.tdTabSvc.template_data.template_url,"_blank")
  }
  test(){
    console.log(this.tdTabSvc.template_data_attributes[0])
  }
}
