// Angular Imports
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Location } from '@angular/common';

@Injectable()
export class HelpService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService,
    public location: Location
  ) {}

  getUserGuide() {
    console.log('getUserGuide');
    const downloadHeaders = new HttpHeaders().set(
      'content-type',
      'application/zip'
    );
    const url = `${this.settingsService.settings.apiUrl}/api/help/`;
    return this.http.get(url, {
      headers: downloadHeaders,
      responseType: 'blob',
    });
  }
  openUserGuide() {
    const angularRoute = this.location.path();
    const url = window.location.href;
    const appDomain = url.replace(angularRoute, '');

    let helpUrl = appDomain + '/assets/userguide/html/index.htm';
    console.log(helpUrl);
    window.open(helpUrl, '_blank');
  }

  featureRequest() {
    window.open(
      'https://github.com/cisagov/domain-manager-ui/issues/new?assignees=&labels=&template=issue.md',
      '_blank'
    );
  }
  bugReport() {
    window.open(
      'https://github.com/cisagov/domain-manager-ui/issues/new?assignees=&labels=&template=bug.md',
      '_blank'
    );
  }
}
