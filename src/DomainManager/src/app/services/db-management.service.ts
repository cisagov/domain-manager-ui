// Angular Imports
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class DBManagementService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  dumpDatabaseData() {
    const url = `${this.settingsService.settings.apiUrl}/api/db-mgmt/`;
    return this.http.get(url, headers);
  }

  loadDatabaseData(data) {
    const url = `${this.settingsService.settings.apiUrl}/api/db-mgmt/`;
    return this.http.post(url, data);
  }
}
