// Angular Imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Injectable()
export class AboutService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}
  getAbout() {
    const url = `${this.settingsService.settings.apiUrl}/api/about/`;
    return this.http.get(url);
  }
}
