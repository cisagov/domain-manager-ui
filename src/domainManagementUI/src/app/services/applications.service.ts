// Angular Imports
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

// Local Services
import { environment } from 'src/environments/environment';

// Models
import { ApplicationModel } from 'src/app/models/application.model';
import { DomainModel } from '../models/domain.model';

@Injectable()
export class ApplicationService {
  application_list = []; // This needs to go as well.
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  getApplicationNameByUUID(uuid: string) {
    console.log('This method needs to go.');
  }

  async getApplications() {
    const url = `${this.settingsService.settings.apiUrl}/api/applications/`;
    return this.http.get<ApplicationModel[]>(url).toPromise();
  }

  getAllApplications() {
    const url = `${this.settingsService.settings.apiUrl}/api/applications/`;
    return this.http.get(url);
  }

  getApplication(id: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/application/${id}/`;
    return this.http.get(url);
  }

  deleteApplication(id: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/application/${id}/`;
    return this.http.delete(url);
  }

  updateApplication(id: string, data: ApplicationModel) {
    const url = `${this.settingsService.settings.apiUrl}/api/application/${id}/`;
    return this.http.put(url, data);
  }

  createApplication(application: ApplicationModel) {
    const url = `${this.settingsService.settings.apiUrl}/api/applications/`;
    return this.http.post(url, application);
  }

  getDomainsByApplication(id: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domains/?application_id=${id}`;
    return this.http.get(url);
  }
}
