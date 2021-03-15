// Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

// Local Service Imports
import { DomainService } from 'src/app/services/domain.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';

//Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { DomainModel } from 'src/app/models/domain.model';

//Dialogs
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';

@Component({
  selector: 'dd-demo',
  templateUrl: './domain-details-demo.component.html',
  styleUrls: ['./domain-details-demo.component.scss'],
})
export class DomainDetailsDemoComponent implements OnInit, OnDestroy {
  component_subscriptions = [];
  safeURL: SafeResourceUrl = null;
  template_data: DomainModel = new DomainModel();

  deleteDialog: MatDialogRef<ConfirmDialogComponent> = null;

  constructor(
    public dialog: MatDialog,
    public domSanitizer: DomSanitizer,
    public ddTabSvc: DomainDetailsTabService
  ) {}

  ngOnInit(): void {
    this.component_subscriptions.push(
      this.ddTabSvc.getDomainDataBehaviorSubject().subscribe(
        (success) => {
          this.setURL(success);
        },
        (failure) => {}
      )
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  setURL(domain: DomainModel) {
    this.safeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(
      domain.s3_url + 'home.html'
    );
  }

  openInNewTab() {
    window.open(`${this.ddTabSvc.domain_data.s3_url}home.html`, '_blank');
  }
  newTemplate() {
    let confirmDialogSettings = new ConfirmDialogSettings();
    confirmDialogSettings.itemConfirming = 'Select New Domain Content Data?';
    confirmDialogSettings.actionConfirming = `Are you sure you want to select new domain content? This will remove the current content permanently`;

    this.deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: confirmDialogSettings,
    });
    this.deleteDialog.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.ddTabSvc.templateExists = false;
        this.ddTabSvc.removeTemplate();
      } else {
        console.log('delete cancled');
      }
    });
  }
  test() {}
}
