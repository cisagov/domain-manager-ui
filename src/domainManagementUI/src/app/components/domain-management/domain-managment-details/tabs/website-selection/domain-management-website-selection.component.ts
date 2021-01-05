// Angular Imports
import { 
  Component, 
  OnInit, 
  ViewChild, 
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { DomainManagementTabService } from 'src/app/services/tab-services/domain-management-tabs.service';
import { WebsiteService } from 'src/app/services/website.service';

//Models
import { WebsiteModel } from 'src/app/models/website.model';

@Component({
  selector: 'dmWebsiteSelectionTab',
  templateUrl: './domain-management-website-selection.component.html',
})
export class DomainManagementWebsiteSelectionTab implements OnInit {
  
  displayedColumns = ['website_name','template_base_name','created_date','selected_website'];
  websiteList: MatTableDataSource<WebsiteModel>;
  search_input = '';
  @ViewChild(MatSort) sort: MatSort;

  websiteDataReady: boolean = false;
  domainDataReady: boolean = false;
  safeURL: SafeResourceUrl = null;
  submitted: boolean = false;
  url: string;

  component_subscriptions = [];
  
  constructor(
    public domainTabSvc: DomainManagementTabService,
    public domSanitizer: DomSanitizer,
    public websiteSvc: WebsiteService,
    ) {}

  ngOnInit(): void {
    this.getWebsites();
    this.component_subscriptions.push(
      this.domainTabSvc.getDomainDataBehaviorSubject().subscribe(
        (success) => {
          this._setDomainDataStatus();
        },
        (failure) => {} 
      )
    )
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getWebsites() {
    this.websiteSvc.getAllWebsites().subscribe(
      (success) => {
        let data = this._formatWebsiteListData(success);
        this.websiteList = new MatTableDataSource<WebsiteModel>(
          data as WebsiteModel[]
        );
        this._setWebsiteDataStatus();
        this.websiteList.sort = this.sort;
      },
      (error) => {
        console.log('Error getting website list');
        console.log(error);
      }
    );
  }
  
  selectWebsite(website: WebsiteModel) {
    let website_uuid = website.website_uuid;
    this.displayWebsite(website.website_url)
    if(this.domainDataReady){
      this.submitted = false;
      let data = this.websiteList['_data']['_value']
      data.forEach(t => t.selected = false)
      data.filter(t => t.website_uuid == website_uuid)
        .forEach(selectedWebsite => {
          selectedWebsite['selected'] = true
        });
        this.tabForm.controls.website_uuid.setValue(website_uuid)
    }
  }  
  deSelectWebsite() {
    this.websiteList['_data']['_value'].forEach(t => t.selected = false)
    this.submitted = false;

    this.tabForm.controls.website_uuid.setValue(null)
  }

  displayWebsite(url){
    console.log(url)
    this.url = url;
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openInNewTab(){
    window.open(this.url,"_blank")
  }

  nextTab(){
    this.submitted = true;
    this.domainTabSvc.submitTab(this.tabForm)
  }

  //Helper getter method
  get tabForm(){
    return this.domainTabSvc.website_selection_tab_form;
  }

  //Helper getter method for easy acces in html
  get f(){
    return this.domainTabSvc.website_selection_tab_form.controls
  }

  public filterList = (value: string) => {
    this.websiteList.filter = value.trim().toLocaleLowerCase();
  };

  _formatWebsiteListData(data){   
    if(data instanceof Array){
      data.forEach(websiteItem => {
        websiteItem['selected'] = false
      });
    }
    return data
  }

  _setWebsiteDataStatus(){
    this.websiteDataReady = true;
    console.log(this.websiteDataReady)
    this._setSelectedWebsite();
  }
  _setDomainDataStatus(){
    this.domainDataReady = true;
    console.log(this.domainDataReady)
    this._setSelectedWebsite();
  }
  _setSelectedWebsite(){
    if(this.websiteDataReady && this.domainDataReady){
      console.log("Both Ready")
      console.log(this.domainTabSvc.domainData)
      console.log(this.websiteList['_data']['_value'])
      this.websiteList['_data']['_value']
        .filter(t => t.website_uuid == this.domainTabSvc.domainData.website_uuid)
        .forEach(selectedWebsite => {
          selectedWebsite['selected'] = true
          this.displayWebsite(selectedWebsite.website_url)
        });      
    } else {
      console.log("NOT READY")
      if(!this.websiteDataReady){console.log("website")}
      if(!this.domainDataReady){console.log("domain")}
    }
  }


}
