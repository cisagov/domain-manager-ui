import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsHttpService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService,
  ) {}

  initializeApp(): Promise<void> {
    return new Promise((resolve) => {
      this.http
        .get('assets/settings.json')
        .toPromise()
        .then((response) => {
          this.settingsService.settings = <Settings>response;
          resolve();
        });
    });
  }
}
