import { Component, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-help-menu',
  templateUrl: './help-menu.component.html',
  styleUrls: ['./help-menu.component.scss'],
})
export class HelpMenuComponent implements OnInit {
  constructor(
    private helpSvc: HelpService,
    public alertsSvc: AlertsService,
    public settingsService: SettingsService
  ) {}

  ngOnInit(): void {}
  openUserManual() {
    this.alertsSvc.alert(
      'The in browser User guide is not yet implmeneted, will be in place soon'
    );
  }

  help() {
    this.helpSvc.getUserGuide().subscribe(
      (success) => {
        console.log(success);
        this.downloadObject('DomainManagerUserGuide.pdf', success);
      },
      (failure) => {
        this.alertsSvc.alert(failure);
        console.log(failure);
      }
    );
  }
  downloadObject(filename, blob) {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
  featureRequest() {
    this.helpSvc.featureRequest();
  }

  bugReport() {
    this.helpSvc.bugReport();
  }
}
