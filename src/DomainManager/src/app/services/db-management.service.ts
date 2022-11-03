// Angular Imports
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Injectable()
export class DBManagementService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  dumpDatabaseData() {
    const url = `${this.settingsService.settings.apiUrl}/api/db-mgmt/`;
    return this.http.get(url, { responseType: 'blob' });
  }

  loadDatabaseData(data) {
    const url = `${this.settingsService.settings.apiUrl}/api/db-mgmt/`;
    return this.http.post(url, data);
  }
}
