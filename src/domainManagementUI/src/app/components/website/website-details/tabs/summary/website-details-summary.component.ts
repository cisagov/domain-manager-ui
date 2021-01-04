// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Local Service Imports
import { ApplicationService } from 'src/app/services/applications.service';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service'
import { WebsiteService } from 'src/app/services/website.service';

//Models
import { WebsiteModel } from 'src/app/models/website.model';

//Dialogs
import { WebsiteDeleteDialogComponent } from 'src/app/components/website/website-delete-dialog/website-delete-dialog.component';

@Component({
  selector: 'wd-summary',
  templateUrl: './website-details-summary.component.html',
  styleUrls: ['./website-details-summary.component.scss'],
})
export class WebsiteDetailsSummaryComponent implements OnInit, OnDestroy {

  component_subscriptions = [];
  website_data : WebsiteModel = new WebsiteModel();

  constructor(
    public applicationSvc: ApplicationService,
    public dialog: MatDialog,
    public wdTabSvc: WebsiteDetailsTabService,
    public websiteSvc: WebsiteService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getApplicationName(){
    if(this.wdTabSvc.website_data.application_using_uuid && this.applicationSvc.application_list.length){
      return this.applicationSvc.getApplicationNameByUUID(this.wdTabSvc.website_data.application_using_uuid);
    } else {
      return "Loading Application List"
    }
  }
  test(){
    console.log("test")
  }
  deleteWebsite(inputUUID){
    console.log("attempting to delete: " + inputUUID)
      this.dialog.open(WebsiteDeleteDialogComponent, {
        data: {
          uuid: inputUUID,
          name: this.websiteSvc.getWebsiteNameByUUID(inputUUID),
        }
      });
    
  }
}
