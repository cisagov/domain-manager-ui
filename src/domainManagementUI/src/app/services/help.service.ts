// Angular Imports
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Injectable()
export class HelpService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
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
}
