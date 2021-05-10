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
    this.downloadObject(
      'DomainManagerUserGuide.pdf',
      'assets/userguide/pdf/DomainManager.pdf'
    );
  }

  downloadObject(filename, filepath) {
    const a = document.createElement('a');
    a.href = filepath;
    a.download = filename;
    a.click();
    a.remove();
  }

  featureRequest() {
    this.helpSvc.featureRequest();
  }

  bugReport() {
    this.helpSvc.bugReport();
  }
}
