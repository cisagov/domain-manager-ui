// Angular Imports
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

// Local Service Imports
import { LayoutService } from 'src/app/services/layout.service';
import { WebsiteService } from 'src/app/services/website.service';
import { WebsiteDetailsTabService } from 'src/app/services/tab-services/website-details-tabs.service';


//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';

@Component({
  selector: 'website-details',
  templateUrl: './website-details.component.html',
  styleUrls: ['./website-details.component.scss'],
})
export class WebsiteDetailsComponent implements OnInit, OnDestroy {
  
  component_subscriptions = [];
  deleteDialog: MatDialogRef<ConfirmDialogComponent> = null;
  selectedTabIndex: number = 0;
  _id = null;

  constructor(
    public activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    public layoutSvc: LayoutService,
    private router: Router,
    public wdTabSvc: WebsiteDetailsTabService,
    public websiteTemplateSvc: WebsiteService
  ) {
    this.layoutSvc.setTitle('Website Details');
  }

  ngOnInit(): void {
    //Get the uuid param from the url
    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this._id = params['_id'];
        if (this._id !== null) {
          this.loadWebsite(this._id);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  loadWebsite(_id) {
    this.wdTabSvc.getWebsiteDetails(_id);
    this.wdTabSvc.getWebsiteHistory(_id);
  }

  onTabChanged(event) {
    console.log(event);
  }

  deleteWebsite() {
    console.log("trying to delte")
    let confirmDialogSettings = new ConfirmDialogSettings();
    confirmDialogSettings.itemConfirming = 'confirm website delete';
    confirmDialogSettings.actionConfirming = `Are you sure you want to delete ${this.wdTabSvc.website_data.name}, this action is permanent`;

    this.deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: confirmDialogSettings,
    });
    this.deleteDialog.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.wdTabSvc.deleteWebsite(this.wdTabSvc.website_data._id).subscribe(
          (success) => {
            this.router.navigate([`/website`]);
          },
          (failed) => {}
        );
      } else {
        console.log('delete cancled');
      }
    });
  }

}
