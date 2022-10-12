import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AboutModel, SettingsModel } from 'src/app/models/about.model';
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { AboutService } from 'src/app/services/about.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { ConfirmDialogComponent } from '../dialog-windows/confirm/confirm-dialog.component';

@Component({
  selector: 'app-about-page',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  aboutData = new AboutModel();
  settingsData = new SettingsModel();
  constructor(
    public aboutSvc: AboutService,
    public layoutSvc: LayoutService,
    public userAuthSvc: UserAuthService,
    public dialog: MatDialog,
    public alertsSvc: AlertsService
  ) {
    this.layoutSvc.setTitle('About');
  }

  ngOnInit(): void {
    this.getAbout();
    if (this.userAuthSvc.isAdmin) {
      this.getSettings();
    }
  }

  getAbout() {
    this.aboutSvc.getAbout().subscribe(
      (success) => {
        this.aboutData = success as AboutModel;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSettings() {
    this.aboutSvc.getSettings().subscribe(
      (success: SettingsModel) => {
        this.settingsData = success;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  saveSettings() {
    const dialogSettings = new ConfirmDialogSettings();
    dialogSettings.itemConfirming = 'Confirm Settings';
    dialogSettings.actionConfirming =
      'Are you sure you want to save the new settings';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogSettings,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.aboutSvc.saveSettings(this.settingsData).subscribe(
          (success: SettingsModel) => {
            this.settingsData = success;
            this.alertsSvc.alert('Settings saved successfully.');
          },
          (error) => {
            this.alertsSvc.alert(error.error);
          }
        );
      } else {
        dialogRef.close();
      }
    });
  }
}
