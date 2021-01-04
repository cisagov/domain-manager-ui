// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { WebsiteService } from 'src/app/services/website.service';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service'

//Models
import { WebsiteModel } from 'src/app/models/website.model';

@Component({
  selector: 'wd-demo',
  templateUrl: './website-details-demo.component.html',
  styleUrls: ['./website-details-demo.component.scss'],
})
export class WebsiteDetailsDemoComponent implements OnInit, OnDestroy {

  component_subscriptions = [];
  safeURL: SafeResourceUrl = null;
  template_data : WebsiteModel = new WebsiteModel();

  constructor(
    public domSanitizer: DomSanitizer,
    public wdTabSvc: WebsiteDetailsTabService,
  ) {
  }

  ngOnInit(): void {
    this.component_subscriptions.push(
      this.wdTabSvc.getWebsiteDataBehaviorSubject().subscribe(
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

  setURL(website: WebsiteModel){
    console.log(website)
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(website.website_url);
    console.log(this.safeURL)
  }

  openInNewTab(){
    window.open(this.wdTabSvc.website_data.website_url,"_blank")
  }
  test(){
    
  }
}
