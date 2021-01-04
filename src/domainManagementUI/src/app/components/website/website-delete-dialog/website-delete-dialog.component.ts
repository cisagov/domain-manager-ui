
import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';

import { WebsiteService } from 'src/app/services/website.service';


@Component({
    selector: 'website-delete-dialog',
    templateUrl: 'website-delete-dialog.component.html',
  })
  export class WebsiteDeleteDialogComponent {

    inProgress = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        public dialog: MatDialog,
        private router: Router,    
        public websiteSvc: WebsiteService,  
      ) { }


    deleteWebsite(){
      this.inProgress = true;
      console.log("Delteteing")
      this.websiteSvc.deleteWebsite(this.data.uuid).subscribe(
        (success) => {
          this.inProgress = false;
          this.dialog.closeAll()
          this.router.navigate([
            `/website`,
          ]);},
        (failure) => {
          console.log("Failed to delete selected item")
          this.inProgress = false;
        }
      )

    }
  }